const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, updateProfile, logout } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { registerSchema, loginSchema, updateProfileSchema } = require('../utils/validation');
const passport = require('../services/passport');

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, validateRequest(updateProfileSchema), updateProfile);
router.post('/logout', authenticateToken, logout);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.json({ user: req.user });
  }
);

module.exports = router;
