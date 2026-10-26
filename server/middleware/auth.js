const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mindbloom_super_secure_jwt_secret_change_me_in_production_2025!';

/**
 * Authentication middleware.
 * Verifies JWT token supplied via:
 * 1. Authorization: Bearer <token> header (standard API / cross-origin)
 * 2. HttpOnly Cookie: 'token' (web browser sessions)
 */
const requireAuth = (req, res, next) => {
  let token = null;

  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Check cookie
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in to continue.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.',
    });
  }
};

module.exports = {
  requireAuth,
  JWT_SECRET,
};
