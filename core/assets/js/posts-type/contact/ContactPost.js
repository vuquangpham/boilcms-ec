import fetch from "../../../../../assets/js/fetch";

export default class ContactPost{
    constructor(wrapper) {
        this.wrapper = wrapper

        this.elements = {
            // form
            popupForm: wrapper.querySelector('[data-order-form]'),

            // input
            nameInput: wrapper.querySelector('[data-name]'),
            emailInput: wrapper.querySelector('[data-email]'),
            contentInput: wrapper.querySelector('[data-content]')
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
            }

        })

    }

    replaceContactForm(data){
        this.elements.nameInput.value = data.name;
        this.elements.emailInput.value = data.email;
        this.elements.contentInput.textContent = data.content;
        console.log(this.elements.nameInput)
        console.log(data.name, data.email, data.content)
    }

    /**
     * Show single user item
     * */
    showSingleContact(target){
        // open popup
        this.editContactPopup.open()

        const formEl = target.closest('[data-contact-item]');
        const id = formEl.getAttribute('data-id');
        console.log('id: ', id)

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