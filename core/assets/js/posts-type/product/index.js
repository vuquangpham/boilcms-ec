import SimpleProduct from "./simple-product/SimpleProduct";
import VariableProduct from "./variable-product/VariableProduct";

class ProductPost{
    constructor(wrapper){
        this.wrapper = wrapper;

        // create the product variation
        this.simpleProduct = new SimpleProduct(wrapper, wrapper.querySelector('[data-simple-product]'));
        this.variableProduct = new VariableProduct(wrapper, wrapper.querySelector('[data-variable-product]'));

        // handle submit
        this.wrapper.querySelector('form').addEventListener('submit', this.handleSubmit.bind(this));

        // init easy select
        EasySelect.init(this.wrapper.querySelector('[data-product-types-select]'), {
            onInit: data => {
                const value = data.instance.value;
                this.changeProductTypes(value);
            },
            onChange: (data) => {
                const value = data.instance.value;
                this.changeProductTypes(value);
            }
        });
    }

    changeProductTypes(type){
        if(type === "simple"){
            this.simpleProduct.wrapper.style.display = "block";
            this.variableProduct.wrapper.style.display = "none";
        }
        if(type === "variable"){
            this.simpleProduct.wrapper.style.display = "none";
            this.variableProduct.wrapper.style.display = "block";

            // resize tabs
            this.variableProduct.resizeTab();
        }
    }

    handleSubmit(e){
        e.preventDefault();
        console.log('submit');
    }
}

document.querySelectorAll('[data-product-wrapper]').forEach(wrapper => new ProductPost(wrapper));