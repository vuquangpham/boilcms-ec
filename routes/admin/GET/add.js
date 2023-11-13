const Type = require("../../../core/classes/utils/type");
const ComponentController = require("../../../core/classes/component/component-controller");
/**
 * Handle add action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleAddAction = (request, response) => {
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
    }

    return [promise, extraData];
};

module.exports = handleAddAction;