const mongoose = require('mongoose');

const Media = new mongoose.Schema({
    // clarify each images and filtering
    name: {
        type: String,
        default: ''
    },
    // video, mp4, pdf,..
    type: {
        type: String,
        required: true
    },
    uploadTime: {
        type: Date,
        required: true,
        default: () => new Date()
    },
    directory:{
        type:String,
    },
    url:{
        type: Object,
    }
});

module.exports = Media;