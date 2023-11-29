const mongoose = require('mongoose');
const {modifyDate} = require("../../utils/helper.utils");

const Order = new mongoose.Schema({
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