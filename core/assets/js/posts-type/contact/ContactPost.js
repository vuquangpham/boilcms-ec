import fetch from "../../../../../assets/js/fetch";

export default class ContactPost{
    constructor(wrapper) {
        this.wrapper = wrapper

        this.elements = {
            // form
            popupForm: wrapper.querySelector('[data-contact-form]'),

            // input
            nameInput: wrapper.querySelector('[data-name]'),
            emailInput: wrapper.querySelector('[data-email]'),
            contentInput: wrapper.querySelector('[data-content]'),

            replyMessage: wrapper.querySelector('[data-reply-message]')
        };

        // vars
        const urlObject = new URL(location.href);
        this.FETCH_URL = urlObject.origin + urlObject.pathname;

        // handle click action
        this.wrapper.addEventListener('click', this.handleWrapperClick.bind(this));

        // create popup for each [data-order-edit] element
        this.editContactPopup = Popup.create({
            target: document.createElement('div'),
            popupContent: this.wrapper.querySelector('[data-popup-content="data-contact-edit"]'),

            onPopupContentClick: (self) => {
                const eventTarget = self.event.target;

                let functionHandling = () => {
                };
                let target = null;

                const saveContactBtnEl = eventTarget.closest('button[data-contact-update-btn]');

                if(saveContactBtnEl) {
                    functionHandling = this.handleSaveContact.bind(this);
                    target = saveContactBtnEl;

                    // call the function
                    functionHandling(target);
                }
            }

        })

    }

    replaceContactForm(data){
        this.elements.popupForm.dataset.id = data._id;

        this.elements.nameInput.value = data.name;
        this.elements.emailInput.value = data.email;
        this.elements.contentInput.textContent = data.content;
        this.elements.replyMessage.textContent = data.reply;
    }

    /**
     * Show single user item
     * */
    showSingleContact(target){
        // open popup
        this.editContactPopup.open()

        const formEl = target.closest('[data-contact-item]');
        const id = formEl.getAttribute('data-id');

        // get detail media
        // method: get, action on page edit to get detail page
        fetch(this.FETCH_URL, {
            method: 'get',
            action: 'edit',
            getJSON: true,
            id: id
        })
            .then(res => res.json())
            .then(result => {
                console.log('result in js: ', result.data)
                this.replaceContactForm(result.data)
            })

            // catch the error
            .catch(err => console.error(err));
    };

    /**
     * Handle save order
     * */
    handleSaveContact(target){
        const formEl = target.closest('[data-contact-form]');
        const id = formEl.getAttribute('data-id');

        const formData = new FormData();

        formData.append('name', this.elements.nameInput.value);
        formData.append('email', this.elements.emailInput.value);
        formData.append('content', this.elements.contentInput.value);
        formData.append('reply', this.elements.replyMessage.value)

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

                const orderItemEl = this.wrapper.querySelector(`[data-contact-item][data-id="${id}"]`);
                if(!orderItemEl){
                    console.error('Can not find an contact with id', id);
                    return;
                }

                // close the popup
                this.editContactPopup.close();
            })
            .catch(err => console.error(err));
    }

    handleWrapperClick(e){
        let functionHandling = () => {
        };
        let target = null;

        const singleContactItemEL = e.target.closest('[data-contact-edit]');

        // show single media item
        if(singleContactItemEL){
            functionHandling = this.showSingleContact.bind(this);
            target = singleContactItemEL;
        }

        // call the function
        functionHandling(target);
    }

}