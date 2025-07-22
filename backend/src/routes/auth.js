const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
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

// Helper function to handle successful OAuth authentication
const handleOAuthSuccess = async (req, res) => {
  try {
    // Get complete user data with relationships
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        mentor: true,
        mentee: true
      }
    });

    if (!user) {
      console.error('OAuth error: User not found after authentication');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/login?error=user_not_found`);
    }

    // Generate JWT token for the user
    const token = generateToken({ 
      userId: user.id, 
      role: user.role 
    });

    // Check if user needs onboarding
    const roleData = user.role === 'MENTOR' ? user.mentor : user.mentee;
    const needsOnboarding = !user.role || !roleData?.currentRole || !roleData?.workplace;
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    
    // Set secure HTTP-only cookie with token
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? new URL(frontendUrl).hostname : 'localhost'
    });

    console.log(`OAuth success for user ${user.id}, needs onboarding: ${needsOnboarding}`);
    
    if (needsOnboarding) {
      const onboardingUrl = `${frontendUrl}/onboarding`;
      console.log(`Redirecting to onboarding: ${onboardingUrl}`);
      return res.redirect(onboardingUrl);
    } else {
      const dashboardPath = user.role?.toUpperCase() === 'MENTOR' ? '/mentor/dashboard' : '/dashboard';
      const dashboardUrl = `${frontendUrl}${dashboardPath}`;
      console.log(`Redirecting to dashboard: ${dashboardUrl}`);
      return res.redirect(dashboardUrl);
    }
  } catch (error) {
    console.error('Error in OAuth success handler:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    return res.redirect(`${frontendUrl}/login?error=oauth_error`);
  }
};

router.get('/google/callback',
  async (req, res, next) => {
    try {
      // Set CORS headers for the OAuth callback
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
      res.setHeader('Access-Control-Allow-Origin', frontendUrl);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      
      // Call the authentication middleware
      passport.authenticate('google', { 
        failureRedirect: `${frontendUrl}/login?error=authentication_failed`,
        session: false 
      })(req, res, next);
    } catch (error) {
      console.error('OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
      const errorUrl = `${frontendUrl}/login?error=oauth_error`;
      console.log(`Redirecting to error page: ${errorUrl}`);
      return res.redirect(errorUrl);
    }
  },
  handleOAuthSuccess
);

module.exports = router;
