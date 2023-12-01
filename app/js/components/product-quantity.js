/**
 * Handle increase/decrease button click
 * */

import fetch from "@global/js/fetch";

class ProductQuantity{
    constructor(options){
        this.options = {
            debounceTime: 300,
            ...options
        };
        this.quantities = document.querySelectorAll('.quantity');
        this.timeout = null;
        this.willUpdatePrice = document.body.classList.contains('cart-page');

        // user
        this.userId = document.body.querySelector('[data-user-id]')?.value;

        // init
        this.init();
    }

    init(){
        this.quantities.forEach(node => {
            const input = node.querySelector('input');
            node.classList.add('custom-product-quantity');

            // input with type hidden
            if(input.getAttribute('type') === 'hidden'){
                node.classList.add('hidden');
                return;
            }

            node.addEventListener('click', this.handleQuantityButtonClick.bind(this));
            input.addEventListener('click', this.handleInputClick.bind(this, input));
            input.addEventListener('keyup', this.handleInputKeyUp.bind(this, input));
            input.addEventListener('blur', this.handleInputBlur.bind(this, input));

            // check input quantity
            const value = input.value;
            const maxValue = input.getAttribute('max');
            const minValue = input.getAttribute('min');

            // add disabled status if the quantity reaches max value
            if(value === maxValue){
                node.querySelector('.quantity-button.increase').setAttribute('disabled', '');
            }
            if(value === minValue){
                node.querySelector('.quantity-button.decrease').setAttribute('disabled', '');
            }
        });
    }

    handleQuantityButtonClick(e){
        e.preventDefault();

        const target = e.target.closest('.quantity-button');
        if(!target) return;

        const parentElement = target.closest('.quantity');
        const input = parentElement.querySelector('input'),
            isIncrease = target.classList.contains('increase'),
            min = parseInt(input.getAttribute('min')),
            max = parseInt(input.getAttribute('max')),
            step = parseInt(input.getAttribute('step') || 1);
        let newValue = parseInt(input.value);

        // empty value
        if(!newValue){
            newValue = +input.getAttribute('data-prev-val');
        }

        // value out of range
        if((newValue >= max && isIncrease) || (newValue <= min && !isIncrease)) return;

        // increase quantity
        if(isIncrease){
            newValue += step;
        }
        // decrease
        else{
            newValue -= step;
        }

        // simulate changing event
        input.setAttribute('data-prev-val', newValue + '');
        input.value = newValue + '';

        this.updateCart(input, isIncrease, true);

        // on change event
        input.dispatchEvent(new Event('change'));
    };

    handleInputClick(input){
        if(!input.getAttribute('data-prev-val')){
            input.setAttribute('data-prev-val', input.value);
        }
        input.value = '';
        input.classList.remove('keyup');
        input.classList.remove('changed');
        input.classList.add('clicked');
    };

    handleInputKeyUp(input){
        input.classList.add('keyup');
    };

    handleInputBlur(input){
        const value = parseInt(input.value);
        const prevValue = input.getAttribute('data-prev-val');
        const min = parseInt(input.getAttribute('min'));
        const max = parseInt(input.getAttribute('max'));

        // check if value is empty string
        if(!value){
            input.value = prevValue;
            return;
        }

        // re-assign value when reach out of range
        if(value < min){
            input.value = min;
        }else if(value > max){
            input.value = max;
        }

        // call update cart when value change
        if(value !== parseInt(prevValue)){
            const isIncrease = value > parseInt(prevValue);
            this.updateCart(input, isIncrease);
        }
    };

    updateCart(input, isIncrease, debounce){
        // check input quantity
        const value = input.value;
        const maxValue = input.getAttribute('max');
        const minValue = input.getAttribute('min');

        // const wrapper
        const wrapper = input.closest('.quantity');

        // clear the current status
        wrapper.querySelector('.quantity-button.decrease').removeAttribute('disabled');
        wrapper.querySelector('.quantity-button.increase').removeAttribute('disabled');

        // check to add disabled status if the quantity reaches max value or min value
        if(isIncrease && value === maxValue){
            wrapper.querySelector('.quantity-button.increase').setAttribute('disabled', '');
        }
        if(!isIncrease && value === minValue){
            wrapper.querySelector('.quantity-button.decrease').setAttribute('disabled', '');
        }

        // not update
        if(!this.willUpdatePrice) return;

        if(debounce){
            if(this.timeout){
                clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(() => {
                this.updateCartItem(input, value);
            }, this.options.debounceTime);
            return;
        }

        // update price
        this.updateCartItem(input, value);
    };

    updateTotalPrice(wrapper, value){
        wrapper.querySelector('[data-cart-total-price]').innerHTML = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    }

    createLoading(){
        this.loading = document.createElement('div');
        this.loading.classList.add('loading');
        document.body.appendChild(this.loading);
    }

    removeLoading(){
        if(this.loading) this.loading.remove();
    }

    updateCartItem(input, quantity){
        // update total price
        const wrapper = input.closest('[data-cart-wrapper]');
        const newValue = parseInt(quantity) * parseInt(input.getAttribute('data-price'));
        this.updateTotalPrice(wrapper, newValue);

        // send api to update the cart
        const json = JSON.parse(wrapper.getAttribute('data-cart-variation'));
        const formData = new FormData();
        formData.append('id', this.userId);
        formData.append('product-id', json.productId);
        formData.append('variation-index', json.variationIndex);
        formData.append('quantity', quantity);
        formData.append('type', json.productType);
        formData.append('actionType', 'set');

        // fetch to update the cart in database
        this.createLoading();
        const URL = location.origin + '/boiler-admin/user';
        fetch(URL, {
            method: 'post',
            action: 'edit',
            posts_type: 'user',
            getJSON: true,
        }, {
            method: 'post',
            body: formData
        })
            .finally(_ => {

                // remove dom if quantity is 0
                if(parseInt(quantity) === 0){
                    const wrapper = input.closest('[data-cart-wrapper]');
                    wrapper.remove();
                }

                // remove loading
                this.removeLoading();
            });
    }
}

export default new ProductQuantity();