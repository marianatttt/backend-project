const {Schema, model} = require('mongoose')


const Car = new Schema({
    brand: {type: String},
    model: {
        type: String,
        required: true,
        unique: true
    }

})



module.exports = model('Car', Car)
