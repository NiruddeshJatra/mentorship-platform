const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, updateProfile, onboarding, logout } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { registerSchema, loginSchema, updateProfileSchema } = require('../utils/validation');
const passport = require('../services/passport');
const { generateToken } = require('../utils/jwt');

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, validateRequest(updateProfileSchema), updateProfile);
router.post('/onboarding', authenticateToken, onboarding);
router.post('/logout', authenticateToken, logout);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Successful authentication, user object is attached to req
    const user = req.user;
    // Generate JWT token for the user
    const token = generateToken({ userId: user.id, role: user.role });
    // Redirect back to frontend with token
    res.redirect(`http://localhost:8080/oauth/callback?token=${token}`);
  }
);

module.exports = router;
