const Category = require('../classes/category/category');
const Type = require("../classes/utils/type");

class Default extends Category{
    constructor(config){
        super(config);
    }
}

module.exports = new Default({
    name: 'Dashboard',
    url: '/',
    type: 'default',
    contentType: Type.types.DEFAULT,
});