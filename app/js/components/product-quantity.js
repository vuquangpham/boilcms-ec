/**
 * Handle increase/decrease button click
 * */

class ProductQuantity{
    constructor(){
        this.quantities = document.querySelectorAll('.quantity');
        this.timeout = null;
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

    updateCart(input, isIncrease){
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
    };
}

export default new ProductQuantity();