const mongoose = require('mongoose');

const priceGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    details: [{
        API: String,
        flightCarrier: String,
        percentage: {
            type: Number,
            min: 0,
            max: 100,
        },
        fixedPrice: Number,
    }],
    description: String,
});

const PriceGroup = mongoose.model('PriceGroup', priceGroupSchema);

module.exports = PriceGroup;
