import fetch from "../../../../../assets/js/fetch";

export default class ProductPost {
    constructor(wrapper) {
        this.wrapper = wrapper

        this.elements = {

            // DOM
            variableProduct: wrapper.querySelector('[data-variable-product]'),
            simpleProduct: wrapper.querySelector('[data-simple-product]'),

            // variable
            taxonomyProductAttributes: wrapper.querySelector('[data-taxonomy]'),

            // variation
            variationProductDOM: wrapper.querySelector('[data-variation-product]'),
            singleProductVariation: wrapper.querySelector('[data-single-variation]'),

            // input
            attributesName: wrapper.querySelector('[data-attribute-name]'),
            productTypeValue: wrapper.querySelector('[data-productType-value]')
        }

        this.attributeIndex = 1;
        this.variationIndex = 0;

        this.wrapper.addEventListener('click', this.handleWrapperClick.bind(this))
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
     * Handle toggle show single attributes
     * */
    handleToggleAttributeDetails(target) {

        // get parent element
        const singleAttributeEl = target.closest('[data-attribute-number]');

        // get the attribute want to hide when click
        const singleAttributeDetailsEl = singleAttributeEl.querySelector('[data-attribute-details]')

        if(singleAttributeEl && singleAttributeDetailsEl) singleAttributeDetailsEl.classList.toggle('closed')
    }

    /**
     * Delete attribute
     * */
    handleDeleteAttribute(target) {
        const taxonomyAttribute = target.closest('[data-attribute-number]')
        taxonomyAttribute.remove()
    }

    handleAddNewVariation() {
        // create child
        const newVariation = document.createElement('div');
        newVariation.innerHTML = `
                            <div data-single-variation>
                                <div>
                                    <div data-variation-name>New Variation</div>
                                    <button type="button" data-delete-variation>Remove</button>
                                </div>

                                <!-- attributes drop down-->
                                <div>
                                    <select data-easy-select name="visibility" id="visibility">
                                        <option  value="public">Public
                                        </option>
                                        <option value="private">Private
                                        </option>
                                    </select>
                                    <select data-easy-select name="visibility" id="visibility">
                                        <option value="public">Public
                                        </option>
                                        <option value="private">Private
                                        </option>
                                    </select>
                                </div>

                                <!-- variation detail -->
                                <div data-variation-detail class="closed">
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
        newVariation.querySelectorAll('input, textarea').forEach(
            input => {
                input.name = input.name.replace(/\[\d+]/, '[' + this.variationIndex + ']');

            }
        )
        this.elements.variationProductDOM.appendChild(newVariation)

        // increase index
        this.variationIndex++
    }

    /**
     * Handle toggle show single variation
     * */
    handleToggleVariationDetails(target) {
        console.log(target)
        const singleVariationEl = target.closest('[data-single-variation]');

        const singleVariationDetailEl = singleVariationEl.querySelector('[data-variation-detail]')

        if(singleVariationDetailEl) singleVariationDetailEl.classList.toggle('closed')
    }

    /**
     *
     * */
    handleDeleteVariation(target) {
        const variationEl = target.closest('[data-variation-number]')
        if(variationEl) variationEl.remove()
    }

    /**
     * Switching between simple product input and variable product input
     * */
    switchProductTypeOptions() {

        // If the selected value of the productType is a variable, then display the option to show attributes.
        const isProductTypeVariable = this.elements.productTypeValue.options[this.elements.productTypeValue.selectedIndex].value === 'variable';

        this.elements.variableProduct.style.display = isProductTypeVariable ? 'block' : 'none';
        this.elements.simpleProduct.style.display = isProductTypeVariable ? 'none' : 'block';
        this.elements.variationProductDOM.style.display = isProductTypeVariable ? 'block' : 'none';
    }

    /**
     * Handle click product detail
     * */
    handleWrapperClick(e) {
        let functionHandling = () => {
        }
        let target = null;

        const addNewAttributeBtnEl = e.target.closest('button[data-add-new-attribute]');
        const deleteAttributeBtnEl = e.target.closest('button[data-delete-attribute]');
        const attributeNameEl = e.target.closest('[data-attribute-name]');

        const addNewVariationBtnEl = e.target.closest('button[data-add-new-variation]');
        const showVariationDetailEl = e.target.closest('[data-variation-name]');
        const deleteVariationBtnEl = e.target.closest('button[data-delete-variation]');


        if (addNewAttributeBtnEl) {
            functionHandling = this.handleAddNewAttribute.bind(this);

        } else if (deleteAttributeBtnEl) {
            functionHandling = this.handleDeleteAttribute.bind(this);
            target = deleteAttributeBtnEl

        } else if(attributeNameEl) {
            functionHandling = this.handleToggleAttributeDetails.bind(this);
            target = attributeNameEl

        } else if(addNewVariationBtnEl) {
            functionHandling = this.handleAddNewVariation.bind(this);

        } else if(showVariationDetailEl) {
            functionHandling = this.handleToggleVariationDetails.bind(this);
            target = showVariationDetailEl

        } else if(deleteVariationBtnEl) {
            functionHandling = this.handleDeleteVariation.bind(this);
            target = deleteVariationBtnEl;

        } else {
            functionHandling = this.switchProductTypeOptions.bind(this);
        }

        functionHandling(target);
    }
}