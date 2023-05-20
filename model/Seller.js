const {Schema, model} = require('mongoose')

const SellerSchema = new Schema({
    advertisementId: {
        type: Schema.Types.ObjectId,
        ref: 'Advertisement' },
    name: {
        type:String,
        required:true},
    accountType: {
        type: String,
        default: 'basic',
        enum: ['basic', 'premium']  }
});


module.exports = model('SellerSchema ', SellerSchema )

