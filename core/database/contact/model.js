const mongoose = require('mongoose')

const Contact = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    reply: {
        type: String
    }

})

module.exports = Contact