const Category = require("../../core/classes/category/category")
const Types = require("../../core/classes/utils/type")
const {splitString} = require("../../core/utils/helper.utils")

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
        const name = request.body.name;
        const description = request.body.description;
        const visibility = request.body.visibility;
        const productType = request.body.productType
        const price = request.body.price;
        const salePrice = request.body.salePrice;
        const inventory = request.body.inventory

        // get attribute values
        const attributeName = request.body.attributeName
        const attributeValue = request.body.attributeValue
        let attributes = {}

        for (let i = 0; i < attributeName.length; i++) {
            attributes[attributeName[i]] = splitString(attributeValue[i], '|')

        }

        const returnObject = {
            name,
            description,
            visibility,
            productType,
            price,
            salePrice,
            inventory,
            attributes
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