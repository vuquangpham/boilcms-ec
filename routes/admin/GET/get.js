const ComponentController = require("../../../core/classes/component/component-controller");
const Type = require("../../../core/classes/utils/type");
/**
 * Handle get action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleGetAction = (request, response) => {
    const categoryItem = response.locals.categoryItem;
    const component = ComponentController.getComponentBasedOnName(request.query.componentName);

    let promise;

    // get component
    if(component){
        promise = Promise.resolve(ComponentController.getHTML(component));
    }

    // get all
    else{
        promise = categoryItem.getAllData();
    }

    // extra data
    const extraData = {};

    // load component based on component name
    if(component) extraData.component = component;

    return [promise, extraData];
};

module.exports = handleGetAction;