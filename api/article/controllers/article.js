module.exports = {
    async featured (ctx) {
        const {id} = ctx.params;
        return await strapi.services.article.featured(id);
    },
    async findOne (ctx) {
        const {id} = ctx.params;
        return await strapi.services.article.findOne(id);
    },
    async find(ctx) {
        const {_start, _limit} = ctx.params;
        return await strapi.services.article.find(_start, _limit);
    },
    async pgScraping (ctx) {
        const {site}  = ctx.params;
        return await strapi.services.article.pgSpider(site);
    },
    async catScraping(ctx) {
        const {site}  = ctx.params;
        return await strapi.services.article.catSpider(site);
    },
    async scraping(ctx) {
        const {site, limit}  = ctx.params;
        return await strapi.services.article.artSpider(site, limit);
    }
};
