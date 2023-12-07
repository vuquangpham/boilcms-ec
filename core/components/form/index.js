const ComponentController = require('../../classes/component/component-controller');
const Component = require('../../classes/component/component');
const {ADMIN_URL} = require("../../utils/config.utils");

class Form extends Component{
    constructor(){
        super({
            name: 'form',
            title: 'Form',
            description: 'Form component with multiple choices',
            params: [
                {
                    type: ComponentController.paramTypes.TEXT,
                    heading: 'Content',
                    paramName: 'content',
                    classesName: 'col-12',
                    description: 'WYSIWYG Content'
                }
            ],
            options: [
                {
                    name: 'Choose Form',
                    paramName: 'form-type',
                    description: 'Choose type of form',
                    className: "",
                    value: {
                        'Contact Form': '',
                    }
                }
            ]
        });
    }

    async render(data){
        const options = data.options;

        // content
        const content = this.getParam(data.params, 'content');

        // options
        const bottomSpacing = this.getOptions(options, 'spacing');
        const typeOfForm = this.getOptions(options, 'form-type');

        return `
<div class="form ${bottomSpacing}">

    <div class="form__content boil-content ta-center margin-bottom-medium">${content}</div>

    <form action="/${ADMIN_URL}/contact?method=post&action=add" method="post" class="form__form">
        <div class="form-fields">
            <div class="field vertical-layout half">
                <label for="user-name">Name</label>
                <input type="text" id="user-name" placeholder="Name" name="username">
            </div>
            <div class="field vertical-layout half">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Email" name="email">
            </div>
            <div class="field vertical-layout">
                <label for="content">Content</label>
                <textarea name="content" id="content" placeholder="Description"></textarea>
            </div>
            
            <div class="footer">
                <button class="btn_primary">Submit</button>
            </div>
        </div>  
    </form>
</div>
        `;
    }
}

module.exports = new Form();