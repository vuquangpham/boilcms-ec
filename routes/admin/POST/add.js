/**
 * Handle add action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleAddAction = async(request, response) => {
    const categoryItem = response.locals.categoryItem;
    const inputData = {request, response};
    const data = await categoryItem.validateInputData(inputData);

    console.log(categoryItem);

    const promise = categoryItem.add(data, request);
    const extraData = {};

    return [promise, extraData];
};

module.exports = handleAddAction;