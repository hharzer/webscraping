'use strict';

const request = require('request-promise');
const cheerio = require('cheerio');

module.exports = {
    async find (_start, _limit) {
        return await strapi.query('article').find({_start, _limit, status: 'finish'});
    },
    async featured (id) {
        return await strapi.query('article').findOne({category: id});
    },
    /**                
    * 
    * @param {mdata.menu_item} get the categories
    * @param {mdata.pagination_item} get the titles
    * @param {mdata.pagination_next} get the next link
    */
    async catSpider(nsite) {
        const site = await strapi.query('site').findOne({url: {$regex : `.*${nsite}.*`}});
        const mdata = site.metadatum;
        const catOptions = {uri: site.url, transform: (body) => cheerio.load(body)};
        await request(catOptions).then(async ($) => {
            $(mdata.menu_item).each(async function( index ) {
                if (index != 0) {
                    const name = $(this).text();
                    let link = $(this).attr('href');
                    if (nsite == 'le360') {
                        link = site.url+link;
                    }
                    // console.log('categories', {name, link});
                    await strapi.query('category')
                        .create({name, link, site: site.id, pagination: link})
                        .then(cat => console.log(cat.name+' created !'))
                        .catch(err => console.log('title duplicated !'));
                }
            });
        })
    },

    async pgSpider (nsite) {
        if(nsite) {
            const site = await strapi.query('site').findOne({url: {$regex : `.*${nsite}.*`}});
            if (site)  {
                const mdata = site.metadatum;
                const categories = site.categories;
                for (let [i, cat]of categories.entries()) {
                    if (cat && cat.pagination) {
                        const pagOptions = {uri: cat.pagination, transform: (body) => cheerio.load(body)};
                        await request(pagOptions).then(async ($) => {
                            $(mdata.pagination_item).each(async function (index){
                                let link = $(this).attr('href');
                                const title = $(this).text().trim();
                                if (nsite == 'le360') {
                                    link = site.url+link;
                                }
                                // console.log({title, link, status: 'start', category: cat.id});
                                await strapi.query('article')
                                    .create({title, link, status: 'start', category: cat.id})
                                    .then(art => console.log('title created !'))
                                    .catch(err => console.log('title duplicated !'));
                            });
                            const pagination = $(mdata.pagination_next).attr('href');
                            // console.log('pagination', pagination);
                            await strapi.query('category').update({ id: cat.id },{pagination});
                        })
                    }
                }
            }
        }
    },

    async artSpider (nsite, limit) {
        const site  = await strapi.query('site').findOne({url: {$regex : `.*${nsite}.*`}});
        const mdata = site.metadatum;
        const artsToUpdate = await strapi.query('article').find({ _limit: limit, status: 'start', link: {$regex : `.*${nsite}.*`} });
        for await (let art of artsToUpdate) {
            const artOptions = {uri: art.link, transform: (body) => cheerio.load(body)};
            await request(artOptions).then(async ($) => {
                let images    = [];
                let videos    = [];
                let text    = [];
                let artinfo = [];
                $(mdata.page_images).map(function (elm) { images.push($(this).attr('src'))});
                $(mdata.page_videos).map(function (elm) { videos.push($(this).attr('src'))});
                $(mdata.page_text).map(function (elm) { text.push($(this).text())});
                let featured  = (nsite == 'le360' || nsite == 'eljadida24') 
                    ? $(mdata.page_featured).attr('src')
                    : $(mdata.page_featured).attr('href');

                if (nsite == 'le360' || nsite == 'eljadida24')  {
                    $(mdata.page_author).map(function (elm) { artinfo.push($(this).text())});
                }
                let author    = (nsite != 'le360')
                    ? (nsite == 'eljadida24')
                        ? artinfo[1] : $(mdata.page_author).text()
                    : $(mdata.page_author).text();

                let date = (nsite != 'le360') 
                    ? (nsite == 'eljadida24')
                        ? artinfo[2] : $(mdata.page_date).text()
                    : $(mdata.page_date).text().replace(author,'').replace('Par','').trim();
                
                const content = text.join("\n");
                // console.log('inforametion ==>', {content , date, videos, author, images, featured, status: 'finish'})
                await strapi.query('article').update (
                    { id: art.id },
                    {content , date, videos, author, images, featured, status: 'finish'})
                    .then(r => console.log(r.id+' updated !'))
                    .catch(err => console.log(err));
            })
        }
    }
};
