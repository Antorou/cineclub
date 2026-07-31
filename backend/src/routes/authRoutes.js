const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Expose POST /api/auth/login endpoint
router.post('/login', authController.loginUser);

module.exports = router;
