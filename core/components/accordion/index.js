const ComponentController = require('../../classes/component/component-controller');
const Component = require('../../classes/component/component');
const {stringToSlug} = require("../../utils/helper.utils");

class Accordion extends Component{
    constructor(){
        super({
            name: 'accordion',
            title: 'Accordion',
            description: 'Accordion with WYSIWYG Content',
            params: [
                {
                    type: ComponentController.paramTypes.TEXT,
                    heading: 'Content',
                    paramName: 'content',
                    classesName: '',
                    description: 'WYSIWYG text block.'
                },
                {
                    type: 'group',
                    heading: 'Group',
                    paramName: 'group',
                    classesName: 'group-class',
                    params: [
                        {
                            type: ComponentController.paramTypes.TEXT_FIELD,
                            heading: 'Heading',
                            paramName: 'heading',
                            classesName: 'col-4',
                            description: 'Heading'
                        },
                        {
                            type: ComponentController.paramTypes.TEXT,
                            heading: 'Text',
                            paramName: 'text',
                            classesName: 'col-8',
                            description: 'Content'
                        },
                    ]
                }
            ],
        });
    }

    async render(data){
        const params = data.params;
        let groupHTML = '';

        // options
        const bottomSpacing = this.getOptions(data.options, 'spacing');

        // content
        const content = this.getParam(params, 'content');

        // group
        const group = this.getParam(params, 'group');
        group.forEach((gParam) => {
            const heading = this.getParam(gParam, 'heading');
            const text = this.getParam(gParam, 'text');
            const id = stringToSlug(heading) + '-' + Date.now().toString(16);
            groupHTML += `
<div class="accordion__item">
    <div class="accordion__item-heading boil-content t" data-trigger="${id}">
        <button class="heading-3 w100 ta-left clear-button-style">${heading}</button>
    </div>
    <div class="accordion__item-content" data-receiver="${id}"><div class="accordion__item-content-inner boil-content">${text}</div></div>
</div>`;
        });

        return `
<div class="accordion ${bottomSpacing}" data-accordion>
    ${content ? '<div class="accordion__heading"><div class="boil-content ta-center">' + content + '</div></div>' : ''}
    <div class="accordion__items">${groupHTML}</div>
</div>`;
    }
}

module.exports = new Accordion();