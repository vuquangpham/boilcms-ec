const mongoose = require('mongoose');
const {modifyDate} = require("../../utils/helper.utils");

const Order = new mongoose.Schema({
    // user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    // variations
    variations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Variation'
    }],

    // date time
    publish: {
        type: Date,
        default: () => Date.now()
    },
    publishFormatted: String,
});

Order.pre('save', function(next){
    this.publishFormatted = modifyDate(this.publish);
    next();
});

module.exports = Order;