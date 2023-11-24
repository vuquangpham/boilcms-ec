const Category = require('./category');
const {stringToSlug} = require("../../utils/helper.utils");
const PageBuilder = require("../../database/page-builder/model");
const Categories = require("../../database/categories/model");

class POSTS extends Category{
    constructor(config){
        super(config);
    }

    /**
     * Get specific data based on id
     * @return {Promise}
     * */
    getDataById(id){
        return new Promise((resolve, reject) => {
            this.databaseModel.findById(id).populate('content').populate('categories')
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * Get all data from category
     * @return {Promise}
     * */
    getAllData(){
        return new Promise((resolve, reject) => {
            this.databaseModel.find().populate('author').populate('categories')
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * Validate input data to get the correct data
     * */
    async validateInputData(inputData, action = 'add') {
        const request = inputData.request;
        const response = inputData.response;

        const title = request.body.title.trim();
        let url = stringToSlug(title);

        // visibility and template
        const visibility = request.body.visibility.trim();
        const template = request.body.template;

        // author
        let author = response.locals.user._id;
        let authorName = response.locals.user.name;

        // content of page builder
        let content = '';

        // categories of page/post
        let categories = '';
        let postType = response.locals.categoryItem.type;
        let oldCategories = '';
        oldCategories = request.body.oldCategories

        let defaultCategory = {prettyName: 'Uncategorized', type: postType}

        // save category
        // if category have select value
        if(oldCategories) {
            categories = await Categories.findOne({prettyName: oldCategories, type: postType})
        }
        // if select and input don't have any value
        else if (!oldCategories && !request.body.categories){
            categories = await Categories.findOne(defaultCategory);
            if(!categories) {
                categories = new Categories(defaultCategory)
            }
            await categories.save();
        }
        // if category have input value
        else {
            categories = new Categories({
                type: postType,
                prettyName: request.body.categories.trim()
            });

            await categories.save();
        }

        switch (action) {
            case 'add': {
                content = new PageBuilder({
                    content: request.body.content.trim()
                });

                // save to database
                content.save();

                break;
            }
            case 'edit': {
                content = request.body.content;
                url = request.body.url;

                break;
            }
        }

        const returnObj = {
            title,
            url,
            visibility,
            content,
            template,
            categories
        };

        if (action === 'add') {
            returnObj.author = author;
            returnObj.authorName = authorName;
        }

        return returnObj;
    }

    /**
     * Update data to category
     * */
    update(id, data){
        return new Promise((resolve, reject) => {
            this.databaseModel.findById(id).populate('content').populate('categories')
                .then(post => {
                    // update the page builder content
                    const content = post.content;
                    content.content = data.content;

                    // update category
                    post.categories = data.categories

                    // update the post
                    post.title = data.title;
                    post.url = data.url;
                    post.visibility = data.visibility;
                    post.template = data.template;

                    // resolve
                    Promise.all([content.save(), post.save()])
                        .then(result => resolve(result))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        });
    }

    /**
     * Delete post
     * */
    delete(id){
        return new Promise((resolve, reject) => {
            this.databaseModel.findById(id).populate('content')
                .then(post => {
                    // resolve
                    Promise.all([post.deleteOne(), post.content.deleteOne()])
                        .then(result => resolve(result))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        });
    }
}

module.exports = POSTS;