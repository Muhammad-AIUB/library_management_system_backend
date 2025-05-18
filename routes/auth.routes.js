const express = require('express');
const router = express.Router();
const { register, login, getUserProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getUserProfile);

module.exports = router; 