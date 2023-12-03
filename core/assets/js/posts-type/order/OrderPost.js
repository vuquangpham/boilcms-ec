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
            totalInput: wrapper.querySelector('[data-total]'),

            // select input
            paymentSelectInput: wrapper.querySelector('[data-select-payment-value]'),
            paidSelectInput: wrapper.querySelector('[data-select-paid-value]'),

            // product list input
            productImageInput: wrapper.querySelector('[data-product-image-item] img'),
            productNameInput: wrapper.querySelector('[data-product-name-item]'),
            productQuantityInput: wrapper.querySelector('[data-product-quantity-item]'),
        };

        // vars
        const urlObject = new URL(location.href);
        this.FETCH_URL = urlObject.origin + urlObject.pathname;

        // handle click action
        this.wrapper.addEventListener('click', this.handleWrapperClick.bind(this));

        // create popup for each [data-order-edit] element
        this.editOrderPopup = Popup.create({
            target: document.createElement('div'),
            popupContent: this.wrapper.querySelector('[data-popup-content="data-order-edit"]'),

            onPopupContentClick: (self) => {
                const eventTarget = self.event.target;

                let functionHandling = () => {
                };
                let target = null;

                const saveOrderBtnEl = eventTarget.closest('button[data-order-update-btn]');

                if(saveOrderBtnEl) {
                    functionHandling = this.handleSaveOrder.bind(this);
                    target = saveOrderBtnEl;

                    // call the function
                    functionHandling(target);
                }
            }

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
        this.elements.usernameInput.textContent = data.fullName;
        this.elements.addressInput.textContent = data.address;
        this.elements.emailInput.textContent = data.user.email;
        this.elements.phoneInput.textContent = data.phoneNumber;
        this.elements.shippingFeeInput.textContent = data.shippingFee;
        this.elements.totalInput.textContent = data.totalPrice
        this.elements.paymentSelectInput.value = data.paymentMethod;
        this.elements.paidSelectInput.value = data.isPaid ? 'paid' : 'unpaid'

        data.variations.forEach(product => {
            this.elements.productImageInput.src = product.image.small
            this.elements.productNameInput.textContent = product.productName;
            this.elements.productQuantityInput.textContent = product.quantity;
        })
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
                this.replaceOrder(result.data)
            })

            // catch the error
            .catch(err => console.error(err));
    };

    /**
     * Handle save order
     * */
    handleSaveOrder(target){
        const formEl = target.closest('[data-order-form]');
        const id = formEl.getAttribute('data-id');

        const formData = new FormData();

        formData.append('paymentMethod', this.elements.paymentSelectInput.value);
        formData.append('isPaid', this.elements.paidSelectInput.value);

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

                const orderItemEl = this.wrapper.querySelector(`[data-order-item][data-id="${id}"]`);
                if(!orderItemEl){
                    console.error('Can not find an order with id', id);
                    return;
                }

                // update the new user
                // orderItemEl.querySelector('[data-select-status-value]').innerHTML = result.status;


                // close the popup
                this.editOrderPopup.close();
            })
            .catch(err => console.error(err));
    }

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