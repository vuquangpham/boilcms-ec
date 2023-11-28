const Component = require('../../classes/component/component');
const ComponentController = require('../../classes/component/component-controller');

class Form extends Component{
    constructor() {
        super({
            name: 'form',
            title: 'Form',
            description: 'This is form',
            params: [
                {
                    type: ComponentController.paramTypes.FORM,
                    heading: 'Form',
                    paramName: 'form',
                    classesName: '',

                }
            ]

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

module.exports = new Form();