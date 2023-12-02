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

    fullName: {
        type: String,
    },
    phoneNumber: {
        type: String
    },

    provinceId: String,
    districtId: String,
    wardCode: String,

    address: String,
    description: String,
    shippingFee: Number,

    paymentMethod: String,
    couponCode: String,

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