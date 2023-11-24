import Media from '../../../components/media';
import Image from '../../../components/image';

class MediaPopup{
    constructor(){
        // fetch URL
        const urlObject = new URL(location.href);
        const baseUrl = urlObject.origin;
        const adminPath = urlObject.pathname.split('/')[1];
        this.FETCH_URL = baseUrl + '/' + adminPath + '/media';
    }

    loadAllMedias(popupContent, type = "checkbox"){
        const id = popupContent.getAttribute('data-popup-wrapper');
        const selectImageButton = document.querySelector(`[data-popup="${id}"]`);
        const variationImageControlEl = selectImageButton.closest('[data-variation-images]');

        // get selected medias
        const selectedMedias = JSON.parse(variationImageControlEl.getAttribute('data-variation-images'));

        // load medias
        Media.loadAllMedias({
            previousImagesId: selectedMedias,
            wrapper: popupContent.querySelector('[data-media-list]'),
            type: type,
            fetchURL: this.FETCH_URL,

            onAfterLoaded: (result) => {
            }
        });
    }

    /**
     * Submitting the form for adding the new image
     * */
    handleSubmitForm(e){
        e.stopPropagation();
        e.preventDefault();

        // vars
        const target = e.target;
        const mediaList = target.closest('[data-pb-media-popup]').querySelector('[data-media-list]');
        const nameInput = target.querySelector('[data-media-name]');
        const uploadInput = target.querySelector('[data-add-media]');

        Media.handleUploadNewImage({
            nameInput,
            uploadInput,
            fetchURL: this.FETCH_URL,
            onAfterUpload: (result) => {
                const image = new Image(result, this.isSingleImage);

                // re-assign dom element and clear the previous list
                mediaList.appendChild(image.domElement);

                // clear upload input
                target.reset();
            }
        });
    }

    handleAfterSelectedMedias(target){
        const mediaPopupEl = target.closest('[data-popup-content]');
        const id = mediaPopupEl.getAttribute('data-popup-content');

        const imageButtonEl = document.querySelector(`[data-popup="${id}"]`);
        const wrapper = imageButtonEl.closest('[data-variation-images]');
        const previewMediaWrapper = wrapper.closest('[data-variation-images]').querySelector('[data-preview-media]');

        return Media.handleSavedMedia({
            wrapper: mediaPopupEl,
            onAfterSaved: (result) => {
                // medias url
                const selectedMediasUrl = result.mediasObject.map(o => o.url);

                // load media to the components
                Media.loadPreviewMedias(previewMediaWrapper, selectedMediasUrl);

                // medias id
                const selectedMediasId = result.mediasObject.map(o => o.id);

                // save to the attribute
                wrapper.setAttribute('data-variation-images', JSON.stringify(selectedMediasId));
            }
        });
    }
}

export default new MediaPopup();