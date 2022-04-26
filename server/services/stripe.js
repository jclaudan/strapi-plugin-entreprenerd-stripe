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
      const createdProduct = await stripe.products.create(product)
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
