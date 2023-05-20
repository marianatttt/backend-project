const {Schema, model} = require('mongoose')


const User = new Schema({
    username: {
        type: String,
        trim: true,
        unique: false
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
        trim: true,},
    roles: [{
        type: String,
        ref: 'Role'
    }]
})

module.exports = model('User', User)