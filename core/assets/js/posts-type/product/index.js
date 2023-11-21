import SimpleProduct from "./SimpleProduct";
import VariableProduct from "./VariableProduct";

class ProductPost{
    constructor(wrapper){
        this.wrapper = wrapper;

        // create the product variation
        this.simpleProduct = new SimpleProduct(wrapper, wrapper.querySelector('[data-simple-product]'));
        this.variableProduct = new VariableProduct(wrapper, wrapper.querySelector('[data-variable-product]'));

        // handle submit
        this.wrapper.querySelector('form').addEventListener('submit', this.handleSubmit.bind(this));
    }

    handleSubmit(e){
        e.preventDefault();
        console.log('submit');
    }
}

document.querySelectorAll('[data-product-wrapper]').forEach(wrapper => new ProductPost(wrapper));