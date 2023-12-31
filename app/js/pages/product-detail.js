import '../vendors/flickity';
import '../components/product-quantity';

class Products{
    constructor(wrapper){
        this.wrapper = wrapper;

        this.selectedAttributes = [];
        this.availableVariations = JSON.parse(wrapper.getAttribute('data-available-variations'));
        this.easySelectInstances = [];
        this.selectNamesOrder = [];

        this.products = [];

        this.init();
    }

    init(){

        // init slider and easy select
        this.initSliderAndES();

        // simple product
        const isSimpleProduct = this.availableVariations.length === 0;
        if(isSimpleProduct) return;

        // set disabled status for the first select
        this.products.forEach(p => {
            const name = this.selectNamesOrder[0];
            const values = this.getAvailableDataBasedOnName(name).map(v => v.value);
            const select = p.select[0];

            this.addDisabledStatusToSelect(name, values, select);
        });

        // set the constraint
        const activeProduct = this.products.find(p => p.active);
        this.setConstraint(activeProduct);
    }

    setConstraint(product){
        // set dependency
        const deps = [];
        product.select.forEach(select => {
            const name = select.name;
            const value = select.instance.value;

            const constraints = this.getConstraint(deps);
            if(constraints){
                const valuesInObj = constraints.map(c => c.find(obj => obj.name === name));
                const valuesInStr = valuesInObj.map(v => v.value);

                // disabled state
                this.addDisabledStatusToSelect(name, valuesInStr, select);
            }
            deps.push({
                name, value
            });
        });
    }

    getConstraint(dependencies){
        if(dependencies.length === 0) return null;
        return this.availableVariations.filter(variation => dependencies.every(d => variation.find(v => d.name === v.name && d.value === v.value)));
    }

    getValues(names){
        const filtered = this.availableVariations.filter(variation => {
            return names.every(name => {
                return variation.find(v => v.name === name);
            });
        });
        return names
            .map(name => {
                const values = filtered.map(value => value.find(v => v.name === name).value);
                return {
                    name,
                    values
                };
            });
    }

    setActiveProduct(index){
        const previousActiveProduct = this.products.find(p => p.active === true);
        const newActiveProduct = this.products[index];

        // as the same index
        if(previousActiveProduct === newActiveProduct) return;

        // change flag
        previousActiveProduct.active = false;
        newActiveProduct.active = true;

        // update style
        previousActiveProduct.element.style.display = 'none';
        newActiveProduct.element.style.display = 'block';

        // flkty
        newActiveProduct.flktyInstances.forEach(i => {
            if(!i) return;
            i.resize();
        });

        // set constraint
        this.setConstraint(newActiveProduct);
    }

    handleSelectChange(select){
        if(this.notTriggerOnChange){
            this.notTriggerOnChange = false;
            return;
        }

        // add loading
        this.createLoading();

        const currentProduct = this.products.find(p => p.active === true);
        const values = currentProduct.select.map(selectObj => ({
            name: selectObj.name,
            value: selectObj.instance.value
        }));

        // get new product
        let index = this.products.findIndex(product => product.value.every(pValue => values.find(v => v.name === pValue.name && v.value === pValue.value)));
        if(index === -1){
            // not have data with the select
            // => get default data

            // vars
            let result = null;
            const deps = [];

            for(let i = 0; i < this.selectNamesOrder.length; i++){
                // property name
                const name = this.selectNamesOrder[i];

                // get filtered value and add to the dependency
                const filteredValue = values.find(v => v.name === name);
                deps.push(filteredValue);

                // find index
                const index = this.products.findIndex(product => {
                    // get products values based on dependency
                    const productValues = product.value.filter(v => deps.find(depValue => depValue.value === v.value));

                    // false if product values with no values or the length is smaller than the dependency
                    return !(productValues.length === 0 || productValues.length < deps.length);

                });

                // not have result
                if(index === -1) continue;

                // save the index
                result = index;
            }

            // save to the global index
            index = result;
        }
        this.setActiveProduct(index);

        // reselect the first one
        const instance = select.instance;
        const rawSelect = instance.selectTag;

        // get default active value
        const value = rawSelect.querySelector('option[data-active-option]').value;

        // flag
        this.notTriggerOnChange = value !== select.value;
        instance.select(value);

        // loading state
        setTimeout(() => {
            this.removeLoading();
        }, 500);
    }

    initSliderAndES(){
        // inner element
        this.wrapper.querySelectorAll('.product-detail__inner').forEach((inner, index) => {
            // init slider
            const mainSlider = inner.querySelector('.product-detail__images');
            const mainSliderFlkty = new Flickity(mainSlider, {
                // options
                contain: true,
                pageDots: false,
                prevNextButtons: mainSlider.children.length > 1,
                groupCells: '100%',
                wrapAround: true,
                fade: true
            });

            // nav slider
            const navSlider = inner.querySelector('.product-detail__images-nav');
            let navSliderFlkty = null;
            if(navSlider){
                navSliderFlkty = new Flickity(navSlider, {
                    // options
                    contain: true,
                    pageDots: false,
                    asNavFor: mainSlider,
                    prevNextButtons: false,
                    wrapAround: false,
                    cellAlign: 'left'
                });
            }

            // register selected attribute
            const selectedAttribute = JSON.parse(inner.getAttribute('data-selected-attributes'));
            this.selectedAttributes.push(selectedAttribute);

            // init easy select
            inner.querySelectorAll('[data-product-attribute-select]').forEach(e => {
                const selectName = e.getAttribute('name');
                const id = (Date.now() + Math.random() * 100000).toString(16);

                EasySelect.init(e, {
                    id,
                    onChange: this.handleSelectChange.bind(this)
                });
                const instance = EasySelect.get(id);

                // push to the controller
                this.easySelectInstances.push({
                    name: selectName,
                    instance,
                    productIndex: index
                });

                // select names order
                this.selectNamesOrder.push(selectName);
            });

            // products
            this.products.push({
                element: inner,
                value: JSON.parse(inner.getAttribute('data-selected-attributes')),
                active: index === 0,
                select: this.easySelectInstances.filter(e => e.productIndex === index),

                flktyInstances: [mainSliderFlkty, navSliderFlkty]
            });
        });

        // get the unique value
        this.selectNamesOrder = [...new Set(this.selectNamesOrder)];
    }

    getAvailableDataBasedOnName(name){
        return this.availableVariations
            .filter(variation => variation.find(v => v.name === name))
            .map(item => item.find(i => i.name === name));
    }

    addDisabledStatusToSelect(name, values, select){
        const instance = select.instance;
        const rawSelect = instance.selectTag;

        rawSelect.querySelectorAll('option').forEach(o => {
            if(!values.find(v => v === o.value)){
                o.setAttribute('disabled', '');
            }else{
                o.removeAttribute('disabled');
            }

            instance.refresh();
        });
    }

    createLoading(){
        this.loading = document.createElement('div');
        this.loading.classList.add('loading');
        document.body.appendChild(this.loading);
    }

    removeLoading(){
        if(this.loading) this.loading.remove();
    }
}

document.querySelectorAll('body.product-detail-page').forEach(wrapper => {

    // init related products
    wrapper.querySelectorAll('.related-products__products').forEach(slider => {
        new Flickity(slider, {
            // options
            contain: true,
            pageDots: false,
            prevNextButtons: false,
            groupCells: '100%',
            cellAlign: 'left',
            wrapAround: false,
        });
    });

    wrapper.querySelectorAll('.product-detail').forEach(i => new Products(i));

});