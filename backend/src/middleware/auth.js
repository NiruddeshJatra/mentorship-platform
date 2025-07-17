const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const { prisma } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'TOKEN_MISSING' 
      });
    }

    const decoded = verifyToken(token);
    
    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { 
        id: true, 
        email: true, 
        role: true,
        name: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid token',
        code: 'TOKEN_INVALID' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED' 
      });
    }
    
    return res.status(401).json({ 
      error: 'Invalid token',
      code: 'TOKEN_INVALID' 
    });
  }
};

const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: requiredRole,
        current: req.user.role
      });
    }
    next();
  };
};

const requireAnyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        allowed: allowedRoles,
        current: req.user.role
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requireAnyRole
};