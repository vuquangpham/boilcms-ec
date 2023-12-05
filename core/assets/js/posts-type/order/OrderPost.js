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
            statusSelectInput: wrapper.querySelector('[data-select-status-value]'),

            // product list input
            productList: wrapper.querySelector('[data-products-item]'),
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
        this.elements.usernameInput.value = data.fullName;
        this.elements.addressInput.value = data.address;

        this.elements.phoneInput.value = data.phoneNumber;
        this.elements.shippingFeeInput.value = data.shippingFee;
        this.elements.totalInput.value = data.totalPrice;
        this.elements.paymentSelectInput.value = data.paymentMethod;
        this.elements.statusSelectInput.value = data.status;
        this.elements.paidSelectInput.value = data.isPaid ? 'paid' : 'unpaid'

        // clear existing products before adding new ones
        this.elements.productList.innerHTML = '';

        data.variations.forEach(product => {
            const content = document.createElement('div')
            content.innerHTML = `
                <div class="products-item--product-image" data-column="ProductImage" data-product-image-item>
                    <img alt="" src="${product.image.small}">
                        </div>

                <div class="products-item--product-name" data-column="ProductName" data-product-name-item>${product.productName}</div>

                <div class="products-item--product-quantity" data-column="Quantity"
                     data-product-quantity-item>${product.quantity}</div>
            `
            this.elements.productList.appendChild(content)

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

        formData.append('name', this.elements.usernameInput.value);
        formData.append('address', this.elements.addressInput.value);
        formData.append('phoneNumber', this.elements.phoneInput.value);

        // select
        formData.append('payment', this.elements.paymentSelectInput.value);
        formData.append('status', this.elements.statusSelectInput.value);
        formData.append('isPaid', this.elements.paidSelectInput.value === 'paid');

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
                orderItemEl.querySelector('[data-username-item]').innerHTML = result.fullName;
                orderItemEl.querySelector('[data-payment-item]').innerHTML = result.paymentMethod;
                orderItemEl.querySelector('[data-order-item-status] span').innerHTML = result.status;

                // add class for any state
                result.status === 'success' ? orderItemEl.querySelector('[data-order-item-status] span').className = 'badge badge--green' :
                    orderItemEl.querySelector('[data-order-item-status] span').className = 'badge badge--red';


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