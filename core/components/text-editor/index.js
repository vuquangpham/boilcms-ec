const ComponentController = require('../../classes/component/component-controller');
const Component = require('../../classes/component/component');

class TextEditor extends Component{
    constructor(){
        super({
            name: 'text-editor',
            title: 'Text Editor',
            description: 'WYSIWYG content',
            params: [
                {
                    type: ComponentController.paramTypes.TEXT,
                    heading: 'Content',
                    paramName: 'content',
                    classesName: 'content-class'
                },
            ],
        });
    }

    render(data){
        // options
        const bottomSpacing = this.getOptions(data.options, 'spacing');

        // content
        const content = data.params[0].value;

        return `
<div class="text-editor ${bottomSpacing}">
    <div class="text-editor__content">${content}</div>
</div>
`;
    }
}

module.exports = new TextEditor();