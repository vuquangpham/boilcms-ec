const DefaultType = require('../../database/default/model');
const PostType = require('../../database/posts/model');
const MediaType = require('../../database/media/model');
const UserType = require('../../database/user/model');
const ProductType = require('../../database/product/model');
const OrderType = require('../../database/order/model');
const ContactType = require('../../database/contact/model');

class Type{
    constructor(){
        this.types = {
            DEFAULT: {
                name: 'default',
                model: DefaultType
            },
            POSTS: {
                name: 'posts',
                model: PostType
            },
            MEDIA: {
                name: 'media',
                model: MediaType
            },
            USER: {
                name: 'user',
                model: UserType
            },
            PRODUCTS: {
                name: 'products',
                model: ProductType
            },
            ORDERS: {
                name: 'orders',
                model: OrderType
            },
            CONTACT: {
                name: 'contact',
                model: ContactType
            },
            ACCOUNT: {
                name: 'account',
                isCustomType: true,
            }
        };
    }

    /**
     * Validate type
     * @param type {string}
     * @return boolean
     * */
    isValidType(type){
        return !!Object.values(this.types).find(instance => instance === type);
    }
}

module.exports = new Type();