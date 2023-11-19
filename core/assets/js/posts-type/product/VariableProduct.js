export default class VariableProduct{
    constructor(productWrapper, variableProductWrapper){
        this.productWrapper = productWrapper;
        this.variableProductWrapper = variableProductWrapper;

        this.elements = {

            // DOM
            variableProduct: variableProductWrapper.querySelector('[data-variable-product]'),

            // variable
            taxonomyProductAttributes: variableProductWrapper.querySelector('[data-taxonomy]'),

            // variation
            variationProductDOM: variableProductWrapper.querySelector('[data-variation-product]'),

            // input
            productName: productWrapper.querySelector('[data-product-name]'),
            productDescription: productWrapper.querySelector('[data-product-description]'),
            productVariableInventory: variableProductWrapper.querySelector('[data-variable-product-inventory]'),

            // textarea json
            variableProductJSONElement: variableProductWrapper.querySelector('[data-variable-product-json]')

        };

        this.attributeIndex = 1;
        this.variationIndex = 0;

        this.variableProductWrapper.addEventListener('click', this.handleWrapperClick.bind(this));
    }

    /**
     * Add new attribute product
     * */
    handleAddNewAttribute(){

        // create child
        const newAttribute = document.createElement('div');
        newAttribute.innerHTML = this.elements.taxonomyProductAttributes.outerHTML;
        newAttribute.setAttribute('data-attribute', '');

        // replace input, textarea name by the increasing index
        newAttribute.querySelectorAll('input, textarea').forEach(
            input => {
                input.name = input.name.replace(/\[\d+]/, '[' + this.attributeIndex + ']');

            }
        );

        this.elements.variableProduct.querySelector('[data-attributes-wrapper]').appendChild(newAttribute);

        // increase index
        this.attributeIndex++;
    }

    /**
     * Handle replace attribute name label
     * */
    updateAttributeNameLabel(target){
        // TODO when attribute input name set, then data-attribute-name is set
    }

    /**
     * Delete attribute
     * */
    handleDeleteAttribute(target){
        const taxonomyAttribute = target.closest('[data-attribute]');
        taxonomyAttribute.remove();
    }

    splitString = (currentString, character = ' ') => {
        return currentString.split(character).map(value => value.trim());
    };

    /**
     * Save attribute
     * */
    generateDOMToObject(){

        const attributes = [];
        const variations = [];
        // save attributes
        this.variableProductWrapper.querySelectorAll('[data-attribute]').forEach(e => {
            const name = e.querySelector('[data-attribute-product-name] input').value;
            const values = this.splitString(e.querySelector('[data-attribute-product-value] textarea').value, '|');

            attributes.push({
                name,
                values,
            });
        });

        this.variableProductWrapper.querySelectorAll('[data-variation]').forEach(e => {
            const qty = e.querySelector('[data-variation-qty] input').value;
            const price = e.querySelector('[data-variation-price] input').value;
            const salePrice = e.querySelector('[data-variation-sale-price] input').value;
            const description = e.querySelector('[data-variation-description] textarea').value;

            variations.push({
                qty,
                price,
                salePrice,
                description
            })
        })

        const product = {
            name: this.elements.productName.value,
            description: this.elements.productDescription.value,
            inventory: this.elements.productVariableInventory.value,
            attributes,
            variations
        };

        return product;
    }

    /**
     * Save
     * */
    save(){
        this.elements.variableProductJSONElement.innerHTML = JSON.stringify(this.generateDOMToObject());
    }

    /**
     * Add variation manually
     * */
    handleAddNewVariation(){
        // when attribute doesn't save can create new variation
        if(!this.elements.variableProductJSONElement.innerHTML) return;

        const productElement = JSON.parse(this.elements.variableProductJSONElement.innerHTML);

        let selectHTML = '';
        for(let i = 0; i < productElement.attributes.length; i++){
            console.log('productElement: ', productElement.attributes[i].name)
            selectHTML +=
                `    <label for="${productElement.attributes[i].name}">${productElement.attributes[i].name}</label>
                     <select data-easy-select name="attribute_${productElement.attributes[i].name.toLowerCase()}[0]" id="${productElement.attributes[i].name}" name="data-select-value">`;
            productElement.attributes[i].values.forEach(value => {
                selectHTML += `<option value="${value}">${value}</option>`;

            });
            selectHTML += `</select>`;
        }

        // create child
        const newVariation = document.createElement('div');

        newVariation.innerHTML = `
                            <div data-variation>
                                <div>
                                    <div data-variation-name>New Variation</div>
                                    <button type="button" data-delete-variation>Remove</button>
                                </div>

                                <div data-variation-wrapper>
                                    <!-- attributes drop down-->
                                    <div>${selectHTML}</div>
                                    
                                    <!-- variation detail -->
                                    <div data-variation-detail>
                                        <div data-variation-qty>
                                            <label for="qty">Qty</label>
                                            <input type="text" placeholder="Qty" id="qty" name="variable_qty[0]"
                                                   class="w100" >
                                        </div>
    
                                        <div data-variation-price>
                                            <label for="price">Price ($)</label>
                                            <input type="text" placeholder="Price" id="price" name="variable_price[0]"
                                                   class="w100">
                                        </div>
    
                                        <div data-variation-sale-price>
                                            <label for="sale-price">Sale Price ($)</label>
                                            <input type="text" placeholder="Sale price" id="sale-price" name="variable_sale_price[0]"
                                                   class="w100">
                                        </div>
    
                                        <div data-variation-description>
                                            <label for="description" class="hidden">Product Description</label>
                                            <textarea type="text" placeholder="Description" id="description" name="variable_description[0]" required
                                                      class="w100"></textarea>
                                        </div>
                                        
                                    </div>

                                </div>
                            </div>`;

        newVariation.setAttribute('data-variation-wrapper', '');

        // replace input, textarea name by the increasing index
        newVariation.querySelectorAll('input, textarea, select').forEach(
            input => {
                input.name = input.name.replace(/\[\d+]/, '[' + this.variationIndex + ']');

            }
        );
        this.elements.variationProductDOM.appendChild(newVariation);

        // increase index
        this.variationIndex++;
    }

    /**
     * Delete variation
     * */
    handleDeleteVariation(target){
        const variationEl = target.closest('[data-variation-number]');
        if(variationEl) variationEl.remove();
    }

    /**
     * Handle click product detail
     * */
    handleWrapperClick(e){
        let functionHandling = () => {
        };
        let target = null;

        // attribute
        const addNewAttributeBtnEl = e.target.closest('button[data-add-new-attribute]');
        const deleteAttributeBtnEl = e.target.closest('button[data-delete-attribute]');
        const saveAttributeBtnEl = e.target.closest('[data-save-attribute]');

        // variation
        const addNewVariationBtnEl = e.target.closest('button[data-add-new-variation]');
        const deleteVariationBtnEl = e.target.closest('button[data-delete-variation]');


        // add new attribute
        if(addNewAttributeBtnEl){
            functionHandling = this.handleAddNewAttribute.bind(this);
        }

        // delete attribute
        else if(deleteAttributeBtnEl){
            functionHandling = this.handleDeleteAttribute.bind(this);
            target = deleteAttributeBtnEl;
        }

        // save attribute
        else if(saveAttributeBtnEl){
            functionHandling = this.save.bind(this);
        }

        // add new variation
        else if(addNewVariationBtnEl){
            functionHandling = this.handleAddNewVariation.bind(this);
        }

        // delete variation
        else if(deleteVariationBtnEl){
            functionHandling = this.handleDeleteVariation.bind(this);
            target = deleteVariationBtnEl;
        }

        functionHandling(target);
    }
}