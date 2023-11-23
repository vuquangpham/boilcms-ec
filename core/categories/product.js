const Category = require("../../core/classes/category/category");
const Types = require("../../core/classes/utils/type");

class Product extends Category{
    constructor(config){
        super(config);
    }

    /**
     * Validate input product
     * */
    validateInputData(inputData, action = 'add'){
        const request = inputData.request;

        // vars
        const name = request.body.name;
        const description = request.body.description;
        const type = request.body.type;
        const simpleProductJSON = request.body.simpleProductJSON;
        const variableProductJSON = request.body.variableProductJSON;

        return {
            name,
            description,
            type,
            simpleProductJSON,
            variableProductJSON
        };
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
});