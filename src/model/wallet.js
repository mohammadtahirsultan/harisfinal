const mongoose = require("mongoose");

//wallet schema for the user's wallets
const Wallet = new mongoose.Schema({
    title: String,
    amount: Number,
    date: { type: Date, default: Date.now },
})

module.exports.MyWallet = mongoose.model('Wallet', Wallet)
