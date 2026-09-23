const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    user_name: { type: String, required: true },
    account_balance: { type: Number, default: 0 },
    cash_amount: { type: Number, default: 0 },
    // ref must be the *model name* string ('Transaction'), not a made-up name
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
