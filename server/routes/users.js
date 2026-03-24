const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);
router.get('/profile', getUserProfile);

module.exports = router;
