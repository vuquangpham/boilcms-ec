const Category = require('../classes/category/category');
const Type = require("../classes/utils/type");

class Account extends Category{
    constructor(config){
        super(config);
    }
}

module.exports = new Account({
    name: 'Account',
    url: '/account',
    type: 'account',
    contentType: Type.types.ACCOUNT,
    notShowInCategory: true
});