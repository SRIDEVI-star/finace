const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  time: { type: Date, default: Date.now },
  description: { type: String },
  paymentMethod: { type: String, required: true },
  owner: { type: String, required: true },
  // ref must be the model name string 'User' (the old code passed a Schema/model object)
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Transaction', transactionSchema);
