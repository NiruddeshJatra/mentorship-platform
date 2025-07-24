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
      const frontendBase = getFrontendUrl();
      return res.redirect(`${frontendBase}/login?error=user_not_found`);
    }

    // Generate JWT token for the user
    const token = generateToken({ 
      userId: user.id, 
      role: user.role 
    });

    // Check if user needs onboarding
    const roleData = user.role === 'MENTOR' ? user.mentor : user.mentee;
    const needsOnboarding = !user.role || !roleData?.currentRole || !roleData?.workplace;
    
    const frontendBase = getFrontendUrl();
    
    // Set secure HTTP-only cookie with token
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? new URL(frontendBase).hostname : 'localhost'
    });

    console.log('=== OAuth Success ===');
    console.log(`User ID: ${user.id}`);
    console.log(`Needs Onboarding: ${needsOnboarding}`);
    console.log(`Frontend Base: ${frontendBase}`);
    
    if (needsOnboarding) {
      // Ensure we don't have double slashes in the URL
      const base = frontendBase.endsWith('/') ? frontendBase.slice(0, -1) : frontendBase;
      
      // Generate JWT token with just the essential user data
      // The generateToken function will handle the issuer and audience
      const token = generateToken({ 
        userId: user.id,
        role: user.role
      });
      
      // Include token in the redirect URL
      const onboardingUrl = new URL(`${base}/onboarding`);
      onboardingUrl.searchParams.append('token', token);
      
      console.log('=== Redirecting to Onboarding ===');
      console.log(`Base URL: ${base}`);
      console.log(`Full Onboarding URL: ${onboardingUrl.toString()}`);
      console.log('Response Headers:', JSON.stringify(res.getHeaders(), null, 2));
      
      return res.redirect(302, onboardingUrl.toString());
    } else {
      const dashboardPath = user.role?.toUpperCase() === 'MENTOR' ? '/mentor/dashboard' : '/dashboard';
      // Ensure we don't have double slashes in the URL
      const base = frontendBase.endsWith('/') ? frontendBase.slice(0, -1) : frontendBase;
      const dashboardUrl = `${base}${dashboardPath}`;
      console.log(`Redirecting to dashboard: ${dashboardUrl}`);
      return res.redirect(302, dashboardUrl);
    }
  } catch (error) {
    console.error('Error in OAuth success handler:', error);
    const frontendBase = getFrontendUrl();
    return res.redirect(`${frontendBase}/login?error=oauth_error`);
  }
};

// Helper function to clean URLs by removing trailing slashes
const cleanUrl = (url) => url.endsWith('/') ? url.slice(0, -1) : url;

// Helper function to get frontend URL with consistent formatting
const getFrontendUrl = () => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
  return cleanUrl(frontendUrl);
};

router.get('/google/callback',
  async (req, res, next) => {
    try {
      console.log('=== OAuth Callback Started ===');
      console.log('Request URL:', req.originalUrl);
      console.log('Request Headers:', JSON.stringify(req.headers, null, 2));
      
      // Set CORS headers for the OAuth callback
      const frontendBase = getFrontendUrl();
      console.log('Frontend Base URL:', frontendBase);
      
      res.setHeader('Access-Control-Allow-Origin', frontendBase);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      
      // Call the authentication middleware
      console.log('Starting Passport authentication...');
      passport.authenticate('google', { 
        failureRedirect: `${frontendBase}/login?error=authentication_failed`,
        session: false 
      })(req, res, next);
    } catch (error) {
      console.error('OAuth callback error:', error);
      const frontendBase = getFrontendUrl();
      const errorUrl = `${frontendBase}/login?error=oauth_error`;
      console.log(`Redirecting to error page: ${errorUrl}`);
      return res.redirect(errorUrl);
    }
  },
  handleOAuthSuccess
);

module.exports = router;
