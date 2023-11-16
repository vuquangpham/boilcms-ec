const {ADMIN_URL} = require("../../utils/config.utils");
const Type = require('../utils/type');
const mongoose = require("mongoose");

class Category{
    constructor(options){
        const defaultOptions = {
            name: '',
            url: '',
            type: '',
            contentType: '',

            // special type and show in category
            isSpecialType: false,
            notShowInCategory: false,

            // is custom template
            isCustomHTML: false,

            // children
            children: [],

            // reorder of category
            order: 0,

            // role can access this data
            acceptedRoles: ["*"]
        };
        const validatedOptions = this.validateOptions({...defaultOptions, ...options});
        if(!validatedOptions) return null;

        this.name = validatedOptions.name;
        this.url = validatedOptions.url;
        this.type = validatedOptions.type;
        this.contentType = validatedOptions.contentType;
        this.order = validatedOptions.order;
        this.children = validatedOptions.children;

        // special type (url without posts type)
        this.notShowInCategory = validatedOptions.notShowInCategory;
        this.isSpecialType = validatedOptions.isSpecialType;

        // custom template => custom html in fe
        this.isCustomHTML = validatedOptions.isCustomHTML;

        // roles
        this.acceptedRoles = validatedOptions.acceptedRoles;
    }

    /**
     * Validate options
     * @param options {Object}
     * @return {Object}
     * */
    validateOptions(options){
        // validate content type
        if(!Type.isValidType(options.contentType)) return null;

        // validate URL
        options.url = '/' + ADMIN_URL + options.url + (options.contentType && ('?post_type=' + options.contentType.name));

        // validate database model
        if(options.type && options.contentType.model){
            this.databaseModel = mongoose.model(options.type, options.contentType.model);
        }

        // validate roles
        if(options.acceptedRoles.length === 1 && options.acceptedRoles[0] === "*"){
            options.acceptedRoles = ['admin', 'user'];
        }

        return options;
    }

    /**
     * Validate input data to get the correct data
     * */
    validateInputData(inputData){
        return inputData;
    }

    /**
     * Update data to category
     * */
    update(id, data){
        return new Promise((resolve, reject) => {
            this.databaseModel.findOneAndUpdate({_id: id}, data)
                .then(_ => resolve(this.getDataById({_id: id})))
                .catch(err => reject(err));
        });
    }


    /**
     * Delete data from category
     * */
    delete(id){
        return this.databaseModel.deleteOne({_id: id});
    }


    /**
     * Add new data to category
     * */
    add(data){
        const instance = new this.databaseModel(data);

        return new Promise((resolve, reject) => {
            instance.save()
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }


    /**
     * Get specific data based on id
     * @return {Promise}
     * */
    getDataById(id){
        return new Promise((resolve, reject) => {
            this.databaseModel.findById(id)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }


    /**
     * Get all data from category
     * @return {Promise}
     * */
    getAllData(){
        return new Promise((resolve, reject) => {
            this.databaseModel.find()
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}

module.exports = Category;