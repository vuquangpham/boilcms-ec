const Type = require("../../../core/classes/utils/type");
const ComponentController = require("../../../core/classes/component/component-controller");
/**
 * Handle edit action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleEditAction = (request, response) => {
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
    }

    return [promise, extraData];
};

module.exports = handleEditAction;