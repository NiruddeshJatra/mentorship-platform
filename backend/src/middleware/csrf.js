import crypto from 'crypto';

// Secret key for signing CSRF tokens
const CSRF_SECRET = process.env.CSRF_SECRET || 'your-csrf-secret-key';

/**
 * Create a new CSRF token
 * @returns {Object} Object containing token and signed token
 */
export const createCSRFToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const signedToken = signToken(token);
  return { token, signedToken };
};

/**
 * Verify a CSRF token
 * @param {string} token - The token to verify
 * @param {string} signedToken - The signed token to verify against
 * @returns {boolean} True if token is valid
 */
export const verifyCSRFToken = (token, signedToken) => {
  if (!token || !signedToken) return false;
  const expectedSignedToken = signToken(token);
  return crypto.timingSafeEqual(
    Buffer.from(signedToken),
    Buffer.from(expectedSignedToken)
  );
};

/**
 * Sign a token with HMAC
 * @private
 */
const signToken = (token) => {
  return crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(token)
    .digest('hex');
};

/**
 * CSRF protection middleware
 */
export const csrfProtection = (req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  const csrfToken = req.headers['x-xsrf-token'] || req.body._csrf;
  
  if (!csrfToken || !verifyCSRFToken(csrfToken, req.cookies['XSRF-TOKEN'])) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }
  
  next();
};
