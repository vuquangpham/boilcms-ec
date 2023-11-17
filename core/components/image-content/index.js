const ComponentController = require('../../classes/component/component-controller');
const Component = require('../../classes/component/component');
const Media = require('../../categories/media');

class ImageContent extends Component{
    constructor(){
        super({
            name: 'image-content',
            title: 'Image Content',
            description: 'WYSIWYG content and image',
            params: [
                {
                    type: ComponentController.paramTypes.TEXT,
                    heading: 'Content',
                    paramName: 'content',
                    classesName: 'col-8',
                    description: 'WYSIWYG Content'
                },
                {
                    type: ComponentController.paramTypes.IMAGE,
                    heading: 'Image',
                    paramName: 'image',
                    classesName: 'col-4',
                    options: 'single-image',
                    description: 'Please select single image'
                },
            ],

            options: [
                {
                    name: 'Image alignment',
                    paramName: 'image-alignment',
                    description: 'Change the alignment of the image',
                    className: "",
                    value: {
                        'Left': '',
                        'Right': 'image-position-right'
                    }
                }
            ]
        });
    }

    async render(data){
        const params = data.params;
        const options = data.options;

        // options
        const isRightPosition = this.getOptions(options, 'image-alignment');

        // content
        const content = params.find(p => p.key === 'content');

        // image
        const image = params.find(p => p.key === 'image');
        const imageData = await Media.getDataById((JSON.parse(image.value)));
        const imageURL = imageData.url;

        return `
<div class="image-content ${isRightPosition ? 'image-position-right' : ''}">
   <div class="image-content__inner fl-grid ai-center">

        <div class="image-content__col image w100 img-wrapper-cover skeleton-bg">
            <img src="${imageURL.original}" alt="${imageData.name}">
        </div>
    
        <div class="image-content__col content w100">
            <div class="boil-content">${content.value}</div>
        </div>
    </div>
</div>`;
    }
}

module.exports = new ImageContent();