import fetch from "@global/js/fetch";

export default class MediaPost{
    constructor(wrapper){
        this.wrapper = wrapper;

        this.elements = {
            // preview media
            mediaItem: wrapper.querySelector('div[data-media-item]'),
            mediaImage: wrapper.querySelector('div[data-media-item] img'),

            // popup
            popupForm: wrapper.querySelector('[data-media-form]'),

            // input field
            mediaNameInput: wrapper.querySelector('[data-media-name]'),
            mediaURL: wrapper.querySelector('[data-media-url]'),

            // replace image input
            replaceMediaInput: wrapper.querySelector('[data-media-replace]')
        };

        // vars
        const urlObject = new URL(location.href);
        this.FETCH_URL = urlObject.origin + urlObject.pathname;

        // handle click action
        this.wrapper.addEventListener('click', this.handleWrapperClick.bind(this));

        // show popup
        this.popup = Popup.create({
            target: document.createElement('div'),
            popupContent: document.querySelector('[data-popup-content="media-page"]')
        });

        // handle replace media
        this.elements.replaceMediaInput.addEventListener('change', this.handleReplaceInputChange.bind(this));
    }

    /**
     * Replace media item in popup
     * */
    replaceMediaItem(data){
        // set the id for the form
        this.elements.popupForm.dataset.id = data._id;

        // change the media
        this.elements.mediaImage.src = data.url.original;
        this.elements.mediaImage.alt = data.name;

        // change the input of the form
        this.elements.mediaNameInput.value = data.name;
        this.elements.mediaURL.href = data.url.original;
        this.elements.mediaURL.textContent = data.url.original;
    };

    /**
     * Show single media item
     * */
    showSingleMediaItem(target){
        // open popup
        this.popup.open();

        const id = target.dataset.id;

        // add loading class (for toggling the old image)
        this.elements.mediaItem.classList.add('loading');

        // get detail media
        // method: get, action on page edit to get detail page
        fetch(this.FETCH_URL, {
            method: 'get',
            action: 'edit',
            getJSON: true,
            id: id
        })
            .then(res => res.json())
            .then(result => this.replaceMediaItem(result.data))

            // catch the error
            .catch(err => console.error(err))

            // remove the loading
            .finally(() => {
                this.elements.mediaImage.onload = () => {
                    this.elements.mediaItem.classList.remove('loading');
                };
            });
    };


    /**
     * Delete media item
     * */
    handleDeleteMedia(target){
        const formEl = target.closest('[data-media-form]');
        const id = formEl.getAttribute('data-id');

        fetch(this.FETCH_URL, {
            action: 'delete',
            method: 'post',
            getJSON: true,
            id: id
        })
            .then(() => {
                // get deleted media item and remove the dom
                const deletedMediaItem = this.wrapper.querySelector(`button[data-media-item][data-id="${id}"]`);
                if(deletedMediaItem) deletedMediaItem.remove();
            })
            .catch(err => console.error(err));
    };

    /**
     * Handle save media
     * */
    handleSaveMedia(target){
        const formEl = target.closest('[data-media-form]');
        const id = formEl.getAttribute('data-id');

        const formData = new FormData();
        formData.append('name', this.elements.mediaNameInput.value);
        formData.append('image', this.elements.replaceMediaInput.files[0]);

        fetch(this.FETCH_URL, {
            method: 'post',
            action: 'edit',
            getJSON: true,
            id: id
        }, {
            method: 'post',
            body: formData
        })
            .then(res => res.json())
            .then((result) => {
                const mediaItemEl = this.wrapper.querySelector(`[data-media-item][data-id="${id}"] img`);
                if(!mediaItemEl){
                    console.error('Can not find an image with id', id);
                    return;
                }

                // update the new media
                mediaItemEl.src = result.url.small;
                mediaItemEl.alt = result.name;
            })
            .catch(err => console.error(err));
    }

    /**
     * Replace input change handler
     * */
    handleReplaceInputChange(){
        // the input doesn't exist
        if(!this.elements.replaceMediaInput.files || !this.elements.replaceMediaInput.files[0]) return;

        // read uploaded file
        const reader = new FileReader();
        reader.onload = (e) => {
            this.elements.mediaImage.setAttribute('src', e.target.result.toString());
        };
        reader.readAsDataURL(this.elements.replaceMediaInput.files[0]);
    };

    handleWrapperClick(e){
        let functionHandling = () => {
        };
        let target = null;

        const singleMediaItemEL = e.target.closest('button[data-media-item]');
        const deleteBtnEl = e.target.closest('[data-media-delete-btn]');
        const saveMediaBtnEl = e.target.closest('[data-media-save-btn]');

        // show single media item
        if(singleMediaItemEL){
            functionHandling = this.showSingleMediaItem.bind(this);
            target = singleMediaItemEL;
        }

        // save media
        else if(saveMediaBtnEl){
            functionHandling = this.handleSaveMedia.bind(this);
            target = saveMediaBtnEl;
        }

        // delete media
        else if(deleteBtnEl){
            functionHandling = this.handleDeleteMedia.bind(this);
            target = deleteBtnEl;
        }

        // call the function
        functionHandling(target);
    }
}