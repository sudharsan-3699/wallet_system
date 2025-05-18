
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const fraudDetection = require('../middleware/fraudDetection');
const walletCtrl = require('../controllers/walletController');

router.post('/deposit', auth, fraudDetection, walletCtrl.deposit);

router.post('/withdraw', auth, fraudDetection, walletCtrl.withdraw);

router.post('/transfer', auth, fraudDetection, walletCtrl.transfer);

router.get('/history', auth, walletCtrl.history);

module.exports = router;
