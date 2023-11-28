const mongoose = require('mongoose');

const Variation = new mongoose.Schema({
    productId: {
        type: String
    },
    productType: {
        type: String
    },
    variationIndex: {
        type: Number
    },
    quantity: {
        type: Number
    },
});

Variation.pre('save', function(next){
    next();
});

module.exports = mongoose.model('Variation', Variation);