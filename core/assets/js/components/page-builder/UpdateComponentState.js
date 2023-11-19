import Component from "../component";
import Quill from "quill";
import MediaPopup from "./MediaPopup";

import Media from '../media';

class UpdateComponentState{
    constructor(){
    }

    /**
     * Generate DOM Element to Object
     * @param domElement {HTMLElement}
     * @return {Object}
     * */
    generateDomElementToObject(domElement){
        const childrenElm = domElement.querySelector('[data-component-children]');
        const contentElm = domElement.querySelector('[data-component-content]');
        const componentName = domElement.dataset.component;

        let returnObj = {
            name: componentName,
            children: [],
            options: JSON.parse(contentElm.getAttribute('data-component-options'))
        };

        // not have children => component with the data provided
        if(!childrenElm){
            returnObj.params = [];

            [...contentElm.children].forEach(param => {
                const value = JSON.parse(param.querySelector('[data-param-value]').dataset.paramValue);
                const object = {
                    key: param.dataset.param,
                    value: value,
                };
                returnObj.params.push(object);
            });

            return returnObj;
        }

        [...childrenElm.children].forEach(el => {
            returnObj.children.push(this.generateDomElementToObject.call(this, el));
        });
        return returnObj;
    }

    /**
     * Generate Object to DOM Element
     * @param property {Object}
     * @return {HTMLElement}
     * */
    generateObjectToDomElement(property){
        const componentInformation = {
            name: property.name,
            params: property.params || [],
            children: property.children,
            options: property.options
        };

        const component = new Component(componentInformation);

        const componentElement = component.component;
        const componentContentElement = componentElement.querySelector('[data-component-content]');

        // loop to get children elements
        componentInformation.children
            .map(child => this.generateObjectToDomElement.call(this, child))
            .forEach(dom => componentContentElement.appendChild(dom));

        return componentElement;
    }

    /**
     * Clond DOM Element and remove the previous value
     * @param item {Element}
     * @param context {Object}
     * @return {Element}
     * */
    cloneDOMComponent(item, context){
        // new item
        const id = item.querySelector('[data-id]')?.getAttribute('data-id');
        let newItemHTML = item.outerHTML;

        // replace group id
        if(id) newItemHTML = newItemHTML.replaceAll(id, Date.now().toString());

        // replace id for each item
        const itemId = item?.getAttribute('data-item-id');
        if(itemId) newItemHTML = newItemHTML.replaceAll(itemId, Date.now().toString());

        const div = document.createElement('div');
        div.innerHTML = newItemHTML;
        const newItem = div.firstElementChild;

        // clear data
        newItem.querySelectorAll('[data-param-value]').forEach(e => e.setAttribute('data-param-value', ''));
        newItem.querySelectorAll('.ql-editor').forEach(e => e.innerHTML = '');
        newItem.querySelectorAll('.ql-toolbar').forEach(e => e.remove());
        newItem.querySelectorAll('[data-selected-medias]').forEach(e => e.innerHTML = '');

        // register type
        newItem.querySelectorAll('[data-type]').forEach(typeEl => {

            const type = typeEl.getAttribute('data-type');
            if(type === 'text-field') this.initTextField([typeEl], true);
            if(type === 'text') this.initWYSIWYGEditor(typeEl.querySelectorAll('#editor-container'), context);
        });

        return newItem;
    }


    /**
     * Init WYSIWYG Editor
     * @param elements {NodeListOf | Array}
     * @param context {Object}
     * @return {void}
     * */
    initWYSIWYGEditor(elements, context){
        // reset editors
        // todo: maybe we will have a bug here @vupham, because of the editors variable
        elements.forEach(editorElement => {

            // init editor
            const editor = new Quill(editorElement, {
                modules: {
                    toolbar: [
                        [{header: [1, 2, false]}],
                        ['bold', 'italic', 'underline', 'strike', 'link'],
                        ['list', 'blockquote']
                    ]
                },
                placeholder: 'Input your content here...',
                theme: 'snow',
            });

            // update the param value
            editor.on('text-change', () => {
                const value = editorElement.querySelector('.ql-editor').innerHTML;
                editorElement.setAttribute('data-param-value', value);
            });

            context.editors.push(editor);
        });
    }

    /**
     * Init Text Field
     * @param elements {NodeListOf | Array}
     * @param clearLastValue {Boolean}
     * @return {void}
     * */
    initTextField(elements, clearLastValue = false){
        elements.forEach(textField => {
            const previousValueEl = textField.querySelector('[data-param-value]');
            const input = textField.querySelector('input');

            if(clearLastValue) input.value = '';

            input.addEventListener('input', () => {
                previousValueEl.setAttribute('data-param-value', input.value);
            });
        });
    }

    /**
     * Update previous value for Component (when click on the edit button)
     * @param context {Object}
     * @return void
     * */
    updateThePreviousValue(context){
        // update options
        const options = JSON.parse(
            context.edittingComponent
                .querySelector('[data-component-options]')
                .getAttribute('data-component-options')
        );
        options.forEach(option => {
            context.componentOptionsPanel.querySelector(`[data-option-select="${option.key}"]`).value = option.value;
        });

        // re-update the previous value
        if(context.componentTypes.find(t => t === 'text')){
            const editorElements = context.componentDetailPanel.querySelectorAll('#editor-container');

            editorElements.forEach((editorElement, index) => {
                const value = editorElement.getAttribute('data-param-value');
                if(value){
                    editorElement.querySelector('.ql-editor').innerHTML = value;
                    context.editors[index].update();
                }
            });
        }

        // input only
        if(context.componentTypes.find(t => t === 'text-field')){

            context.componentDetailPanel.querySelectorAll('[data-type="text-field"]').forEach(textField => {
                const previousValueEl = textField.querySelector('[data-param-value]');
                const input = textField.querySelector('input');
                const previousValue = previousValueEl.getAttribute('data-param-value');

                if(previousValue){
                    input.value = previousValue;
                }
            });
        }

        // image
        if(context.componentTypes.find(t => t === 'image')){
            context.componentDetailPanel.querySelectorAll('[data-type="image"]').forEach(imageEl => {
                const previousValue = imageEl.querySelector('[data-param-value]').getAttribute('data-param-value');
                const imagesId = previousValue ? JSON.parse(previousValue) : [];

                // get images
                const promises = [];
                imagesId.forEach(id => promises.push(Media.loadMediaById(new MediaPopup().FETCH_URL, id)));

                // handle images
                Promise.all(promises)
                    .then(data => {
                        const urls = [];

                        data.forEach(d => {
                            const imageData = d.data;
                            urls.push(imageData.url.small);
                        });

                        Media.loadPreviewMedias(imageEl, urls);
                    })
                    .catch(err => console.error(err.message));
            });
        }
    }
}

export default new UpdateComponentState();