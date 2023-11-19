const mongoose = require('mongoose')
const {modifyDate} = require("../../utils/helper.utils");

const Product = new mongoose.Schema({
    visibility: {
        type: String
    },
    publish: {
        type: Date,
        default: () => Date.now()
    },
    publishFormatted: String,
    productType: {
        type: String,
        default: 'simple'
    },
    simpleProductContent: {
        type: String,
        default: ''
    },
    variableProductContent: {
        type: String,
        default: ''
    }

})

Product.pre('save', function (next) {
    this.publishFormatted = modifyDate(this.publish)
    next()
})

module.exports = Product