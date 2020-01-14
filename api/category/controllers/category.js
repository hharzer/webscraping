'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    find(){
        return strapi.query('category').find({},['category_parent','category_child']);
    }
};
