'use strict';

var request = require('request-promise');
const cheerio = require('cheerio');

module.exports = {
    async checkSite () {
        return strapi.query('site').find()
        .then((site) => {
            const pgts = site[0].paginations
                .map(p => ({ name: p.name, pages_number: p.pages_number }));
            const metadata = site[0].metadatum;
            const pgtUrl = metadata.pagination_url;
            const pgtMdata = Object.keys(metadata)
                .filter(key  => key.startsWith('pagination_'))
                .reduce((obj, key) => {
                    obj[key] = metadata[key];
                    return obj;
                  }, {});
            const pgeMdata = Object.keys(metadata)
                .filter(key  => key.startsWith('page_'))
                .reduce((obj, key) => {
                    obj[key] = metadata[key];
                    return obj;
                  }, {});
            const cmtMdata = Object.keys(metadata)
                .filter(key  => key.startsWith('comment_'))
                .reduce((obj, key) => {
                    obj[key] = metadata[key];
                    return obj;
                  }, {});
            
            return {
                pgts,
                pgtUrl,
                pgtMdata,
                pgeMdata,
                cmtMdata}
        })
        .then(async mdata => {
            await strapi.services.pagination.store(mdata.pgts, mdata.pgtUrl, mdata.pgtMdata);
        })
    }
};
