const mongoose = require('mongoose');

const PageBuilder = new mongoose.Schema({
    content: {
        type: String,
        default: '',
    }
});

module.exports = mongoose.model('PageBuilder', PageBuilder);