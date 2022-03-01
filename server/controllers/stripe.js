'use strict';

const unitializedStripe = require('stripe')

/**
 * stripe.js controller
 *
 * @description: A set of functions called "actions" of the `stripe` plugin.
 */

module.exports = {

  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    // Add your own logic here.

    // Send 200 `ok`
    ctx.send({
      message: 'ok'
    });
  },

  updateSettings: async (ctx) => {
    const {user} = ctx.state
    const {pk, frontUrl} = ctx.request.body

    //Ensure user is admin
    if(user.roles[0].id != 1){
      return ctx.unauthorized("Only administrators allowed!")
    }

    if(!pk){
      return ctx.throw(400, "Please provide a private key")
    }

    if(!frontUrl){
      return ctx.throw(400, "Please provide a private key")
    }
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'entreprenerd_stripe'
    })

    const resultPk = await pluginStore.set({ key: 'pk', value: pk })
    const resultFrontUrl = await pluginStore.set({ key: 'frontUrl', value: frontUrl })
    ctx.send({
      resultPk,
      resultFrontUrl,
    })
  },

  retrieveSettings: async (ctx) => {
    const {user} = ctx.state

    if(user.roles[0].id != 1){
      return ctx.unauthorized("Only admins")
    }

    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'entreprenerd_stripe'
    })

    const pk = await pluginStore.get({ key: 'pk' })
    const frontUrl = await pluginStore.get({ key: 'frontUrl' })

    ctx.send({
      pk: pk ? pk : '',
      frontUrl: frontUrl ? frontUrl : '',
    })
  },

  createPayement: async (ctx) => {
    // TODO: ADD LOGIC STRPIE CHECKOUT
    const isEmail = String(ctx.request.body.data.email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    if (!isEmail) return ctx.throw(400, "Please provide a email")
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'entreprenerd_stripe'
    })

    const pk = await pluginStore.get({key: 'pk'})

    const stripe = unitializedStripe(pk)
    const cart = await strapi.db.query('api::cart.cart').findOne({ id: ctx.request.body.data.cartId })
    const productsId = Object.keys(cart.content).map(key => key)
    const productList = await strapi.db.query('api::product.product')
      .findMany({
          where: {
            id: {
              $in: productsId,
            },
          },
          populate: ['price'],
        })
    
    const lineItems = productList.map(product => ({
        price: product.price.stripe_price_id,
        quantity: cart.content[product.id].quantity,
      }))
    // console.log('ctx:createPayement:body:', cart.content, productList, ctx.request.body.data.cartId)
    const frontUrl = await pluginStore.get({ key: 'frontUrl' })

    const session = await stripe.checkout.sessions.create({
      customer_email: ctx.request.body.data.email,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${frontUrl}/success-payement`,
      cancel_url: `${frontUrl}/canceled-payement`,
    });
    console.log('session::', session)
    // session.id
    const createdOrder = await strapi.db.query('api::order.order').create({
      data: {
        status: 'pending',
        stripe_session_id: session.id,
        email: ctx.request.body.data.email,
      },
    })
    console.log('createdOrder::', createdOrder)
    ctx.send({ url: session.url })
  },

  stripeWebhook: async (ctx) => {
    const payload = ctx.request.body;
    console.log('ctx.request:body::', ctx.request.body)
    // console.log('ctx.request::', ctx.request)
    console.log("Got payload data: ", payload.data);
    // console.log("Got payload id: ", payload.data.object.id);
    await strapi.db.query('api::order.order').update({
      where: {
        stripe_session_id: payload.data.object.id,
      },
      data: {
        status: payload.data.object.status,
        stripe_init_session: payload.data.object,
      },
    })
    
    ctx.send({ success: true })
  }
};
