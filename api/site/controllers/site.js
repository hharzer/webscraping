'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async find (ctx) {
        const content = await strapi.services.site.checkSite();
        ctx.send({
            content
        })
    }
};

