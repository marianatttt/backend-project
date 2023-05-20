const {Schema, model} = require('mongoose')


const Role = new Schema({
    value: {
        type: String,
        unique: true,
        default: "USER",
        enum: [
            "USER",
            "SELLER",
            "MANAGER",
            "ADMIN"
        ]},
})



module.exports = model('Role', Role)
