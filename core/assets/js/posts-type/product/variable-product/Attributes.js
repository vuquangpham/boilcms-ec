class Attributes{
    constructor(){
    }

    validateAttribute(wrapper){
        const nameInput = wrapper.querySelector('input[data-attribute-name]');
        const valuesInput = wrapper.querySelector('input[data-attribute-values]');

        // name
        if(!nameInput.value.trim()){
            nameInput.closest('.field').classList.add('invalid');
            return false;
        }else{
            nameInput.closest('.field').classList.remove('invalid');
        }

        // values
        if(!valuesInput.value.trim()){
            valuesInput.closest('.field').classList.add('invalid');
            return false;
        }else{
            valuesInput.closest('.field').classList.remove('invalid');
        }

        return true;
    }

    parseValuesData(value){
        return value.split('|').map(v => {
            const value = v.toLowerCase().trim();

            return {
                name: value,
                prettyName: v.length > 1 ? (value[0].toUpperCase() + value.slice(1)) : value.toUpperCase(),
                additions: {}
            };
        });
    }

    createDOM(data){
        const div = document.createElement('div');
        div.innerHTML = `
<div data-product-attribute-item='${JSON.stringify(data)}' data-accordion>
    <div data-trigger-wrapper class="d-flex jc-space-between">

        <div>
            <span class="tt-capitalize txt_14px">${data.name}</span>
        </div>

        <div class="d-flex" data-product-attribute-buttons>
            <button class="btn_primary" data-attr-trigger="item"type="button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>
            <button class="btn_primary error" type="button" data-attribute-item-remove-btn>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </button>
        </div>
    </div>

    <div data-attr-receiver="item">
        <div class="form-fields">
            <div class="field half vertical-layout">
                <label for="name" class="hidden">Name</label>
                <input data-attribute-name type="text" placeholder="Name" id="name" value="${data.name}">
                <div class="description error">Please add the name here!</div>
            </div>
            <div class="field half vertical-layout">
                <label for="values" class="hidden">Values</label>
                <input data-attribute-values type="text" placeholder="Values" id="values" value="${data.originalValue}">
                <div class="description error">Please add the values here!</div>
            </div>
            <div class="field jc-end">
                <button class="btn_primary" type="button"
                        data-product-attribute-save-btn>Save
                </button>
            </div>
        </div>
    </div>

</div>
`;

        // create accordion
        Accordion.create({
            target: div.querySelector('[data-accordion]'),
            triggerAttr: 'data-attr-trigger',
            receiverAttr: 'data-attr-receiver',
            triggerSelector: '[data-attr-trigger]',
            receiverSelector: '[data-attr-receiver]',
        });

        return div.firstElementChild;
    }

    createNewAttribute(wrapper, wrapperToAppend){
        const isValidated = this.validateAttribute(wrapper);
        if(!isValidated) return;
        const nameInput = wrapper.querySelector('input[data-attribute-name]');
        const valuesInput = wrapper.querySelector('input[data-attribute-values]');

        // get the validated data
        const validatedData = {
            name: nameInput.value.trim(),
            values: this.parseValuesData(valuesInput.value.trim()),
            originalValue: valuesInput.value.trim()
        };

        // element
        const attributeElement = this.createDOM(validatedData);

        // append to the dom
        wrapperToAppend.appendChild(attributeElement);

        // clear the dom
        nameInput.value = '';
        valuesInput.value = '';

        return validatedData;
    }
}

export default new Attributes();