const Type = require("../classes/utils/type");
const POSTS = require('../classes/category/posts-category');

class Posts extends POSTS{
    constructor(config){
        super(config);
    }
}

module.exports = new Posts({
    name: 'Post',
    url: '/posts',
    type: 'posts',
    contentType: Type.types.POSTS,
    children: [
        {
            name: 'Add new',
            url: '?post_type=post&action=add'
        },
    ],
});