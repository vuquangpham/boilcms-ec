import Product from "./Product";
import Attributes from "./Attributes";

export default class VariableProduct extends Product{
    constructor(parentWrapper, wrapper){
        super(parentWrapper, wrapper);

        // elements
        this.elements = {
            general: this.wrapper.querySelector('[data-product-general]'),
            attributes: this.wrapper.querySelector('[data-product-attributes]'),
            variations: this.wrapper.querySelector('[data-product-variations]'),
        };

        // json
        this.object = {};
        this.jsonElement = this.wrapper.querySelector('[data-variable-product-json]');

        // init
        this.initTabAndAccordion();

        // event listeners
        this.wrapper.addEventListener('click', this.handleWrapperClick.bind(this));

        window.abc = this;
    }

    initTabAndAccordion(){
        // tabs
        Accordion.create({
            target: this.wrapper.querySelector('[data-tab]'),
            type: 'fade'
        });
    }

    generateDOMToObject(){
        const object = {
            inventory: 0,

            price: 0,
            salePrice: 0,

            attributes: [],
            variations: []
        };

        // general
        object.inventory = parseInt(this.elements.general.querySelector('[data-product-inventory]').value) || 0;
        object.price = parseInt(this.elements.general.querySelector('[data-product-price]').value) || 0;
        object.salePrice = parseInt(this.elements.general.querySelector('[data-product-sale-price]').value) || 0;

        // attributes
        this.elements.attributes.querySelectorAll('[data-product-attribute-item]').forEach(e => {
            const value = JSON.parse(e.getAttribute('data-product-attribute-item'));
            object.attributes.push(value);
        });

        console.log(object);
        return object;
    }

    handleWrapperClick(e){
        const target = e.target;

        // add new attribute
        if(target.closest('[data-product-attribute-add-btn]')){
            const wrapper = target.closest('[data-product-attribute-add]');
            const wrapperToAppend = this.elements.attributes;

            // create the new attribute
            Attributes.createNewAttribute(wrapper, wrapperToAppend);

            // save
            this.save();
        }

        // save attribute
        else if(target.closest('[data-product-attribute-save-btn]')){
            const wrapper = target.closest('[data-product-attribute-item]');

            // validate
            const isValidated = Attributes.validateAttribute(wrapper);
            if(!isValidated) return;

            // call the save method
            this.save();
        }

        // add variation
        else if(target.closest('[data-product-variation-add-btn]')){
            console.log('add variation');
        }
    }
}