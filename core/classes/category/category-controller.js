const path = require("path");
const {CORE_DIRECTORY} = require("../../utils/config.utils");
const Controller = require('../utils/controller');

class CategoryController extends Controller{
    constructor(){
        super();
        this.init(path.join(CORE_DIRECTORY, 'categories'));
    }

    /**
     * Get specific category item
     * @param type {string}
     * @return {Object}
     * */
    getCategoryItem(type){
        return this.instances.find(category => category.type === type);
    }

    /**
     * Get first special category item
     * @return {Object}
     * @return {Object}
     * */
    getSpecialCategoryItem(){
        return this.instances.find(category => category.isSpecialType);
    }
}

module.exports = new CategoryController;