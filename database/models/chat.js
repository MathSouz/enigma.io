const mongoose = require('../')

const ChatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    match: {
        type: mongoose.Types.ObjectId,
        ref: 'match',
        required: true
    },
    text: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 200,
        trim: true
    },
    when: {
        type: Date,
        default: Date.now()
    },
    approved: Boolean
})

module.exports = mongoose.model('chat', ChatSchema)