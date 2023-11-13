import fetch from "../../../../../assets/js/fetch";

export default class ProductPost {
    constructor(wrapper) {
        this.wrapper = wrapper

        this.elements = {
            productAttributes: wrapper.querySelector('[data-product-attributes]'),
            taxonomyProductAttributes: wrapper.querySelector('[data-taxonomy]'),

            // input
            attributesName: wrapper.querySelector('[data-attribute-name]')
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

        this.elements.productAttributes.appendChild(newAttribute)

        // increase index
        this.attributeIndex++
    }

    /**
     * Handle replace attribute name label
     * */
    handleReplaceAttributeName(target) {
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
     * Handle click product detail
     * */
    handleWrapperClick(e) {
        let functionHandling = () => {
        }
        let target = null;

        const addNewAttributeBtnEl = e.target.closest('button[data-add-new-attribute]');
        const deleteAttributeBtnEl = e.target.closest('button[data-delete-attribute]');

        if (addNewAttributeBtnEl) {
            functionHandling = this.handleAddNewAttribute.bind(this);

        } else if (deleteAttributeBtnEl) {
            functionHandling = this.handleDeleteAttribute.bind(this);
            target = deleteAttributeBtnEl
        }

        functionHandling(target);
    }
}