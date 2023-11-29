const Category = require('../classes/category/category');
const Variation = require('../database/product/variation.model');
const Type = require('../classes/utils/type');
const {getProductViaVariation} = require("../utils/helper.utils");

class Order extends Category{
    constructor(config){
        super(config);
    }

    validateInputData(inputData){
        const request = inputData.request;

        // vars
        const variations = typeof request.body.variation === 'string' ? [request.body.variation] : request.body.variation;
        const quantities = request.body.quantity;

        variations.map(async id => {

            // get product based on variation
            const variation = await Variation.findById(id);
            const [product, productVariation] = await getProductViaVariation(variation);

            // update variation

        });
        console.log(variations);
        return request;
    }
}

module.exports = new Order({
    name: 'Orders',
    url: '/orders',
    type: 'orders',
    contentType: Type.types.ORDERS,
    order: 99
});