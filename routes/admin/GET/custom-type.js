const Type = require("../../../core/classes/utils/type");
const User = require('../../../core/categories/user');

/**
 * Handle action for custom type
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleCustomTypeAction = (request, response) => {
    const categoryItem = response.locals.categoryItem;

    // vars
    let promise = Promise.resolve();
    let extraData = {};

    // Account
    if(categoryItem.contentType === Type.types.ACCOUNT) promise = User.find(response.locals.user._id);

    return [promise, extraData];
};

module.exports = handleCustomTypeAction;