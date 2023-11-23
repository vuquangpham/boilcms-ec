const mongoose = require('mongoose')
const {stringToSlug} = require("../../utils/helper.utils");

const Categories = new mongoose.Schema({
    type: {
        type: String,
    },
    name: {
        type: String,
        default: ''
    },
    prettyName: {
        type: String,
    }

})

Categories.pre('save', function (next) {
    this.name = stringToSlug(this.prettyName)

    next()
})

module.exports = mongoose.model('Categories', Categories)