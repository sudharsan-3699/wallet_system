const Transaction = require('../models/transaction');

module.exports = async (req, res, next) => {
  req.isFlagged = false;
  const { amount = 0, type = '' } = req.body || {};
  const userId = req.user && req.user._id;

  if (!userId || !type) return next();

    // Fraud detection for multiple transfers in a short time
  if (type === 'transfer') {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentTransfers = await Transaction.countDocuments({
      from: userId,
      type: 'transfer',
      createdAt: { $gte: oneMinuteAgo }
    });
    // Check if the user has made 3 or more transfers in the last minute
    if (recentTransfers >= 3) {
      req.isFlagged = true;
      console.log(
        `Fraud flag: User ${userId} made ${recentTransfers + 1} transfers in 1 minute.`
      );
    }
  }
    // Fraud detection for large deposits
  if (type === 'withdraw' && amount > 10000) {
    req.isFlagged = true;
    console.log(
      `Fraud flag: User ${userId} attempted large withdrawal: ${amount}`
    );
  }

  next();
};
