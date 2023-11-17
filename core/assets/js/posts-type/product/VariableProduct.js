
export default class VariableProduct {
    constructor(productWrapper, variableProductWrapper) {
        this.productWrapper = productWrapper;
        this.variableProductWrapper = variableProductWrapper;

        this.elements = {

            // DOM
            variableProduct: variableProductWrapper.querySelector('[data-variable-product]'),

            // variable
            taxonomyProductAttributes: variableProductWrapper.querySelector('[data-taxonomy]'),

            // variation
            variationProductDOM: variableProductWrapper.querySelector('[data-variation-product]'),
            singleProductVariation: variableProductWrapper.querySelector('[data-single-variation]'),

            // input
            productName: productWrapper.querySelector('[data-product-name]'),
            productDescription: productWrapper.querySelector('[data-product-description]'),
            productVariableInventory: variableProductWrapper.querySelector('[data-variable-product-inventory]'),
            attributesName: variableProductWrapper.querySelector('[data-attribute-name]'),
            productTypeValue: variableProductWrapper.querySelector('[data-productType-value]'),
            // productName: wrapper.querySelector

            // textarea json
            variableProductJSONElement: variableProductWrapper.querySelector('[data-variable-product-json]')

        }

        this.attributeIndex = 1;
        this.variationIndex = 0;

        this.variableProductWrapper.addEventListener('click', this.handleWrapperClick.bind(this));
    }

    /**
     * Add new attribute product
     * */
    handleAddNewAttribute() {

        // create child
        const newAttribute = document.createElement('div');
        newAttribute.innerHTML = this.elements.taxonomyProductAttributes.outerHTML
        newAttribute.setAttribute('data-attribute-number', this.attributeIndex)

        // replace input, textarea name by the increasing index
        newAttribute.querySelectorAll('input, textarea').forEach(
            input => {
                input.name = input.name.replace(/\[\d+]/, '[' + this.attributeIndex + ']');

            }
        )

        this.elements.variableProduct.appendChild(newAttribute)

        // increase index
        this.attributeIndex++
    }

    /**
     * Handle replace attribute name label
     * */
    updateAttributeNameLabel(target) {
        // TODO when attribute input name set, then data-attribute-name is set
    }

    /**
     * Delete attribute
     * */
    handleDeleteAttribute(target) {
        const taxonomyAttribute = target.closest('[data-attribute-number]')
        taxonomyAttribute.remove()
    }

    splitString = (currentString, character = ' ') => {
        return currentString.split(character).map(value => value.trim())
    }

    /**
     * Save attribute
     * */
    generateDOMToObject() {
        let attribute = {}
        let attributeName = [];
        let attributeValue = [];
        this.variableProductWrapper.querySelectorAll('[data-attribute-product-name] input').forEach(input => {
            attributeName.push(input.value)
        })
        this.variableProductWrapper.querySelectorAll('[data-attribute-product-value] textarea').forEach(textarea => {
            attributeValue.push(textarea.value);
        })

        for(let i = 0; i < attributeName.length; i++){
            attribute[attributeName[i]] = this.splitString(attributeValue[i], '|')
        }

        const product = {
            name: this.elements.productName.value,
            description: this.elements.productDescription.value,
            inventory: this.elements.productVariableInventory.value,
            attribute: [],
            variation: []
        };

        console.log('product', product)

        for (let key in attribute){
            product.attribute.push({
                name: key,
                value: attribute[key]
            })
        }

        return product
    }

    /**
     * Save
     * */
    save() {
        this.elements.variableProductJSONElement.innerHTML = JSON.stringify(this.generateDOMToObject())
    }

    /**
     * Add variation manually
     * */
    handleAddNewVariation() {
        // when attribute doesn't save can create new variation
        if(!this.elements.variableProductJSONElement.innerHTML) return

        const productElement = JSON.parse(this.elements.variableProductJSONElement.innerHTML)

        let selectHTML = '';
        for(let i = 0; i < productElement.attribute.length; i++){
            selectHTML +=
                `    <label for="${productElement.attribute[i].name}">${productElement.attribute[i].name}</label>
                     <select data-easy-select name="attribute_${productElement.attribute[i].name.toLowerCase()}[0]" id="${productElement.attribute[i].name}">`
            productElement.attribute[i].value.forEach(value => {
                selectHTML += `<option value="${value}">${value}</option>`

            })
            selectHTML += `</select>`
        }

        // create child
        const newVariation = document.createElement('div');

        newVariation.innerHTML = `
                            <div data-single-variation>
                                <div>
                                    <div data-variation-name>New Variation</div>
                                    <button type="button" data-delete-variation>Remove</button>
                                </div>

                                <!-- attributes drop down-->
                                <div>${selectHTML}</div>

                                <!-- variation detail -->
                                <div data-variation-detail>
                                    <div class="products-detail__qty">
                                        <label for="qty">Qty</label>
                                        <input type="text" placeholder="Qty" id="qty" name="variable_qty[0]"
                                               class="w100" >
                                    </div>

                                    <div class="products-detail__price">
                                        <label for="price">Price ($)</label>
                                        <input type="text" placeholder="Price" id="price" name="variable_price[0]"
                                               class="w100">
                                    </div>

                                    <div class="products-detail__sale-price">
                                        <label for="sale-price">Sale Price ($)</label>
                                        <input type="text" placeholder="Sale price" id="sale-price" name="variable_sale_price[0]"
                                               class="w100">
                                    </div>

                                    <div class="products-detail__description">
                                        <label for="description" class="hidden">Product Description</label>
                                        <textarea type="text" placeholder="Description" id="description" name="variable_description[0]" required
                                                  class="w100"></textarea>
                                    </div>

                                </div>
                            </div>`

        newVariation.setAttribute('data-variation-number', this.variationIndex)

        // replace input, textarea name by the increasing index
        newVariation.querySelectorAll('input, textarea, select').forEach(
            input => {
                input.name = input.name.replace(/\[\d+]/, '[' + this.variationIndex + ']');

            }
        )
        this.elements.variationProductDOM.appendChild(newVariation)

        // increase index
        this.variationIndex++
    }

    /**
     * Delete variation
     * */
    handleDeleteVariation(target) {
        const variationEl = target.closest('[data-variation-number]');
        if(variationEl) variationEl.remove();
    }

    /**
     * Handle click product detail
     * */
    handleWrapperClick(e) {
        let functionHandling = () => {
        }
        let target = null;

        // attribute
        const addNewAttributeBtnEl = e.target.closest('button[data-add-new-attribute]');
        const deleteAttributeBtnEl = e.target.closest('button[data-delete-attribute]');
        const saveAttributeBtnEl = e.target.closest('[data-save-attribute]');

        // variation
        const addNewVariationBtnEl = e.target.closest('button[data-add-new-variation]');
        const deleteVariationBtnEl = e.target.closest('button[data-delete-variation]');


        // add new attribute
        if (addNewAttributeBtnEl) {
            functionHandling = this.handleAddNewAttribute.bind(this);
        }

        // delete attribute
        else if (deleteAttributeBtnEl) {
            functionHandling = this.handleDeleteAttribute.bind(this);
            target = deleteAttributeBtnEl
        }

        // save attribute
        else if(saveAttributeBtnEl) {
            functionHandling = this.generateDOMToObject.bind(this);
        }

        // add new variation
        else if(addNewVariationBtnEl) {
            functionHandling = this.handleAddNewVariation.bind(this);
        }

        // delete variation
        else if(deleteVariationBtnEl) {
            functionHandling = this.handleDeleteVariation.bind(this);
            target = deleteVariationBtnEl;
        }

        functionHandling(target);
    }
}