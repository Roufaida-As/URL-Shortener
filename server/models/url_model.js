const mongoose = require('mongoose')

const urlSchema = mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
    urlCode: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
    },
    date: {
        type: Date,
        default: Date.now
    },

})

module.exports = mongoose.model('URL', urlSchema)