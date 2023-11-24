const Category = require("../../core/classes/category/category");
const Types = require("../../core/classes/utils/type");
const Categories = require("../database/categories/model");

class Product extends Category{
    constructor(config){
        super(config);
    }

    /**
     * Validate input product
     * */
    async validateInputData(inputData, action = 'add') {
        const request = inputData.request;
        const response = inputData.response;

        // vars
        const name = request.body.name;
        const description = request.body.description;
        const categoryImage = request.body['product-category-image'];
        const url = request.body.url;

        // product types
        const type = request.body.type;
        const simpleProductJSON = request.body.simpleProductJSON;
        const variableProductJSON = request.body.variableProductJSON;

        const visibility = request.body.visibility;

        // categories of page/post
        let categories = '';
        categories = await this.handleCategoryInput(request, response, categories)

        return {
            name,
            description,
            categoryImage,
            url,
            type,
            visibility,
            categories,
            simpleProductJSON,
            variableProductJSON
        };
    }
    async handleCategoryInput(request, response, categories) {

        // get postType
        let postType = response.locals.categoryItem.type;

        // get categories from select
        let availableCategories = request.body.availableCategories

        // defined uncategorized object
        let uncategorized = {prettyName: 'Uncategorized', type: postType}

        // save category
        // if category have select value
        if (availableCategories) {
            categories = await Categories.findOne({prettyName: availableCategories, type: postType})
        }

        // if select and input don't have any value
        else if (!availableCategories && !request.body.categories) {
            categories = await Categories.findOne(uncategorized);
            if (!categories) {
                categories = new Categories(uncategorized)
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

        return categories
    }

    /**
     * Get specific data based on id
     * @return {Promise}
     * */
    getDataById(id) {
        return new Promise((resolve, reject) => {
            this.databaseModel.findById(id).populate('categories')
                .then(async data => {
                    // if categories have been deleted, then category replace by default category
                    if (data.categories === null) {
                        data.categories = await Categories.findOne({prettyName: 'Uncategorized'})
                    }
                    resolve(data);
                })
                .catch(async err => {
                    reject(err);
                });
        });
    }

    /**
     * Get all data from category
     * @return {Promise}
     * */
    getAllData() {
        return new Promise((resolve, reject) => {
            this.databaseModel.find().populate('categories')
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}

module.exports = new Product({
    name: 'Products',
    url: '/products',
    type: 'products',
    contentType: Types.types.PRODUCTS,
    children: [
        {
            name: 'Add product',
            url: '?action=add'
        }
    ]
});