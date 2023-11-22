import Component from "../component";
import fetch from "@global/js/fetch";
import UpdateComponentState from "./UpdateComponentState";

// WYSIWYG editor
import 'quill/dist/quill.snow.css';

export default class ModifyComponent{
    constructor(wrapper){
        this.wrapper = wrapper;
        this.isEdit = false;

        // editors for wysiwyg editor
        this.editors = [];

        this.init();
    }

    init(){
        // register DOM elements
        this.parentGroup = null;
        this.componentDetailPanel = this.wrapper.querySelector('[data-pb-component-popup-content]');
        this.componentOptionsPanel = this.wrapper.querySelector('[data-pb-component-options]');
        this.wrapperComponentEl = this.wrapper.querySelector('[data-component-wrapper]');
        this.jsonElement = this.wrapper.querySelector('[data-pb-json]');

        // register onchange event
        this.jsonElement.addEventListener('input', Theme.debounce(this.renderComponents.bind(this)));

        // render components based on JSON
        this.renderComponents();
    }

    renderComponents(){
        const jsonContent = this.jsonElement.value;
        if(!jsonContent){
            this.wrapperComponentEl.querySelector('[data-component-content]').innerHTML = '';
            return;
        }

        // get wrapper component
        const componentElement = UpdateComponentState.generateObjectToDomElement(JSON.parse(jsonContent));

        // register data toggle
        Theme.toggleAttributeAction(componentElement.querySelectorAll('[data-toggle]'));

        // replace element
        this.wrapperComponentEl.replaceWith(componentElement);
        this.wrapperComponentEl = componentElement;
    }

    getComponentInfoFromServer(componentName){
        return new Promise((resolve, reject) => {
            const urlObject = new URL(location.href);
            const url = urlObject.origin + urlObject.pathname;

            fetch(url, {
                method: 'get',
                action: 'get',
                getJSON: true,
                componentName
            })
                .then(res => res.json())
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    }

    handleAddComponentClick(target){
        // re-assign parent group
        this.parentGroup = target.closest('[data-component]');
    }

    handleEditComponentClick(target){
        this.isEdit = true;
        this.edittingComponent = target.closest('[data-component]');

        const componentName = this.edittingComponent.dataset.component;

        // get param value
        const params = Array.from(this.edittingComponent.querySelectorAll('[data-param]'))
            .map(param => {
                const obj = {};
                obj.key = param.getAttribute('data-param');
                const value = param.querySelector('[data-param-value]').getAttribute('data-param-value');
                try{
                    obj.value = JSON.parse(value);
                }catch(e){
                    obj.value = value;
                }
                return obj;
            })
            .reduce((acc, cur) => {
                if(cur.key === 'group'){
                    cur.value = cur.value.map(item => {
                        return item.reduce((acc, cur) => {
                            const obj = acc.find(o => o.key === cur.key);

                            // already exist, increase the count
                            cur.index = obj ? obj.index + 1 : 0;

                            acc.push(cur);
                            return acc;
                        }, []);
                    });
                }

                const obj = acc.find(o => o.key === cur.key);

                // already exist, increase the count
                cur.index = obj ? obj.index + 1 : 0;

                acc.push(cur);
                return acc;
            }, []);

        this.getComponentInfoFromServer(componentName)
            .then(result => {
                const componentName = result.component.name;
                this.loadComponent(result);

                // load data to pop up and update the value
                if(!this.isGroupComponent(componentName)){
                    this.loadDataToPopup(params);
                }

                // init accordion
                Accordion.create();

                // validate the previous value
                UpdateComponentState.updateThePreviousValue(this);
            });
    }

    handleDeleteComponentClick(target){
        const componentEl = target.closest('[data-component]');
        componentEl.remove();

        // re-generate JSON
        this.createJSON();
    }

    handleSaveBtnClick(_){
        // component information
        const componentInformation = {
            name: this.componentDetailPanel.dataset.component,
            params: [],
            options: []
        };

        // get params
        Array.from(this.componentDetailPanel.querySelectorAll('[data-component-content] > [data-type]')).forEach(el => {
            const paramValueEl = el.querySelector('[data-param-value]');
            const value = paramValueEl?.getAttribute('data-param-value');

            const obj = {};
            obj.key = el.dataset.param;
            obj.value = value || '';

            if(obj.key === 'group'){
                obj.value = Array.from(el.querySelectorAll('[data-group-item]')).map(gItem => {
                    return Array.from(gItem.querySelectorAll('[data-type]')).map(e => {
                        const paramValueEl = e.querySelector('[data-param-value]');
                        const value = paramValueEl?.getAttribute('data-param-value');

                        const obj = {};
                        obj.key = e.dataset.param;
                        obj.value = value || '';

                        return obj;
                    });
                });
            }
            componentInformation.params.push(obj);
        });

        // get options
        this.componentOptionsPanel.querySelectorAll('[data-option-param]').forEach(option => {
            const obj = {};
            obj.key = option.getAttribute('data-option-param');
            obj.value = option.querySelector('select').value;

            componentInformation.options.push(obj);
        });

        const componentInstance = new Component(componentInformation);
        const componentDomEl = componentInstance.component;

        // edit component or add the new one
        if(this.isEdit){
            this.edittingComponent.replaceWith(componentDomEl);
            this.isEdit = false;
        }else{
            // insert to the group
            this.parentGroup.querySelector('[data-component-content]').insertAdjacentElement('beforeend', componentDomEl);
        }

        // toggle attribute
        Theme.toggleAttributeAction(componentDomEl.querySelectorAll('[data-toggle]'));

        // create JSON
        this.createJSON();
    }

    loadDataToPopup(data){
        data.forEach(d => {
            // group type
            if(d.key === 'group'){
                const parentElm = this.componentDetailPanel.querySelectorAll(`[data-param="${d.key}"]`)[d.index];
                const groupElm = parentElm.querySelector('[data-group-children]');

                d.value.forEach((childData, index) => {
                    let childItem = parentElm.querySelector(`[data-group-item]:nth-child(${index + 1})`);

                    // the child item 2nd, 3rd... is not exist because the BE server only return 1
                    if(!childItem){
                        const item = groupElm.querySelector('[data-group-item]');

                        // new item
                        childItem = UpdateComponentState.cloneDOMComponent(item, this);
                        groupElm.appendChild(childItem);
                    }

                    childData.forEach(d => {
                        childItem
                            .querySelectorAll(`[data-param="${d.key}"]`)[d.index]
                            .querySelector('[data-param-value]').setAttribute('data-param-value', d.value);
                    });
                });

                return;
            }

            // another type
            this.componentDetailPanel
                .querySelectorAll(`[data-param="${d.key}"]`)[d.index]
                .querySelector('[data-param-value]').setAttribute('data-param-value', d.value);
        });
    }

    createJSON(){
        this.jsonElement.value = JSON.stringify(UpdateComponentState.generateDomElementToObject(this.wrapperComponentEl));
    }

    loadOptions(component){
        const options = component.options;

        let html = '<div data-option-wrapper>#REPLACE</div>';

        const optionsHTML = options.map(o => {
            const paramName = o.paramName;
            const title = o.name;
            const values = Object.entries(o.value).map(i => ({key: i[0], value: i[1]}));
            const description = o.description || '';
            const className = o.className || 'col-6';

            return `
<div data-option-param="${paramName}" class="${className}">
    <div class="fl-center-v posts-detail__dropdown">
        <span class="fw-bold txt_14px">${title}</span>
        <select data-easy-select data-option-select="${paramName}">
        ${values.map((v, index) => {
                return `<option ${index === 0 ? 'selected' : ''} value="${v.value}">${v.key}</option>`;
            }).join('')}
        </select>   
    </div>
    ${description ? `<div class="description">${description}</div>` : ''}
</div>
            `;
        }).join('');

        html = html.replace('#REPLACE', optionsHTML);
        this.componentOptionsPanel.innerHTML = html;
    }

    loadComponent(result){
        // reset the editors
        this.editors = [];

        // get types of component
        this.componentTypes = Array
            .from(
                new Set(result.component
                    .params
                    .reduce((acc, cur) => {
                        if(cur.type !== "group"){
                            acc.push(cur.type);
                            return acc;
                        }
                        const params = cur.params;
                        params.forEach(p => {
                            acc.push(p.type);
                        });
                        return acc;
                    }, []))
            );

        const div = document.createElement('div');
        div.innerHTML = result.data;

        // reset the last one
        this.componentDetailPanel.innerHTML = `<div data-component-information data-custom-title><span data-component-name>${result.component.title}</span></div>`;

        // children elements
        if(result.data){
            const componentContent = document.createElement('div');
            componentContent.setAttribute('data-component-content', '');
            componentContent.append(...[...div.children]);
            this.componentDetailPanel.appendChild(componentContent);
        }

        // set component name
        this.componentDetailPanel.dataset.component = result.component.name;

        // init component script
        if(this.componentTypes.find(t => t === 'text'))
            UpdateComponentState.initWYSIWYGEditor(this.componentDetailPanel.querySelectorAll('#editor-container'), this);
        if(this.componentTypes.find(t => t === 'text-field'))
            UpdateComponentState.initTextField(this.componentDetailPanel.querySelectorAll('[data-type="text-field"]'));

        // toggle attribute
        Theme.toggleAttributeAction(this.componentDetailPanel.querySelectorAll('[data-toggle]'));

        // load options
        this.loadOptions(result.component);
    }

    handleComponentClick(target){
        const componentName = target.dataset.component;

        this.getComponentInfoFromServer(componentName)
            .then(result => {
                // load component
                this.loadComponent(result);

                if(this.isGroupComponent(componentName)) this.handleSaveBtnClick(target);

                // init Accordion
                Accordion.create();
            });
    }

    isGroupComponent(componentName){
        return componentName === 'row';
    }

    handleAddItemInGroupComponent(target){
        const parent = target.closest('[data-group]');
        const group = parent.querySelector('[data-group-children]');
        const item = group.querySelector('[data-group-item]');

        const newItem = UpdateComponentState.cloneDOMComponent(item, this);
        group.appendChild(newItem);
    }

    handleRemoveItemInGroupComponent(target){
        const item = target.closest('[data-group-item]');
        item.remove();
    }

    handleDivideColumnsInGroup(target){
        // data-group-divide-save
        // const parent = target.closest('[data-group-divide]');
        // const input = parent.querySelector('input');
        // const errorMsgEl = parent.querySelector('[data-group-err-msg]');
        //
        // const value = input.value.trim();
        // const columns = value.split('+').map(c => parseInt(c.trim()));
        //
        // // handle error
        // let errorMessage = '';
        // const total = columns.reduce((acc, cur) => acc + cur, 0);
        //
        // // validate the columns
        // if(columns.some(v => !v)) errorMessage = "Invalid number exist!";
        // else if(total > 12 || total < 0 || total !== 12) errorMessage = "The total must be equal to 12!";
        //
        // // has error
        // if(errorMessage){
        //     errorMsgEl.innerHTML = errorMessage;
        //     parent.classList.add('has-error');
        //     return;
        // }else{
        //     errorMsgEl.innerHTML = '';
        //     parent.classList.remove('has-error');
        // }

        // handle the logic

        // 0 co column => insert column vao

        // them cols [3 4 5] => [2 2 2 6]

        // giam cols [2 2 2 6] => [3 4 5]
    }

    isModifyHandler(e){
        let functionForHandling = () => {
        }, target = null;

        // add more components
        const addButtonEl = e.target.closest('[data-component-add]');

        // save component
        const saveButtonEl = e.target.closest('[data-pb-component-popup-save]');

        // delete component
        const deleteButtonEl = e.target.closest('button[data-component-delete]');

        // edit component
        const editButtonEl = e.target.closest('button[data-component-edit]');

        // click to the component in components list
        const componentEl = e.target.closest('button[data-component]');

        // add item in group
        const addItemInGroupEl = e.target.closest('button[data-group-add]');

        // remove item in group
        const removeItemInGroupEl = e.target.closest('button[data-group-remove]');

        // divide columns in component
        const divideColumnBtn = e.target.closest('button[data-group-divide-save]');

        // add component button
        if(addButtonEl){
            functionForHandling = this.handleAddComponentClick.bind(this);
            target = addButtonEl;
        }

        // save component
        else if(saveButtonEl){
            functionForHandling = this.handleSaveBtnClick.bind(this);
            target = saveButtonEl;
        }

        // add component from popup
        else if(componentEl){
            functionForHandling = this.handleComponentClick.bind(this);
            target = componentEl;
        }

        // edit component
        else if(editButtonEl){
            functionForHandling = this.handleEditComponentClick.bind(this);
            target = editButtonEl;
        }

        // delete component
        else if(deleteButtonEl){
            functionForHandling = this.handleDeleteComponentClick.bind(this);
            target = deleteButtonEl;
        }

        // add item in group component type
        else if(addItemInGroupEl){
            functionForHandling = this.handleAddItemInGroupComponent.bind(this);
            target = addItemInGroupEl;
        }

        // remove item in group component type
        else if(removeItemInGroupEl){
            functionForHandling = this.handleRemoveItemInGroupComponent.bind(this);
            target = removeItemInGroupEl;
        }

        // divide column in group
        else if(divideColumnBtn){
            functionForHandling = this.handleDivideColumnsInGroup.bind(this);
            target = divideColumnBtn;
        }else{
            return null;
        }

        // return handler
        return {functionForHandling, target};
    }
}
