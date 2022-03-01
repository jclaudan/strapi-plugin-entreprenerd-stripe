'use strict';

const unitializedStripe = require('stripe')

const decoratorResponse = (data, error = null) => {
  if (error) {
    return {
      success: false,
      error,
    }
  }

  return {
    success: true,
    data,
  }
}
/**
 * stripe.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// strapi.plugin('plugin-name').service('service-name')
module.exports = ({ strapi }) => ({
  async getProductById(productId) {
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'entreprenerd_stripe'
    })
  
    try {
      const pk = await pluginStore.get({key: 'pk'})
      const stripe = unitializedStripe(pk)
      const product = await stripe.products.retrieve(productId)
      // strapi.log.http(`stripePlugin.getProduct: ${createdStripeProduct.success}  ${createdStripeProduct.error}`)
      return decoratorResponse(product)
  
    } catch (error) {
      return decoratorResponse(null, error)
    }
  },

  async createProduct(product) {
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'entreprenerd_stripe'
    })
  
    try {
      const pk = await pluginStore.get({key: 'pk'})
      const stripe = unitializedStripe(pk)
    
      // const templateProduct = {
      //   name: 'T-shirt',
      //   type: 'good',
      // }
      
      const createdProduct = await stripe.products.create(product)
      // strapi.log.http(`stripePlugin.createProduct: ${createdStripeProduct.success}  ${createdStripeProduct.error}`)
      return decoratorResponse(createdProduct)
  
    } catch (error) {
      return decoratorResponse(null, error)
    }
  },

  async updateProduct(productId, data) {
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'entreprenerd_stripe'
    })
  
    try {
      const pk = await pluginStore.get({key: 'pk'})
      const stripe = unitializedStripe(pk)

      const updatedProduct = await stripe.products.update(productId, data)
      return decoratorResponse(updatedProduct)
  
    } catch (error) {
      return decoratorResponse(null, error)
    }
  },

  async deleteProduct(productId) {
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'entreprenerd_stripe'
    })
  
    try {
      const pk = await pluginStore.get({key: 'pk'})
      const stripe = unitializedStripe(pk)
    
      const deletedProduct = await stripe.products.del(productId)
    
      return decoratorResponse(deletedProduct)
  
    } catch (error) {
      return decoratorResponse(null, error)
    }
  },

  async createPrice(price) {
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'entreprenerd_stripe'
    })
  
    try {
      const pk = await pluginStore.get({key: 'pk'})
      const stripe = unitializedStripe(pk)

      // {
      //   unit_amount: 2000,
      //   currency: 'eur',
      //   recurring: {interval: 'month'},
      //   product: 'prod_LIKOgubzmujr5u',
      // }
      

      const createdPrice = await stripe.prices.create(price)
    
      return decoratorResponse(createdPrice)
  
    } catch (error) {
      return decoratorResponse(null, error)
    }
  },

  async updatePrice(priceId, data) {
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'entreprenerd_stripe'
    })
  
    try {
      const pk = await pluginStore.get({key: 'pk'})
      const stripe = unitializedStripe(pk)
    
      const updatedPrice = await stripe.prices.update(priceId, data)
      return updatedPrice
  
    } catch (error) {
      return decoratorResponse(null, error)
    }
  },

  async getPriceById(priceId) {
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'entreprenerd_stripe'
    })
  
    try {
      const pk = await pluginStore.get({key: 'pk'})
      const stripe = unitializedStripe(pk)
    
      const retrievedPrice = await stripe.prices.retrieve(priceId)
      return retrievedPrice
  
    } catch (error) {
      return decoratorResponse(null, error)
    }
  },
});
