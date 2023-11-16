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
    price: {
        type: Number
    },
    salePrice: {
        type: Number
    },
    inventory: {
        type: Number
    },
    attributes: [{
        name: String,
        value: [String]
    }
    ],
    variations: [{
        price: Number,
        salePrice: Number,
        description: String,
        qty: Number,
        attribute: [{
            name: String,
            value: String
        }]
    }]
})

Product.pre('save', function (next) {
    this.publishFormatted = modifyDate(this.publish)
    next()
})

module.exports = Product