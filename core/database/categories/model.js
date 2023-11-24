const mongoose = require('mongoose')
const {stringToSlug} = require("../../utils/helper.utils");

const Categories = new mongoose.Schema({
    type: {
        type: String,
        default: ''
    },
    name: {
        type: String,
    },
    prettyName: {
        type: String,
        default: ''
    }

})

Categories.pre('save', function (next) {
    console.log('prettye', this.prettyName)
    this.name = stringToSlug(this.prettyName)

    next()
})

module.exports = mongoose.model('Categories', Categories)