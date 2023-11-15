import fetch from "../../../../../assets/js/fetch";

export default class ProductPost {
    constructor(wrapper) {
        this.wrapper = wrapper

        this.elements = {

            // DOM
            variableProduct: wrapper.querySelector('[data-variable-product]'),
            simpleProduct: wrapper.querySelector('[data-simple-product]'),
            taxonomyProductAttributes: wrapper.querySelector('[data-taxonomy]'),

            // input
            attributesName: wrapper.querySelector('[data-attribute-name]'),
            productTypeValue: wrapper.querySelector('[data-productType-value]')
        }

        this.attributeIndex = 1;

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
     * Delete attribute
     * */
    handleDeleteAttribute(target) {
        const taxonomyAttribute = target.closest('[data-attribute-number]')
        taxonomyAttribute.remove()
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
     * Switching between simple product input and variable product input
     * */
    switchProductTypeOptions() {

        // If the selected value of the productType is a variable, then display the option to show attributes.
        const isProductTypeVariable = this.elements.productTypeValue.options[this.elements.productTypeValue.selectedIndex].value === 'variable';

        this.elements.variableProduct.style.display = isProductTypeVariable ? 'block' : 'none'
        this.elements.simpleProduct.style.display = isProductTypeVariable ? 'none' : 'block'
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

        if (addNewAttributeBtnEl) {
            functionHandling = this.handleAddNewAttribute.bind(this);

        } else if (deleteAttributeBtnEl) {
            functionHandling = this.handleDeleteAttribute.bind(this);
            target = deleteAttributeBtnEl

        } else if(attributeNameEl){
            functionHandling = this.handleToggleAttributeDetails.bind(this);
            target = attributeNameEl

        } else {
            functionHandling = this.switchProductTypeOptions.bind(this);
        }

        functionHandling(target);
    }
}