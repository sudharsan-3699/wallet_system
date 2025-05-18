const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');


exports.deposit = async (req, res) => {
  const { amount, currency = 'USD' } = req.body;
  if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

  let wallet = await Wallet.findOne({ userId: req.user._id, currency });
  if (!wallet) wallet = await Wallet.create({ userId: req.user._id, currency });

  wallet.balance += amount;
  await wallet.save();

  await Transaction.create({
    to: req.user._id,
    amount,
    type: 'deposit',
    currency,
    isFlagged: req.isFlagged || false
  });

  res.json({ balance: wallet.balance });
};


exports.withdraw = async (req, res) => {
  const { amount, currency = 'USD' } = req.body;
  let wallet = await Wallet.findOne({ userId: req.user._id, currency });
  if (!wallet || wallet.balance < amount)
    return res.status(400).json({ message: 'Insufficient funds' });

  wallet.balance -= amount;
  await wallet.save();

  await Transaction.create({
    from: req.user._id,
    amount,
    type: 'withdraw',
    currency,
    isFlagged: req.isFlagged || false
  });

  res.json({ balance: wallet.balance });
};


exports.transfer = async (req, res) => {
  const { toUserId, amount, currency = 'USD' } = req.body;
  if (!toUserId || amount <= 0) return res.status(400).json({ message: 'Invalid input' });

  try {
    const fromWallet = await Wallet.findOne({ userId: req.user._id, currency });
    const toWallet = await Wallet.findOne({ userId: toUserId, currency });

    if (!fromWallet || fromWallet.balance < amount)
      throw new Error('Insufficient funds');
    if (!toWallet)
      throw new Error('Recipient wallet not found');

    fromWallet.balance -= amount;
    toWallet.balance += amount;
    await fromWallet.save();
    await toWallet.save();

    await Transaction.create({
      from: req.user._id,
      to: toUserId,
      amount,
      type: 'transfer',
      currency,
      isFlagged: req.isFlagged || false
    });

    res.json({ message: 'Transfer successful' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.history = async (req, res) => {
  const txs = await Transaction.find({
    $or: [{ from: req.user._id }, { to: req.user._id }],
    isDeleted: false
  }).sort({ createdAt: -1 });
  res.json(txs);
};
