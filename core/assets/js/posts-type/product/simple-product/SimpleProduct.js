import Product from "../Product";
import MediaPopup from "../media/MediaPopup";

export default class SimpleProduct extends Product{
    constructor(parentWrapper, wrapper){
        super(parentWrapper, wrapper);

        // elements
        this.elements = {
            inventory: this.wrapper.querySelector('[data-product-inventory]'),
            price: this.wrapper.querySelector('[data-product-price]'),
            salePrice: this.wrapper.querySelector('[data-product-sale-price]'),
            images: this.wrapper.querySelector('[data-variation-images]')
        };

        // json
        this.object = {};
        this.jsonElement = this.wrapper.querySelector('[data-simple-product-json]');

        // init
        this.init();
    }

    generateDOMToObject(){
        const object = {
            inventory: 0,
            price: 0,
            salePrice: 0,
            imagesId: []
        };

        // inventory
        object.inventory = parseFloat(this.elements.inventory.valueAsNumber);

        // price
        object.price = parseFloat(this.elements.price.valueAsNumber);

        // sale price
        object.salePrice = parseFloat(this.elements.salePrice.valueAsNumber);

        // images id
        object.imagesId = JSON.parse(this.elements.images.getAttribute('data-variation-images'));

        return object;
    }

    validate(){
        // inventory
        const inventoryEl = this.elements.inventory.closest('.field');
        if(!this.elements.inventory.valueAsNumber){
            inventoryEl.classList.add('invalid');
            return false;
        }else{
            inventoryEl.classList.remove('invalid');
        }

        // price
        const priceEl = this.elements.price.closest('.field');
        if(!this.elements.price.valueAsNumber){
            priceEl.classList.add('invalid');
            return false;
        }else{
            priceEl.classList.remove('invalid');
        }

        // validate image
        const imagesId = JSON.parse(this.elements.images.getAttribute('data-variation-images'));

        // invalid
        if(imagesId.length === 0){
            this.elements.images.classList.add('invalid');
            return false;
        }else{
            this.elements.images.classList.remove('invalid');
        }

        return true;
    }

    save(){
        // validate here
        if(!this.validate()) return;

        // re-assign object
        this.object = this.generateDOMToObject();

        // save to the dom
        this.jsonElement.innerHTML = JSON.stringify(this.object);
    }

    init(){

        // register event listener
        Object.values(this.elements).forEach(el => {
            if(el.nodeName !== 'INPUT') return;
            el.addEventListener('change', this.save.bind(this));
        });

        // init popup
        this.popup = Popup.create({
            target: this.wrapper.querySelector(`[data-popup="variation-images"]`),

            // register handle submit form for popup
            onAfterInit: (self) => {
                const popupContent = self.popupContent;
                const form = popupContent.querySelector('form[data-media-form]');

                // register event listener
                self.listeners.add(form, 'submit', MediaPopup.handleSubmitForm.bind(MediaPopup));
            },

            // load media before open popup
            onBeforeOpen: (self) => {
                MediaPopup.loadAllMedias(self.popupContent);
            },

            // popup content click
            onPopupContentClick: (self) => {
                const event = self.event;

                const saveMediaButton = event.target.closest('[data-save-media]');
                if(!saveMediaButton) return;

                MediaPopup.handleAfterSelectedMedias(saveMediaButton);

                // call the save function
                this.save();
            }
        });

    }
}