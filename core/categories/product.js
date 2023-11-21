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
    name: 'Products',
    url: '/products',
    type: 'products',
    contentType: Types.types.PRODUCTS,
    children: [
        {
            name: 'Add product',
            url: '?action=add'
        }
    ]
})