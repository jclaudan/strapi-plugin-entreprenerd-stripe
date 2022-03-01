const { ApplicationError } = require('@strapi/utils').errors;

const convertToStripeAmount = (amount) => Math.round(amount * 100)
const logContext = '[Price]'

const checkUpdatePrice = (priceData) => {
  const allKey = [
    'unit_amount',
    'currency',
    'recurring',
    'metadata',
    'nickname',
    'product_data',
    'tiers',
    'tiers_mode',
    'billing_scheme',
    'lookup_key',
    'tax_behavior',
    'transfer_lookup_key',
    'transform_quantity',
    'unit_amount_decimal',
    'product',
  ]

  const keyTools = {
    ['unit_amount']: (value) => {
      return convertToStripeAmount(value)
    },
    ['recurring']: (value) => {
      return value || {}
    },
    ['product']: (value) => {
      return value.stripe_product_id
    },
  }

  const shapedPriceData = allKey.reduce((acc, key) => {
    if (priceData[key]) {
      if (keyTools[key]) {
        acc[key] = keyTools[key](priceData[key])
      } else {
        acc[key] = priceData[key]
      }
      return acc
    }
    return acc
  }, { ['active']: !!priceData.publishedAt })

  return shapedPriceData
}

module.exports = {
  beforeCreate(event) {
    const dataParams = event.params.data
    if (!dataParams.hasOwnProperty('product') || !dataParams.product) {
      throw new ApplicationError('Please select a existing Product')
    }
  },

  async afterCreate(event) {
    // TODO: Add ALL KEY
    const { id, unit_amount, currency, recurring, product, publishedAt } = event.result
    const shapedPrice = checkUpdatePrice(event.result)
    console.log('afterCreate01:Price:', shapedPrice, event.result)
    // unit_amount: 2000,
    //   currency: 'eur',
    //   recurring: {interval: 'month'},
    //   product: 'prod_LIKOgubzmujr5u',
    // try {

      const amount = convertToStripeAmount(unit_amount)
      const response = await strapi.plugin('strapi-v4-plugin-entreprenerd-stripe')
        .service('stripe')
        .createPrice({
          unit_amount: amount,
          currency,
          recurring: recurring || {},
          product: product.stripe_product_id,
          active: !!publishedAt,
        })

        const updatedPrice = await strapi.db.query('api::price.price').update({
          where: { id: id },
          data: {
            stripe_price_id: response.data.id,
          },
        })
      strapi.log.http(`afterCreate${logContext}: ${response.success} ${response.data} --- ${updatedPrice}`)

      // console.log('afterCreate:Price:', { id, unit_amount: convertToStripeAmount(unit_amount), product, response })

    // } catch (error) {
      // console.log('error::', error)
      // throw new Error('Fail to create stripe product')
    // }
  },

  beforeUpdate(event) {
    // const { data, where, select, populate } = event.params;
    console.log('beforeUpdate:Price:', event)
    // let's do a 20% discount everytime
    // event.params.data.price = event.params.data.price * 0.8;
  },

  async afterUpdate(event) {
    // const { data, where, select, populate } = event.params;
    const { stripe_price_id, publishedAt } = event.result;
    // console.log('checkUpdatePrice::', checkUpdatePrice(event.result))
    const response = await strapi.plugin('strapi-v4-plugin-entreprenerd-stripe')
      .service('stripe')
      .updatePrice(stripe_price_id, { active: !!publishedAt })
    // console.log('afterUpdate:Price:', event)
    if (response.success) {
      strapi.log.http(`afterUpdate${logContext}: ${response.success}  ${response.data}`)
    } else {
      strapi.log.http(`afterUpdate${logContext}: ${response.success}  ${response.error}`)
    }
    // let's do a 20% discount everytime
    // event.params.data.price = event.params.data.price * 0.8;
  },

  beforeDelete(event) {
    // const { data, where, select, populate } = event.params;
    console.log('beforeDelete:Price:', event)
    // let's do a 20% discount everytime
    // event.params.data.price = event.params.data.price * 0.8;
  },

  async afterDelete(event) {
    const { stripe_price_id } = event.result;
    const response = await strapi.plugin('strapi-v4-plugin-entreprenerd-stripe')
      .service('stripe')
      .updatePrice(stripe_price_id, { active: false })
    if (response.success) {
      strapi.log.http(`afterDelete${logContext}: ${response.success}  ${response.data}`)
    } else {
      strapi.log.http(`afterDelete${logContext}: ${response.success}  ${response.error}`)
    }
  },
};
