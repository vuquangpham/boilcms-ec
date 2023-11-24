const Type = require("../../../core/classes/utils/type");
const ComponentController = require("../../../core/classes/component/component-controller");
const Categories = require('../../../core/database/categories/model');

/**
 * Handle add action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleAddAction = async(request, response) => {
    const categoryItem = response.locals.categoryItem;

    const promise = Promise.resolve();
    const extraData = {};

    // posts type
    if(categoryItem.contentType === Type.types.POSTS){
        // load components information
        extraData.components = ComponentController.instances;
    }

    // pages
    if(categoryItem.type === 'pages'){
        // load custom templates
        extraData.templates = categoryItem.templates;

        // load the categories
        extraData.allCategories = await Categories.find({type: 'pages'});
    }

    // products
    if(categoryItem.type === 'products'){
        // load the categories
        extraData.allCategories = await Categories.find({type: 'products'})
    }

    return [promise, extraData];
};

module.exports = handleAddAction;