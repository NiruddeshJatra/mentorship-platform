const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, updateProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { registerSchema, loginSchema, updateProfileSchema } = require('../utils/validation');

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, validateRequest(updateProfileSchema), updateProfile);

module.exports = router;
