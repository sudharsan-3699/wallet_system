const express = require('express');
const adminCtrl = require('../controllers/adminController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/flagged', auth, adminCtrl.flaggedTransactions);
router.get('/total-balances', auth, adminCtrl.totalBalances);
router.get('/top-users', auth, adminCtrl.topUsers);

module.exports = router;
