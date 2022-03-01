module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: 'stripe.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/settings',
    handler: 'stripe.retrieveSettings',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/settings',
    handler: 'stripe.updateSettings',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/pay',
    handler: 'stripe.createPayement',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/webhook',
    handler: 'stripe.stripeWebhook',
    config: {
      policies: [],
      auth: false,
    },
  },
];
