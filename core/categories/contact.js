const Category = require('../classes/category/category')
const Type = require("../classes/utils/type");

class Contact extends Category{
    constructor(config) {
        super(config);

    }
}

module.exports = new Contact({
    name: 'Contact',
    url: '/contact',
    type: 'contact',
    order: 1,
    contentType: Type.types.CONTACT,
})