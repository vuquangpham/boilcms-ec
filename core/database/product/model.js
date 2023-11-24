const mongoose = require('mongoose');
const {modifyDate} = require("../../utils/helper.utils");

const Product = new mongoose.Schema({

    name: {
        type: String
    },
    description: {
        type: String
    },
    categoryImage: {
        type: String
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
    next();
});

module.exports = Product;