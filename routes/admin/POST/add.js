/**
 * Handle add action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleAddAction = (request, response) => {
    const categoryItem = response.locals.categoryItem;
    const inputData = {request, response};
    const data = categoryItem.validateInputData(inputData);

    const promise = categoryItem.add(data);
    const extraData = {};

    return [promise, extraData];
};

module.exports = handleAddAction;