export default class SimpleProduct {
    constructor(productWrapper, simpleProductWrapper) {
        this.productWrapper = productWrapper;
        this.simpleProductWrapper = simpleProductWrapper;

        this.elements = {
            // input
            productName: productWrapper.querySelector('[data-product-name]'),
            productDescription: productWrapper.querySelector('[data-product-description]'),
            productSimpleInventory: simpleProductWrapper.querySelector('[data-simple-product-inventory]'),
            productSimplePrice: simpleProductWrapper.querySelector('[data-simple-product-price]'),
            productSimpleSalePrice: simpleProductWrapper.querySelector('[data-simple-product-sale-price]'),

            // json textarea
            simpleProductJSONElement: simpleProductWrapper.querySelector('[data-simple-product-json]')
        }
    }

    generateDOMToObject() {
        const returnObject = {
            name: this.elements.productName.value,
            description: this.elements.productDescription.value,
            inventory: this.elements.productSimpleInventory.value,
            price: this.elements.productSimplePrice.value,
            salePrice: this.elements.productSimpleSalePrice.value,
        }

        return returnObject
    }

    save(){
        this.elements.simpleProductJSONElement.innerHTML = JSON.stringify(this.generateDOMToObject());
    }

}