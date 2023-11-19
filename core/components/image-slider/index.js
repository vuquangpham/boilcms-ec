const ComponentController = require('../../classes/component/component-controller');
const Component = require('../../classes/component/component');
const Media = require('../../categories/media');

class ImageSlider extends Component{
    constructor(){
        super({
            name: 'image-slider',
            title: 'Image Slider',
            description: 'WYSIWYG content and images',
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
                    paramName: 'images',
                    classesName: 'col-4',
                },
            ],
        });
    }

    async render(data){
        const params = data.params;
        const options = data.options;

        // options
        const bottomSpacing = this.getOptions(options, 'spacing');

        // content
        const content = this.getParam(params, 'content');

        // image
        const imagesId = this.getParam(params, 'images');
        const promises = imagesId.map(id => Media.getDataById(id));

        const images = await Promise.all(promises);
        const imagesHTML = images.map(i => `
<div class="image-slider__image">
    <div class="img-wrapper-cover skeleton-bg">
        <img src="${i.url.original}" alt="${i.name}" />
    </div>
</div>`).join('');

        return `
<div class="image-slider ${bottomSpacing}">
    <div class="container-full-width">
        <div class="container">
            <div class="image-slider__content ta-center"><div class="boil-content">${content}</div></div>
        </div>
        <div class="image-slider__images">${imagesHTML}</div>
    </div>
</div>`;
    }
}

module.exports = new ImageSlider();