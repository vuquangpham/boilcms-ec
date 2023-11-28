const mongoose = require('mongoose');

const Contact = new mongoose.Schema({
    title: {
        type: String,
    },
    email: {
        type: String,
    },
    content: {
        type: String,
    }
})

module.exports = Contact