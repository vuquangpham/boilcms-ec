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

            attributes: [],
            variations: []
        };

        // general
        object.inventory = parseInt(this.elements.general.querySelector('[data-product-inventory]').value) || 0;
        object.price = parseInt(this.elements.general.querySelector('[data-product-price]').value) || 0;

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
                description: '',

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
            selectedAttributesEl.forEach((e) => {
                const name = e.getAttribute('data-variation-attribute');

                const select = e.querySelector('select');
                const value = select.value;
                const index = select.selectedIndex;

                // append to the variation
                variation.selectedAttributes.push({
                    name, value, index
                });
            });

            // inventory
            variation.inventory = parseFloat(wrapper.querySelector('[data-variation-inventory]').valueAsNumber);

            // price
            variation.price = parseFloat(wrapper.querySelector('[data-variation-price]').valueAsNumber);

            // salePrice
            variation.salePrice = parseFloat(wrapper.querySelector('[data-variation-sale-price]').valueAsNumber);

            // description
            variation.description = wrapper.querySelector('[data-variation-description]').value;

            // save to object
            object.variations.push(variation);
        });

        return object;
    }

    generateObjectToDOM(){
        const jsonString = this.jsonElement.innerHTML;
        if(!jsonString) return {
            attributes: [],
            variations: []
        };

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

    save(){
        // re-assign object
        this.object = this.generateDOMToObject();

        // save to the dom
        this.jsonElement.innerHTML = JSON.stringify(this.object);

        // get total inventory
        const totalInventory = this.object.variations.reduce((acc, cur) => {
            return acc + cur.inventory;
        }, 0);
        this.elements.general.querySelector('[data-product-inventory]').value = totalInventory;

        return true;
    }

    handleWrapperClick(e){
        const target = e.target;

        // add new attribute
        if(target.closest('[data-product-attribute-add-btn]')){
            const wrapper = target.closest('[data-product-attribute-add]');
            const wrapperToAppend = this.elements.attributes;

            // create the new attribute
            const attribute = Attributes.createNewAttribute(wrapper, wrapperToAppend);

            // clear the variation
            this.elements.variations.innerHTML = '';

            // add new attribute to variations
            this.object.variations.forEach(v => {
                v.attributes.push(attribute);
                v.selectedAttributes.push({
                    name: attribute.name,
                    value: attribute.values[0].name
                });

                const el = Variations.createDOM(v);
                this.elements.variations.appendChild(el);
            });

            // save
            this.save();

            // resize the tab
            this.resizeTab();
        }

        // save attribute
        else if(target.closest('[data-product-attribute-save-btn]')){
            // show
            this.createLoading();

            // vars
            const wrapper = target.closest('[data-product-attribute-item]');

            // validate
            const isValidated = Attributes.validateAttribute(wrapper, true);
            if(!isValidated) return;

            // save to the attribute
            const objectInStr = JSON.stringify(isValidated);
            wrapper.setAttribute('data-product-attribute-item', objectInStr);

            // call the save method
            this.save();

            // clear the variation
            this.elements.variations.innerHTML = '';

            // change the variations
            this.object.variations.forEach(v => {
                v.attributes = this.object.attributes;
                v.selectedAttributes = v.selectedAttributes.map(selected => {
                    const attribute = this.object.attributes.find(a => a.name === selected.name);

                    // get the value
                    let value = attribute.values[selected.index];
                    if(!value) value = attribute.values[0];

                    // change the value
                    selected.value = value.name;

                    // change the name
                    selected.name = attribute.name;

                    return selected;
                });

                // create new dom
                const el = Variations.createDOM(v);
                this.elements.variations.appendChild(el);
            });

            // remove
            this.removeLoading();
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
            // show loading
            this.createLoading();

            // vars
            const wrapper = target.closest('[data-product-variation-item]');

            // validate
            const isValidated = Variations.validateVariation([], wrapper, false);
            if(!isValidated) return;

            // save
            this.save();

            // remove loading
            this.removeLoading();
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

    createLoading(){
        this.loading = document.createElement('div');
        this.loading.classList.add('loading');
        document.body.appendChild(this.loading);
    }

    removeLoading(){
        if(!this.loading) return;

        setTimeout(() => {
            this.loading.remove();
        }, 200);
    }
}