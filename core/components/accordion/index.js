const ComponentController = require('../../classes/component/component-controller');
const Component = require('../../classes/component/component');
const Media = require("../../categories/media");

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

        // content
        const content = this.getParam(params, 'content');

        // group
        const group = this.getParam(params, 'group');
        group.forEach(gParam => {
            const heading = this.getParam(gParam, 'heading');
            const text = this.getParam(gParam, 'text');
            groupHTML += `
<div class="item">
    <div class="heading">${heading}</div>
    <div class="text">${text}</div>
</div>
            `;
        });

        return `
<div class="accordion">
    <div class="heading">${content}</div>
    <div class="group">${groupHTML}</div>
</div>`;
    }
}

module.exports = new Accordion();