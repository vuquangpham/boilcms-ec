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
        const request = inputData.request;
        const response = inputData.response;

        // input
        const visibility = request.body.visibility;
        const productType = request.body.productType;
        const simpleProductContent = request.body.simpleJSON;
        const variableProductContent = request.body.variableJSON;


        const returnObject = {
            visibility,
            productType,
            simpleProductContent,
            variableProductContent
        };

        if (action === 'edit') returnObject.response = response

        return returnObject;
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