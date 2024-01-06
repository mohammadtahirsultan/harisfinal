const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: 'pending' }, // pending, approved, rejected
    phone: Number,
    address: String,

});

module.exports = mongoose.model('Agent', agentSchema);
