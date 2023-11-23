import fetch from "@global/js/fetch";
import Image from '../image';

class MediaPopup{
    constructor(){
    }


    /**
     * Load all medias
     * @param options {Object}
     * @return {void}
     * */
    loadAllMedias(options){
        const defaultOptions = {
            previousImagesId: [],
            wrapper: null,
            type: 'radio',
            fetchURL: '',

            onAfterLoaded: (result) => {
            }
        };

        // validated options
        const validatedOptions = {...defaultOptions, ...options};

        // clear the previous list
        validatedOptions.wrapper.innerHTML = '';

        fetch(validatedOptions.fetchURL, {
            method: 'get',
            action: 'get',
            getJSON: true
        })
            .then(res => res.json())
            .then(result => {

                // load the images to the list
                const data = result.data;
                data.map(d => new Image(d, validatedOptions.type === "radio"))
                    .forEach(d => validatedOptions.wrapper.appendChild(d.domElement));


                // check the previous selected image
                let notHaveCheckedImage = false;
                validatedOptions.previousImagesId.forEach(id => {
                    const element = validatedOptions.wrapper.querySelector(`input[name="selected-media"][value="${id}"]`);
                    if(element) return element.checked = true;

                    // flag for showing the error with the default image
                    notHaveCheckedImage = true;
                });

                // call the cb
                validatedOptions.onAfterLoaded({...result, ...validatedOptions, notHaveCheckedImage});
            });
    }


    /**
     * Load media by ID
     * @param fetchURL {string}
     * @param id {string}
     * @return {Promise}
     * */
    loadMediaById(fetchURL, id){
        return new Promise((resolve, reject) => {
            fetch(fetchURL, {
                method: 'get',
                action: 'edit',
                id,
                getJSON: true
            })
                .then(res => res.json())
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    }


    /**
     * Load preview medias
     * */
    loadPreviewMedias(wrapper, urls){
        const selectedMediaEl = wrapper.querySelector('[data-selected-medias]') || wrapper;
        selectedMediaEl.innerHTML = urls.map(url => {
            return `
<div data-selected-media-item class="img-wrapper-cover ar-1">
     <img src="${url}" alt="selected-media">       
</div>
            `;
        }).join('');
    }


    /**
     * Handle upload new image
     * */
    handleUploadNewImage(options){
        // default options
        const defaultOptions = {
            nameInput: null,
            uploadInput: null,
            fetchURL: '',

            onAfterUpload: (result) => {
            }
        };

        // validated options
        const validatedOptions = {...defaultOptions, ...options};

        // create form data
        const formData = new FormData();
        formData.append('name', validatedOptions.nameInput.value);
        formData.append('image', validatedOptions.uploadInput.files[0]);

        // call to the server
        fetch(validatedOptions.fetchURL, {
            method: 'post',
            action: 'add',
            getJSON: true,
        }, {
            method: 'post',
            body: formData
        })
            .then(res => res.json())
            .then((result) => validatedOptions.onAfterUpload({...result, ...validatedOptions}))
            .catch(err => console.error(err));
    }


    /**
     * Handle saved media
     * */
    handleSavedMedia(options){
        // default options
        const defaultOptions = {
            wrapper: null,

            onAfterSaved: (result) => {
            }
        };

        // validate options
        const validatedOptions = {...defaultOptions, ...options};

        // elements
        const mediaElements = Array.from(validatedOptions.wrapper.querySelectorAll('input[name="selected-media"]'));

        // get selected media
        const selectedMediaElements = mediaElements.filter(mediaEl => mediaEl.checked);

        // media object
        const mediasObject = selectedMediaElements.map(e => {
            const id = e.value;
            const url = e.closest('button').querySelector('img').src;

            return {
                id,
                url
            };
        });

        // do the cb
        validatedOptions.onAfterSaved({...validatedOptions, mediasObject});
    }
}

export default new MediaPopup();