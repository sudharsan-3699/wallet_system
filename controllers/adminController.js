const Transaction = require('../models/transaction');
const Wallet = require('../models/wallet');

exports.flaggedTransactions = async (req, res) => {
  const flagged = await Transaction.find({ isFlagged: true });
  res.json(flagged);
};

exports.totalBalances = async (req, res) => {
  const balances = await Wallet.aggregate([
    { $group: { _id: null, total: { $sum: '$balance' } } }
  ]);
  res.json({ totalBalance: balances[0]?.total || 0 });
};

exports.topUsers = async (req, res) => {
  const top = await Wallet.find({}).sort({ balance: -1 }).limit(10).populate('userId', 'name email');
  res.json(top);
};
