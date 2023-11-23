/**
 * Handle edit action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleEditAction = async(request, response) => {
    const categoryItem = response.locals.categoryItem;
    const inputData = {request, response};
    const data = await categoryItem.validateInputData(inputData, 'edit');
    const id = request.query.id;
    const promise = categoryItem.update(id, data);

    const extraData = {};

    return [promise, extraData];
};

module.exports = handleEditAction;