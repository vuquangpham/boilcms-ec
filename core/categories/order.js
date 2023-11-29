const Category = require('../classes/category/category');
const Type = require('../classes/utils/type');

class Order extends Category{
    constructor(config){
        super(config);
    }
}

module.exports = new Order({
    name: 'Orders',
    url: '/orders',
    type: 'orders',
    contentType: Type.types.ORDERS,
    order: 99
});