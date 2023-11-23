const Type = require("../../../core/classes/utils/type");
const ComponentController = require("../../../core/classes/component/component-controller");
const Categories = require("../../../core/database/categories/model");
/**
 * Handle edit action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleEditAction = async(request, response) => {
    const categoryItem = response.locals.categoryItem;
    const pageId = request.query.id;

    const promise = categoryItem.getDataById(pageId);
    const extraData = {};

    // post type
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

    return [promise, extraData];
};

module.exports = handleEditAction;