const { Schema } = require("mongoose");
//wallet schema for the user's wallets
const Wallet = new Schema({
    //user id who own this wallet
    owner: { type: String, required: true },
    //name of the wallet
    name: { type: String, required: true },
    //balance in USD
    balance: {
        amount: { type: Number, default: 0 },
        currency: { type: String, default: "PKR" }
    },
    //list of transactions associated with this wallet
    transactions: [
        {
            date: Date,
            description: String,
            value: { amount: Number, currency: String },
            type:
            {
                type: String,
                enum: ['debit', 'credit']
            }
        }
    ]
})

module.exports.MyWallet = mongoose.model('Wallet', Wallet)
