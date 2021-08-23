const mongoose = require('../')

const MatchSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        select: false
    },
    host: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    chat: [{
        type: mongoose.Types.ObjectId,
        ref: 'chat'
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    text: {
        type: String,
        required: true
    },
    players: [{
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }]
})

module.exports = mongoose.model('match', MatchSchema)