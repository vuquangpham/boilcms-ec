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
        // simple input
        const name = request.body.name;
        const description = request.body.description;
        const visibility = request.body.visibility;
        const productType = request.body.productType
        const price = request.body.price;
        const salePrice = request.body.salePrice;
        const inventory = request.body.inventory

        // variable input
        const attributeName = request.body.attributeName
        const attributeValue = request.body.attributeValue
        const variable_qty = request.body.variable_qty;
        const variable_price = request.body.variable_price;
        const variable_sale_price = request.body.variable_sale_price;
        const variable_description = request.body.variable_description;

        // define array for variable product
        let attributes = []
        let variations = []

        // if productType is 'variable'
        if(attributeName && variable_qty){

            let selectName = attributeName.map(attribute => `attribute_${attribute.toLowerCase()}`);
            let selectValue = selectName.map(value => request.body[value])

            for (let i = 0; i < attributeName.length; i++) {
                attributes[i] = {}
                attributes[i].name = attributeName[i];
                attributes[i].value = splitString(attributeValue[i], '|')
            }

            for (let i = 0; i < variable_qty.length; i++) {
                variations[i] = {};

                variations[i].price = variable_price[i];
                variations[i].salePrice = variable_sale_price[i];
                variations[i].description = variable_description[i];
                variations[i].qty = variable_qty[i];
                variations[i].attribute = []

                for(let j = 0; j < attributeName.length; j ++) {

                    // attribute name:  [ 'size', 'color' ]
                    // select value:  [ [ 'S', 'L' ], [ 'black', 'white' ] ]
                    variations[i].attribute[j] = {};
                    variations[i].attribute[j].name = attributeName[j]
                    variations[i].attribute[j].value = selectValue[j][i]
                }
            }
        }

        const returnObject = {
            name,
            description,
            visibility,
            productType,
            price,
            salePrice,
            inventory,
            attributes,
            variations
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