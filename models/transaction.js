const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  type: { type: String, enum: ['deposit', 'withdraw', 'transfer'] },
  currency: String,
  status: { type: String, enum: ['successful', 'pending', 'failed'], default: 'successful' },
  isFlagged: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
