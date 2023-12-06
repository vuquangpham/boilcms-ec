const Category = require('../classes/category/category')
const Type = require("../classes/utils/type");

class Contact extends Category{
    constructor(config) {
        super(config);
    }

    validateInputData(inputData) {
        const request = inputData.request;
        const response = inputData.response;

        // input
        const name = request.body.name;
        const email = request.body.email;
        const content = request.body.content;

        return {
            name,
            email,
            content
        }
    }
}

module.exports = new Contact({
    name: 'Contact',
    url: '/contact',
    type: 'contact',
    order: 1,
    contentType: Type.types.CONTACT,
})