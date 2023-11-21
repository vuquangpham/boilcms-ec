class Variations{
    constructor(){
    }

    validateVariation(attributes, wrapper, isInit = true){
        // init validate
        if(isInit){

            if(attributes.length === 0){
                wrapper.querySelector('.field').classList.add('invalid');
                return false;
            }
            wrapper.querySelector('.field').classList.remove('invalid');
            return true;
        }

        // validate for save action
        const image = wrapper.querySelector('[data-variation-image]');
        const imagesData = JSON.parse(image.getAttribute('data-variation-image'));

        // // validate image
        // if(imagesData.length === 0){
        //     image.closest('.field').classList.add('invalid');
        //     return false;
        // }else{
        //     image.closest('.field').classList.remove('invalid');
        // }

        // validate the inventory
        const inventory = wrapper.querySelector('[data-variation-inventory]');
        if(!parseFloat(inventory.value.trim())){
            inventory.closest('.field').classList.add('invalid');
            return false;
        }else{
            inventory.closest('.field').classList.remove('invalid');
        }

        // validate price
        const price = wrapper.querySelector('[data-variation-price]');
        if(!parseFloat(price.value.trim())){
            price.closest('.field').classList.add('invalid');
            return false;
        }else{
            price.closest('.field').classList.remove('invalid');
        }

        return true;
    }

    createDOM(data){
        const attributes = data.attributes;

        const images = data.images;
        const inventory = data.inventory;
        const price = data.price;
        const salePrice = data.salePrice;

        // attributes html
        let attributesHTML = '';
        attributes.forEach((a, i) => {

            const optionsHTML = a.values.map(v => `<option value="${v.name}">${v.prettyName}</option>`).join('');

            attributesHTML += `
<div class="field vertical-layout" data-variation-attribute="${a.name}">
    <label for="attribute[${i}]">${a.name}</label>
    <select id="attribute[${i}]">${optionsHTML}</select>
</div>
            `;
        });

        const div = document.createElement('div');
        div.innerHTML = `
<div data-product-variation-item data-accordion>

    <div data-trigger-wrapper class="d-flex jc-space-between">

        <div>
            <span>Name: color</span>
        </div>

        <div class="d-flex">
            <button class="btn_primary" data-variation-trigger="item"
                    type="button">
                Expand
            </button>
            <button class="btn_primary error" type="button">Remove</button>
        </div>
    </div>

    <div data-variation-receiver="item">
    
        <div data-variation-attributes='${JSON.stringify(attributes)}'>${attributesHTML}</div>

        <div class="form-fields">

            <div class="field half vertical-layout" data-variation-image="${images ?? JSON.stringify([])}">
                <button>Image</button>
                <div class="description error">Please input the images</div>
            </div>

            <div class="field half vertical-layout">
                <label for="sku">SKU</label>
                <input type="number" placeholder="SKU" name="skud" data-variation-inventory value="${inventory ?? ''}">
                <div class="description error">Please input the inventory</div>
            </div>

            <div class="field half vertical-layout">
                <label for="">Price</label>
                <input type="number" placeholder="Price" name="price" data-variation-price value="${price ?? ''}">
                <div class="description error">Please input the price</div>
            </div>

            <div class="field half vertical-layout">
                <label for="">Sale Price</label>
                <input type="number" placeholder="Sale Price"
                       name="sale-price" data-variation-sale-price value="${salePrice ?? ''}">
                <div class="description" style="display:block;">You can leave it empty!</div>
            </div>
            
            <div class="field">
                <button class="btn_primary" type="button" data-variation-save-btn>Save</button>
            </div>

        </div>
    </div>
</div>
        `;

        // create the accordion
        Accordion.create({
            target: div.querySelector('[data-accordion]'),
            triggerAttr: 'data-variation-trigger',
            receiverAttr: 'data-variation-receiver',
            triggerSelector: '[data-variation-trigger]',
            receiverSelector: '[data-variation-receiver]',
        });

        return div.firstElementChild;
    }

    createNewVariation(attributes, wrapper, wrapperToAppend){
        const isValidated = this.validateVariation(attributes, wrapper);
        if(!isValidated) return;

        // get the value
        const variationElement = this.createDOM({
            attributes
        });

        // append to the DOM
        wrapperToAppend.appendChild(variationElement);
    }
}

export default new Variations();