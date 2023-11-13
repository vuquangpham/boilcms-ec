/**
 * Handle delete action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleDeleteAction = (request, response) => {
    const categoryItem = response.locals.categoryItem;
    const id = request.query.id;

    const promise = categoryItem.delete(id);
    const extraData = {};

    return [promise, extraData];
};

module.exports = handleDeleteAction;