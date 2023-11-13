/**
 * Handle get action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleGetAction = (request, response) => {
    const promise = Promise.resolve();
    const extraData = {};

    return [promise, extraData];
};

module.exports = handleGetAction;