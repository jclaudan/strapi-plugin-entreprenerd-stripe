'use strict';

// module.exports = {};
module.exports = (options, { strapi }) => {
  return async (ctx, next) => {
    const start = Date.now();
    await next();
    const delta = Math.ceil(Date.now() - start);

    strapi.log.http(`Custum Log => ${ctx.method} ${ctx.url} (${delta} ms) ${ctx.status}`);
  };
};
