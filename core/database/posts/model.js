const mongoose = require('mongoose');
const {modifyDate} = require("../../utils/helper.utils")


const Post = new mongoose.Schema({
    title: {
        type: String,
        default: '',
        required: true
    },
    url: {
        type: String,
        default: ''
    },
    visibility: {
        type: String
    },
    publish: {
        type: Date,
        default: () => Date.now()
    },
    publishFormatted: {
        type: String
    },
    template: {
        type: String
    },
    categories: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    },

    content: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PageBuilder'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        // because of the databaseModel in categories/user.js, User.type = 'user
        ref: 'user'
    },
    authorName: {
        type: String,
    }
});

Post.pre('save', function (next){
    this.publishFormatted = modifyDate(this.publish)
    next()
})

module.exports = Post;