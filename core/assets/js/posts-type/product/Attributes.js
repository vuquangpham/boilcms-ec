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
            <span>${data.name}</span>
        </div>

        <div class="d-flex">
            <button class="btn_primary" data-attr-trigger="item"type="button">Expand</button>
            <button class="btn_primary error" type="button">Remove</button>
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

        const nameInput = wrapper.querySelector('input[name="name"]');
        const valuesInput = wrapper.querySelector('input[name="values"]');

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
    }
}

export default new Attributes();