'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    find() {
        return strapi.query('category').model
        .find()
        .populate({
            path: 'categories',
            // Get friends of friends - populate the 'friends' array for every friend
            populate: { path: 'categories' }
        })
        .find({ category:  null })
    }
};
