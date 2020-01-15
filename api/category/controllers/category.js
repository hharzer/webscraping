'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    find() {
        return strapi.query('category').model
        .find({ categ_parents: [] })
        .populate({
            path: 'categ_children',
            select: 'name color',
            // Get friends of friends - populate the 'friends' array for every friend
            populate: { 
                path: 'categ_children',
                select: 'name color',
            }
        })
        .select('name color');
    },
    findParent() {
        return strapi.query('category').model
        .find({ categ_parents: [] })
        .select('name color');
    },
    findStories(){
        return strapi.query('category').model
        .find({ name: 'Stories' })
        .populate({
            path: 'articles',
        })
    }
};
