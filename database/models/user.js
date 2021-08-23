require('dotenv').config()
const mongoose = require('../')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        maxLength: [25, 'Nome longo. (Max.: 25)']
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
})

UserSchema.path('email').validate((email) => {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
   return emailRegex.test(email);
}, 'Email inválido.')

UserSchema.path('username').validate((username) => {
   return !username.includes(' ')
}, 'Nome inválido.')

UserSchema.pre('save', function(next)
{
    this.password = bcrypt.hashSync(this.password, parseInt(process.env.ROUNDS))
    next()
})

module.exports = mongoose.model('user', UserSchema)