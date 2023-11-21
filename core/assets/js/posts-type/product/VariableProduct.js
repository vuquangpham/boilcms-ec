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

        // init
        this.initTabAndAccordion();

        // event listeners
        this.wrapper.addEventListener('click', this.handleWrapperClick.bind(this));
    }

    initTabAndAccordion(){
        // tabs
        Accordion.create({
            target: this.wrapper.querySelector('[data-tab]'),
            type: 'fade'
        });
    }

    generateDOMToObject(){

        // general
    }

    handleWrapperClick(e){
        const target = e.target;

        // add new attribute
        if(target.closest('[data-product-attribute-add-btn]')){
            const wrapper = target.closest('[data-product-attribute-add]');
            const wrapperToAppend = this.elements.attributes;

            Attributes.createNewAttribute(wrapper, wrapperToAppend);
            return;
        }

        // save attribute
    }
}