const {Schema, model} = require("mongoose");

const advertisementSchema = new Schema({
    model: {type: String, required:true},
    title:  String,
    price: String,
    currency:{type: String, required:true},
    exchangeRate:String,
    originalPrice: {type: String, required:true},
    convertedPrice:String,
    region: String,
    viewCount: { type: Number, default: 0 },
    viewCounts: [{
        count: { type: Number, default: 0 },
        type: { type: String, enum: ['daily', 'weekly', 'monthly'] },
        date: { type: Date, default: Date.now }
    }],
    seller: { type: Schema.Types.ObjectId, ref: 'Seller' },
    statistics: {
        averagePriceByModelAndRegion : Number,
        averagePriceByModelInUkraine: Number
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});


module.exports = model('Advertisement', advertisementSchema);
