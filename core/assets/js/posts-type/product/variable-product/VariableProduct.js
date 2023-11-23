import Product from "../Product";
import Attributes from "./Attributes";
import Variations from "./Variations";

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
        this.init();
    }

    init(){

        // init tab
        this.initTabAndAccordion();

        // event listeners
        this.wrapper.addEventListener('click', this.handleWrapperClick.bind(this));

        // generate object
        this.object = this.generateObjectToDOM();
    }

    initTabAndAccordion(){
        // tabs
        this.tab = Accordion.create({
            id: 'variable-product-tab',
            target: this.wrapper.querySelector('[data-tab]'),
            type: 'fade',
            onAfterClosed: (self) => {
                // remove invalid class (when validate the value)
                self.target.querySelectorAll('.field.invalid').forEach(e => {
                    e.classList.remove('invalid');
                });
            }
        });
    }

    resizeTab(){
        setTimeout(() => {
            this.tab.resize();
        }, 300);
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

        // variations
        this.elements.variations.querySelectorAll('[data-product-variation-item]').forEach(wrapper => {
            const variation = {
                inventory: 0,
                price: 0,
                salePrice: 0,

                imagesId: [],

                attributes: [],
                selectedAttributes: []
            };

            // images id
            const variationImagesIdEl = wrapper.querySelector('[data-variation-images]');
            variation.imagesId = JSON.parse(variationImagesIdEl.getAttribute('data-variation-images'));

            // attributes
            const attributesEl = wrapper.querySelector('[data-variation-attributes]');
            variation.attributes = JSON.parse(attributesEl.getAttribute('data-variation-attributes'));

            // selected attributes
            const selectedAttributesEl = wrapper.querySelectorAll('[data-variation-attribute]');
            selectedAttributesEl.forEach(e => {
                const name = e.getAttribute('data-variation-attribute');
                const value = e.querySelector('select').value;

                // append to the variation
                variation.selectedAttributes.push({
                    name, value
                });
            });

            // inventory
            variation.inventory = parseFloat(wrapper.querySelector('[data-variation-inventory]').valueAsNumber);

            // price
            variation.price = parseFloat(wrapper.querySelector('[data-variation-price]').valueAsNumber);

            // salePrice
            variation.salePrice = parseFloat(wrapper.querySelector('[data-variation-sale-price]').valueAsNumber);

            // save to object
            object.variations.push(variation);
        });

        return object;
    }

    generateObjectToDOM(){
        const jsonString = this.jsonElement.innerHTML;
        if(!jsonString) return;

        const object = JSON.parse(jsonString);

        // load attributes
        object.attributes.forEach(a => {
            const el = Attributes.createDOM(a);
            this.elements.attributes.appendChild(el);
        });

        // load variation
        object.variations.forEach(v => {
            const el = Variations.createDOM(v);
            this.elements.variations.appendChild(el);
        });

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

            // resize the tab
            this.resizeTab();
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

        // remove attribute
        else if(target.closest('[data-attribute-item-remove-btn]')){
            const wrapper = target.closest('[data-product-attribute-item]');

            // remove the dom
            wrapper.remove();

            // call the save method
            this.save();
        }

        // add variation
        else if(target.closest('[data-product-variation-add-btn]')){
            const wrapper = target.closest('[data-product-variation-add]');
            const wrapperToAppend = this.elements.variations;
            const attributes = this.object.attributes;

            // create new variation
            Variations.createNewVariation(attributes, wrapper, wrapperToAppend);

            // resize the tab
            this.resizeTab();
        }

        // save variation
        else if(target.closest('[data-variation-save-btn]')){
            const wrapper = target.closest('[data-product-variation-item]');

            // validate
            const isValidated = Variations.validateVariation([], wrapper, false);
            if(!isValidated) return;

            // save
            this.save();
        }

        // remove variation
        else if(target.closest('[data-product-variation-item-remove-btn]')){
            const wrapper = target.closest('[data-product-variation-item]');

            // remove the dom
            wrapper.remove();

            // call the save method
            this.save();
        }
    }
}