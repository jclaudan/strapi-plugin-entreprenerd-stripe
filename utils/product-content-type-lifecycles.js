
const stripePlugin = strapi.plugin('strapi-v4-plugin-entreprenerd-stripe').service('stripe')
const logContext = '[Product]'
const isNeedToUpdate = (currentStripeData, { publishedAt, description }) => {
  const tmp = {}
  if (currentStripeData.active !== !!publishedAt) {
    tmp.active = !!publishedAt
  }
  if (description !== currentStripeData.description) {
    tmp.description = description
  }

  if (Object.keys(tmp).length) {
    return tmp
  }
  return false

}

module.exports = {
  beforeCreate(event) {
    console.log('beforeCreate:Product:', event)

    // const { id, name, description, active } = event.data
    //   const test = await strapi.plugin('strapi-v4-plugin-entreprenerd-stripe')
    //     .service('stripe')
    //     .createProduct({ name, description, active })

  },

  async afterCreate(event) {
    const { id, title, description, publishedAt } = event.result
    console.log('afterCreate:Product:', event.result)

    const response = await stripePlugin.createProduct({ name: title, description, active: !!publishedAt })

    if (response.success) {
      const updatedProduct = await strapi.db.query('api::product.product').update({
        where: { id: id },
        data: {
          stripe_product_id: response.data.id,
        },
      })
      strapi.log.http(`afterCreate${logContext}: ${response.success}  ${response.data} ${updatedProduct}`)
    } else {
      // TODO: DELETE PRODUCT
      const deletedProduct = await strapi.db.query('api::product.product').delete({ id: id })
      strapi.log.http(`afterCreate${logContext}: ${response.success}  ${response.error} ${deletedProduct}`)
    }
  },

  beforeDelete(event) {
    console.log('beforeDelete:Product:', event)
  },

  async afterDelete(event) {
    console.log('afterDelete:Product:', event)
    const { stripe_product_id } = event.result
    const response = await stripePlugin.deleteProduct(stripe_product_id)
    if (response.success) {
      strapi.log.http(`afterDelete${logContext}: ${response.success}  ${response.data}`)
    } else {
      strapi.log.http(`afterDelete${logContext}: ${response.success}  ${response.error}`)
    }
  },

  async afterUpdate(event) {
    const { stripe_product_id, publishedAt, description } = event.result;
    const responseStripeProduct = await stripePlugin.getProductById(stripe_product_id)
    console.log('afterUpdate:Product:', event, responseStripeProduct)
    if (responseStripeProduct.success) {
      const result = isNeedToUpdate(responseStripeProduct.data, { publishedAt, description })
      if (result) {
        const response = await stripePlugin.updateProduct(stripe_product_id, result)
        if (response.success) {
          strapi.log.http(`afterUpdate${logContext}: ${response.success}  ${response.data}`)
        } else {
          strapi.log.http(`afterUpdate${logContext}: ${response.success}  ${response.error}`)
        }
      }
    } else {
      strapi.log.http(`afterUpdate${logContext}: ${isNeedToUpdate.success}  ${isNeedToUpdate.error}`)
    }
  },
};
