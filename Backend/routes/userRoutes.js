const express = require('express');
const { getProfile, updateIncome, changePassword } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', auth, getProfile);
router.put('/income', auth, updateIncome);
router.put('/password', auth, changePassword);

module.exports = router;
