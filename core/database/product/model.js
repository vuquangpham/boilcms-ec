const mongoose = require('mongoose');
const {modifyDate, stringToSlug} = require("../../utils/helper.utils");

const Product = new mongoose.Schema({

    name: {
        type: String
    },
    description: {
        type: String
    },
    url: {
        type: String,
        default: ''
    },

    categoryImage: {
        type: String
    },
    categories: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    },

    // visibility
    visibility: {
        type: String
    },

    // date time
    publish: {
        type: Date,
        default: () => Date.now()
    },
    publishFormatted: String,

    // product types
    type: {
        type: String,
        default: 'simple'
    },

    // JSON
    simpleProductJSON: {
        type: String,
        default: ''
    },
    variableProductJSON: {
        type: String,
        default: ''
    }

});

Product.pre('save', function(next){
    this.publishFormatted = modifyDate(this.publish);
    this.url = stringToSlug(this.name);
    next();
});

module.exports = Product;