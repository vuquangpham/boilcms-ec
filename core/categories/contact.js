const Category = require('../classes/category/category');
const Types = require('../classes/utils/type');

class Contact extends Category{
    constructor(config) {
        super(config);
    }
}

module.exports = new Contact({
    name: 'Contact',
    url: '/contact',
    type: 'contact',
    contentType: Types.types.CONTACT,
    order: 1
})