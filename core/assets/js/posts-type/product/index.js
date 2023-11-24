import SimpleProduct from "./simple-product/SimpleProduct";
import VariableProduct from "./variable-product/VariableProduct";
import MediaPopup from "./media/MediaPopup";

class ProductPost{
    constructor(wrapper){
        this.wrapper = wrapper;

        // elements
        this.elements = {
            productCategoryImageInput: this.wrapper.querySelector('[data-product-category-image]')
        };

        // create the product variation
        this.simpleProduct = new SimpleProduct(wrapper, wrapper.querySelector('[data-simple-product]'));
        this.variableProduct = new VariableProduct(wrapper, wrapper.querySelector('[data-variable-product]'));

        this.init();
    }

    init(){
        // init product category
        this.initProductCategoryImage();

        // init easy select
        EasySelect.init(this.wrapper.querySelector('[data-product-types-select]'), {
            onInit: data => {
                const value = data.instance.value;
                this.changeProductTypes(value);
            },
            onChange: (data) => {
                const value = data.instance.value;
                this.changeProductTypes(value);
            }
        });

        // handle submit
        this.wrapper.querySelector('form').addEventListener('submit', this.handleSubmit.bind(this));
    }

    initProductCategoryImage(){
        this.categoryImagePopup = Popup.create({
            target: this.wrapper.querySelector('[data-popup="category-image"]'),

            // register handle submit form for popup
            onAfterInit: (self) => {
                const popupContent = self.popupContent;
                const form = popupContent.querySelector('form[data-media-form]');

                // register event listener
                self.listeners.add(form, 'submit', MediaPopup.handleSubmitForm.bind(MediaPopup));
            },

            // load media before open popup
            onBeforeOpen: (self) => {
                MediaPopup.loadAllMedias(self.popupContent, 'radio');
            },

            // popup content click
            onPopupContentClick: (self) => {
                const event = self.event;

                const saveMediaButton = event.target.closest('[data-save-media]');
                if(!saveMediaButton) return;

                // get the selected medias
                const result = MediaPopup.handleAfterSelectedMedias(saveMediaButton);
                const mediasObject = result.mediasObject;

                // not exists
                if(mediasObject.length === 0) return;

                // re-assign value for the input
                this.elements.productCategoryImageInput.value = mediasObject[0].id;
            }
        });
    }

    changeProductTypes(type){
        if(type === "simple"){
            this.simpleProduct.wrapper.style.display = "block";
            this.variableProduct.wrapper.style.display = "none";
        }
        if(type === "variable"){
            this.simpleProduct.wrapper.style.display = "none";
            this.variableProduct.wrapper.style.display = "block";

            // resize tabs
            this.variableProduct.resizeTab();
        }
    }

    handleSubmit(e){
        const isSimpleSaveValid = this.simpleProduct.save();
        const isVariableSaveValid = this.variableProduct.save();
        const hasSelectCategoryImage = this.elements.productCategoryImageInput.value;

        // validate category image
        const categoryImageWrapper = this.elements.productCategoryImageInput.closest('.field');
        if(!hasSelectCategoryImage){
            categoryImageWrapper.classList.add('invalid');

            // prevent submit
            e.preventDefault();

            return;
        }else{
            categoryImageWrapper.classList.remove('invalid');
        }

        // validate
        if(!isSimpleSaveValid || !isVariableSaveValid){
            e.preventDefault();
        }
    }
}

document.querySelectorAll('[data-product-wrapper]').forEach(wrapper => new ProductPost(wrapper));