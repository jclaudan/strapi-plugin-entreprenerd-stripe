
// const stripePlugin = strapi.plugin('strapi-v4-plugin-entreprenerd-stripe').service('stripe')
// const logContext = '[Product]'
// const isNeedToUpdate = (currentStripeData, { publishedAt, description }) => {
//   const tmp = {}
//   if (currentStripeData.active !== !!publishedAt) {
//     tmp.active = !!publishedAt
//   }
//   if (description !== currentStripeData.description) {
//     tmp.description = description
//   }

//   if (Object.keys(tmp).length) {
//     return tmp
//   }
//   return false

// }
const { ApplicationError } = require('@strapi/utils').errors;

module.exports = {
  beforeCreate(event) {
    console.log('beforeCreate:Cart:', event)
    try {
      JSON.parse(event.params.data.content)
    } catch (error) {
      throw new ApplicationError('Some message you want to show in the admin UI', 500);
    }
  },

  async afterCreate(event) {
  //
  },

  beforeDelete(event) {
    // console.log('beforeDelete:Cart:', event)
  },

  async afterDelete(event) {
    //
  },
  async beforeUpdate(event) {
    console.log('beforceUpdate:Cart:', event)
    try {
      // TODO: check if content is valid json with valid product
      JSON.parse(event.params.data.content)
    } catch (error) {
      throw new ApplicationError('Some message you want to show in the admin UI', 500);
    }
  },

  async afterUpdate(event) {
    //
  },
};
