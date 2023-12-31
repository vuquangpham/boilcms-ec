import Media from '../media/index';
import Image from '../image';

export default class MediaPopup{
    constructor(wrapper){
        this.wrapper = wrapper;

        // dom elements
        this.elements = {
            mediaList: null
        };

        // flag
        this.isSingleImage = false;

        // fetch URL
        const urlObject = new URL(location.href);
        const baseUrl = urlObject.origin;
        const adminPath = urlObject.pathname.split('/')[1];
        this.FETCH_URL = baseUrl + '/' + adminPath + '/media';
    }

    loadAllMedias(target, wrapper){

        // selected media
        const mediaValueOnParam = target.querySelector('[data-param-value]').getAttribute('data-param-value');
        const selectedMedias = mediaValueOnParam ? JSON.parse(mediaValueOnParam) : [];

        // check type of image element (single or multiple)
        const typeOfImage = target.getAttribute('data-options');
        this.isSingleImage = typeOfImage === 'single-image';

        Media.loadAllMedias({
            previousImagesId: selectedMedias,
            wrapper: wrapper.querySelector('[data-media-list]'),
            type: this.isSingleImage ? "radio" : "checkbox",
            fetchURL: this.FETCH_URL,

            onAfterLoaded: (result) => {
                if(result.notHaveCheckedImage){
                    const errorDiv = document.createElement('div');
                    errorDiv.classList.add('description', 'error');
                    errorDiv.innerHTML = "The chosen image has been deleted. Please upload or select the other one!";
                    result.wrapper.insertAdjacentElement('beforeend', errorDiv);
                }
            }
        });

    }

    /**
     * Submitting the form for adding the new image
     * */
    handleSubmitForm(e){
        e.preventDefault();
        const target = e.target;

        Media.handleUploadNewImage({
            nameInput: this.elements.popupForm.querySelector('[data-media-name]'),
            uploadInput: this.elements.popupForm.querySelector('[data-add-media]'),
            fetchURL: this.FETCH_URL,
            onAfterUpload: (result) => {
                const image = new Image(result, this.isSingleImage);

                // re-assign dom element and clear the previous list
                this.elements.mediaList = target.closest('[data-pb-media-popup]').querySelector('[data-media-list]');
                this.elements.mediaList.appendChild(image.domElement);
            }
        });
    }


    handleAfterSelectedMedias(target){
        const mediaFormWrapper = target.closest('[data-pb-media-popup]');
        const id = mediaFormWrapper.getAttribute('data-popup-content');
        const wrapper = document.querySelector(`[data-type="image"][data-id="${id}"]`);

        Media.handleSavedMedia({
            wrapper: mediaFormWrapper,
            onAfterSaved: (result) => {
                // medias url
                const selectedMediasUrl = result.mediasObject.map(o => o.url);

                // load media to the components
                Media.loadPreviewMedias(wrapper, selectedMediasUrl);

                // medias id
                const selectedMediasId = result.mediasObject.map(o => o.id);

                // save to the attribute
                wrapper
                    .querySelector('[data-param-value]')
                    .setAttribute('data-param-value', JSON.stringify(selectedMediasId));
            }
        });
    }

    isMediaPopup(e){
        let target = null,
            functionForHandling = () => {
            };

        const loadMediaButton = e.target.closest('[data-load-media]');
        const mediaForm = e.target.closest('[data-media-form]');
        const saveMediaButton = e.target.closest('[data-save-media]');

        if(loadMediaButton){
            functionForHandling = this.loadAllMedias.bind(this);
            target = loadMediaButton;
        }

        // add new media
        else if(mediaForm && !this.elements.popupForm){
            this.elements.popupForm = mediaForm;
            mediaForm.addEventListener('submit', this.handleSubmitForm.bind(this));
        }

        // save media
        else if(saveMediaButton){
            functionForHandling = this.handleAfterSelectedMedias.bind(this);
            target = saveMediaButton;
        }else{
            return null;
        }

        // return handler
        return {functionForHandling, target};
    }
}