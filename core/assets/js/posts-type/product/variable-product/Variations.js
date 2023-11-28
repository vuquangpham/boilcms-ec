import MediaPopup from "../media/MediaPopup";
import Media from '../../../components/media';

class Variations{
    constructor(){
        // fetch URL
        const urlObject = new URL(location.href);
        const baseUrl = urlObject.origin;
        const adminPath = urlObject.pathname.split('/')[1];
        this.FETCH_URL = baseUrl + '/' + adminPath + '/media';
    }

    validateVariation(attributes, wrapper, isInit = true){
        // init validate
        if(isInit){

            if(attributes.length === 0){
                wrapper.querySelector('.field').classList.add('invalid');
                return false;
            }
            wrapper.querySelector('.field').classList.remove('invalid');
            return true;
        }

        // validate for save action
        const image = wrapper.querySelector('[data-variation-images]');
        const imagesData = JSON.parse(image.getAttribute('data-variation-images'));

        // validate image
        if(imagesData.length === 0){
            image.closest('.field').classList.add('invalid');
            return false;
        }else{
            image.closest('.field').classList.remove('invalid');
        }

        // validate the inventory
        const inventory = wrapper.querySelector('[data-variation-inventory]');
        if(!parseFloat(inventory.value.trim())){
            inventory.closest('.field').classList.add('invalid');
            return false;
        }else{
            inventory.closest('.field').classList.remove('invalid');
        }

        // validate price
        const price = wrapper.querySelector('[data-variation-price]');
        if(!parseFloat(price.value.trim())){
            price.closest('.field').classList.add('invalid');
            return false;
        }else{
            price.closest('.field').classList.remove('invalid');
        }

        return true;
    }

    createDOM(data){
        const selectedAttributes = data.selectedAttributes || [];
        const attributes = data.attributes || [];

        const images = data.imagesId || [];
        const inventory = data.inventory;
        const description = data.description;
        const price = data.price;
        const salePrice = data.salePrice;

        // attributes html
        let attributesHTML = '';
        attributes.forEach((a, i) => {

            // generate html for options
            const optionsHTML = a.values.map(v => {
                // get selected value
                const isSelected = selectedAttributes.find(s => s.name === a.name && s.value === v.name);
                return `<option value="${v.name}" ${isSelected ? 'selected' : ''}>${v.prettyName}</option>`;
            }).join('');

            attributesHTML += `
<div class="field half vertical-layout" data-variation-attribute="${a.name}">
    <label for="attribute[${i}]" class="tt-capitalize">${a.name}</label>
    <select id="attribute[${i}]">${optionsHTML}</select>
</div>
            `;
        });

        const div = document.createElement('div');
        const uid = Theme.uid();
        div.innerHTML = `
<div data-product-variation-item data-accordion>

    <div data-trigger-wrapper class="d-flex jc-space-between">

        <div>
            <span class="txt_14px fw-bold">Variation</span>
        </div>

        <div class="d-flex" data-variable-product-buttons>
            <button class="btn_primary" data-variation-trigger="item" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>
            <button class="btn_primary error" type="button" data-product-variation-item-remove-btn>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </button>
        </div>
    </div>

    <div data-variation-receiver="item">
    
        <div data-variation-attributes='${JSON.stringify(attributes)}' class="form-fields" style="margin-bottom:1rem;">${attributesHTML}</div>

        <div class="form-fields">

            <div class="field vertical-layout" data-variation-images='${JSON.stringify(images)}'>
                <label for="images">Images</label>
                <div data-preview-media class="fl-grid"></div>
                <input type="button" class="btn_primary" value="Select Images" data-variation-image-add data-popup="${uid}">
                <div class="description error">Please input the images</div>
                
                <div data-pb-media-popup data-popup-content="${uid}">
                   <div class="media-popup fl-grid">

                        <!-- media list -->
                        <div class="media-popup__col media-popup__col--left">
                            <div data-custom-title>
                                <span>Media List</span>
                            </div>
    
                            <div data-media-list class="fl-grid"></div>
    
                            <button type="button" class="btn_primary" data-save-media data-popup-toggle>Save
                            </button>
                        </div>

                        <!-- upload new media -->
                        <div class="media-popup__col media-popup__col--right">
                            <form data-media-form action="?post_type=media&method=post&action=add"
                                  enctype="multipart/form-data">
    
                                <div data-custom-title>
                                    <span>Upload Media</span>
                                </div>
    
                                <div class="form-fields">
                                    <div class="field vertical-layout">
                                        <label for="name">Name:</label>
                                        <input id="name" type="text" name="name" placeholder="Name" data-media-name>
                                        <div class="description">Optional, we can get the name of the media.</div>
                                    </div>
    
                                    <div class="field vertical-layout">
                                        <label for="image">Upload Image:</label>
                                        <input type="file" name="image" accept="image/*" id="image" required data-add-media>
                                    </div>
    
                                    <div class="footer">
                                        <button class="btn_transparent" type="submit" data-add-media-button>Add New</button>
                                    </div>
                                </div>
    
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div class="field vertical-layout">
                <label for="sku">SKU</label>
                <input type="number" placeholder="SKU" name="skud" data-variation-inventory value="${inventory ?? ''}">
                <div class="description error">Please input the inventory</div>
            </div>

            <div class="field half vertical-layout">
                <label for="">Price</label>
                <input type="number" placeholder="Price" name="price" data-variation-price value="${price ?? ''}">
                <div class="description error">Please input the price</div>
            </div>

            <div class="field half vertical-layout">
                <label for="">Sale Price</label>
                <input type="number" placeholder="Sale Price"
                       name="sale-price" data-variation-sale-price value="${salePrice ?? ''}">
                <div class="description" style="display:block;">You can leave it empty!</div>
            </div>
            
            <div class="field vertical-layout">
                <label for="">Description</label>
                <textarea data-variation-description class="w100">${description ?? ''}</textarea>
            </div>
            
            <div class="field">
                <button class="btn_primary" type="button" data-variation-save-btn>Save</button>
            </div>

        </div>
    </div>
</div>
        `;

        // load preview media if exists
        const promises = [];
        const previewMediaEl = div.querySelector('[data-preview-media]');
        images.forEach(imageId => {
            promises.push(Media.loadMediaById(this.FETCH_URL, imageId));
        });
        Promise.all(promises)
            .then(imagesObj => {
                const mediaUrls = imagesObj.map(i => i.data.url.small);
                Media.loadPreviewMedias(previewMediaEl, mediaUrls);
            });

        // create the accordion
        Accordion.create({
            target: div.querySelector('[data-accordion]'),
            triggerAttr: 'data-variation-trigger',
            receiverAttr: 'data-variation-receiver',
            triggerSelector: '[data-variation-trigger]',
            receiverSelector: '[data-variation-receiver]',

            // onBefore
            onBeforeClosed: (_) => {
                const instance = Accordion.get('variable-product-tab');

                setTimeout(() => {
                    instance.resize();
                }, 300);
            },

            // onBefore
            onBeforeOpened: (_) => {
                const instance = Accordion.get('variable-product-tab');

                setTimeout(() => {
                    instance.resize();
                }, 300);
            }
        });

        // create the popup
        Popup.create({
            target: div.querySelector('[data-popup]'),
            popupContent: div.querySelector('[data-popup-content]'),

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
            }
        });

        return div.firstElementChild;
    }

    createNewVariation(attributes, wrapper, wrapperToAppend){
        const isValidated = this.validateVariation(attributes, wrapper);
        if(!isValidated) return;

        // get the value
        const variationElement = this.createDOM({
            attributes
        });

        // append to the DOM
        wrapperToAppend.appendChild(variationElement);
    }
}

export default new Variations();