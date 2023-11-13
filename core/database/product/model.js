const mongoose = require('mongoose')
const {modifyDate} = require("../../utils/helper.utils");

const Product = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    media: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'media'
    },
    status: {
        type: String
    },
    visibility: {
        type: String
    },
    publish: {
        type: Date,
        default: () => Date.now()
    },
    publishFormatted: String,
    price: {
        type: Number
    },
    salePrice: {
        type: Number
    },
    inventory: {
        type: Number
    },
    attributes: {}
})

Product.pre('save', function (next) {
    this.publishFormatted = modifyDate(this.publish)
    next()
})

module.exports = Product