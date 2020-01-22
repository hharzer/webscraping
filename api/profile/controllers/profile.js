'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async findOne (ctx) {
        const {id} = ctx.params;
        return strapi.query('profile').model
        .findById(id)
        .populate({
            path: 'user',
            select: 'username email id'
        })
    },
    async update (ctx) {
        const {id} = ctx.params;
        const {likes, downloads, picture} = ctx.request.body;
        const user = await strapi.query('profile').model.findById(id);
        let objUpdate = {}
        if(user) {
            if(likes) {
                const lkIndex = user.likes.indexOf(likes);
                console.log('lkIndex',lkIndex);
                if (lkIndex > -1)
                    user.likes.splice(lkIndex, 1)
                else
                    user.likes.push(likes);
                objUpdate.likes = user.likes;
            }
            if (downloads) {
                const dwIndex = user.downloads.indexOf(downloads);
                if (dwIndex > -1) 
                    user.downloads.splice(dwIndex, 1)
                else 
                    user.downloads.push(downloads);
                objUpdate.downloads = user.downloads;
            }
            if (picture) {
                objUpdate.picture = picture;
            }

        }
        console.log(objUpdate)
        return strapi.query('profile').update({id},objUpdate)
        .then(r => ctx.send({"done": true}))
        .catch(e => ctx.send({"error": true}))
    }
};
