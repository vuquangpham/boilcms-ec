import SimpleProduct from "./SimpleProduct";
import VariableProduct from "./VariableProduct";

class ProductPost {
    constructor(wrapper) {
        this.wrapper = wrapper;

        this.simpleProduct = new SimpleProduct(wrapper, wrapper.querySelector('[data-simple-product-wrapper]'));
        this.variableProduct = new VariableProduct(wrapper, wrapper.querySelector('[data-variable-product-wrapper]'))

        this.elements = {
            publishProduct: wrapper.querySelector('[data-product-publish]'),
            productTypeValue: wrapper.querySelector('[data-productType-value]'),
        }

        // this.wrapper.addEventListener('click', this.handleWrapperClick.bind(this))
        this.elements.publishProduct.addEventListener('click', this.handlePublishProduct.bind(this))

    }

    handlePublishProduct() {
        this.simpleProduct.save()
        this.variableProduct.save();
    }


}

document.querySelectorAll('[data-product-wrapper]').forEach(wrapper => new ProductPost(wrapper))