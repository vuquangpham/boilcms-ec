const Category = require('../classes/category/category');
const Types = require('../classes/utils/type');

class Contact extends Category{
    constructor(config) {
        super(config);
    }

    validateInputData(inputData, action = 'add') {
        const request = inputData.request;
        const response = inputData.response;

        // input
        const title = response.body.title;
        const email = response.body.email;
        const content = response.body.email;

        const returnObj = {
            title,
            email,
            content
        }

        return returnObj
    }
}

module.exports = new Contact({
    name: 'Contact',
    url: '/contact',
    type: 'contact',
    contentType: Types.types.CONTACT,
    order: 1
})