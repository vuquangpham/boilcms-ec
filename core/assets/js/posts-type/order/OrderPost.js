import fetch from "../../../../../assets/js/fetch";

export default class OrderPost{
    constructor(wrapper) {
        this.wrapper = wrapper

        this.elements = {
            // form
            popupForm: wrapper.querySelector('[data-order-form]'),

            // input
            orderID: wrapper.querySelector('[data-orderID]'),
            usernameInput: wrapper.querySelector('[data-username]'),
            addressInput: wrapper.querySelector('[data-address]'),
            emailInput: wrapper.querySelector('[data-email]'),
            phoneInput: wrapper.querySelector('[data-phone]'),
            shippingFeeInput: wrapper.querySelector('[data-shipping-fee]'),

            // select input
            paymentSelectInput: wrapper.querySelector('[data-select-payment-value]'),
            paidSelectInput: wrapper.querySelector('[data-select-paid-value]'),
        };

        // vars
        const urlObject = new URL(location.href);
        this.FETCH_URL = urlObject.origin + urlObject.pathname;

        // handle click action
        this.wrapper.addEventListener('click', this.handleWrapperClick.bind(this));

        // create popup for each [data-order-edit] element
        this.editOrderPopup = Popup.create({
            target: document.createElement('div'),
            popupContent: this.wrapper.querySelector('[data-popup-content="data-order-edit"]')

        })

    }

    /**
     * Replace user item in popup
     * */
    replaceOrder(data){
        // set the id for the form
        this.elements.popupForm.dataset.id = data._id;

        // change the input of the form
        this.elements.orderID.textContent = data.orderID;
        this.elements.usernameInput.value = data.fullName;
        this.elements.addressInput.value = data.address;
        this.elements.emailInput.value = data.user.email;
        this.elements.phoneInput.value = data.phoneNumber;
        this.elements.shippingFeeInput.value = data.shippingFee
        this.elements.paymentSelectInput.value = data.paymentMethod;
        this.elements.paidSelectInput.value = data.isPaid;

        // this.elements.optionRoleInput.forEach(o => {
        //     if(o.getAttribute('value') === data.role){
        //         o.setAttribute('selected', '');
        //     }else o.removeAttribute('selected');
        // });
        //
        // this.elements.optionStateInput.forEach(o => {
        //     if(o.getAttribute('value') === data.state){
        //         o.setAttribute('selected', '');
        //     }else o.removeAttribute('selected');
        // });

    };

    /**
     * Show single user item
     * */
    showSingleOrder(target){
        // open popup
        this.editOrderPopup.open()

        const formEl = target.closest('[data-order-item]');
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
                console.log(result.data)
                this.replaceOrder(result.data)
            })

            // catch the error
            .catch(err => console.error(err));
    };

    handleWrapperClick(e){
        let functionHandling = () => {
        };
        let target = null;

        const singleOrderItemEL = e.target.closest('[data-order-edit]');

        // show single media item
        if(singleOrderItemEL){
            functionHandling = this.showSingleOrder.bind(this);
            target = singleOrderItemEL;
        }

        // call the function
        functionHandling(target);
    }

}