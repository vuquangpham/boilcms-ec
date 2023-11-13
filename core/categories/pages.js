const Type = require("../classes/utils/type");
const POSTS = require('../classes/category/posts-category');
const {readFilesInFolderInAsync} = require("../utils/os.utils");
const {CUSTOM_TEMPLATES_DIRECTORY} = require("../utils/config.utils");
const {capitalizeString} = require("../utils/helper.utils");

class Pages extends POSTS{
    constructor(config){
        super(config);

        // get custom templates
        this.templates = [
            {
                name: 'default',
                prettyName: 'Default'
            }
        ];
        this.getCustomTemplates();
    }

    /**
     * Is a custom template
     * */
    isCustomTemplate(template){
        return template !== this.templates[0].name;
    }

    /**
     * Get custom view templates
     * */
    getCustomTemplates(){
        readFilesInFolderInAsync(CUSTOM_TEMPLATES_DIRECTORY)
            .then(fileNames => {
                fileNames.forEach(f => {
                    const name = f.slice(0, -4);

                    this.templates.push({
                        name,
                        prettyName: capitalizeString(name)
                    });
                });
            });
    }
}

module.exports = new Pages({
    name: 'Pages',
    url: '/pages',
    type: 'pages',
    contentType: Type.types.POSTS,
    isSpecialType: true,
    children: [
        {
            name: 'Add new',
            url: '?action=add',
            compare: (data) => data.actionType === 'add'
        },
    ],
});