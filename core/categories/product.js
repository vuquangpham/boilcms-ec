const Category = require("../../core/classes/category/category")
const Types = require("../../core/classes/utils/type")

class Product extends Category {
    constructor(config) {
        super(config);
    }

    /**
     * Validate input product
     * */
    validateInputData(inputData, action = 'add') {
        return {};
    }
}

module.exports = new Product({
    name: 'Product',
    url: '/product',
    type: 'product',
    contentType: Types.types.PRODUCTS,
    children: [
        {
            name: 'Add products',
            url: '?action=add'
        }
    ]
})