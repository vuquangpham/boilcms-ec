const ComponentController = require('../../classes/component/component-controller');
const Component = require('../../classes/component/component');
const Media = require('../../categories/media');

class HomeBanner extends Component{
    constructor(){
        super({
            name: 'homebanner',
            title: 'Home Banner',
            description: 'Home banner with WYSIWYG Content',
            params: [
                {
                    type: 'group',
                    heading: 'Group',
                    paramName: 'group',
                    classesName: 'group-class',
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
                            options: 'single-image',
                            classesName: 'col-4',
                            description: 'Image for each content'
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

        // group
        const group = this.getParam(params, 'group');
        const promises = group.map(async gParam => {
            const content = this.getParam(gParam, 'content');
            const imageId = this.getParam(gParam, 'image');
            const image = await Media.getDataById(imageId);

            groupHTML += `
<div class="home-banner__item fl-grid w100">
    
    <div class="home-banner__content w100 txt_color_white fl-center-v">
        <div class="boil-content">${content}</div>
    </div>
    
    <div class="home-banner__image w100 ps-relative ab-full-b">
        <div class="home-banner__image-inner h100 skeleton-bg img-wrapper-cover">
            <img src="${image.url.original}" alt="${image.name}">
        </div>
    </div>
</div>`;
            return groupHTML;
        });
        await Promise.all(promises);

        return `
<div class="home-banner ${bottomSpacing}">
    <div class="container-full-width">
        <div class="container-large">
            <div class="home-banner__inner">
                ${groupHTML}
            </div>
        </div>
    </div>
</div>`;
    }
}

module.exports = new HomeBanner();