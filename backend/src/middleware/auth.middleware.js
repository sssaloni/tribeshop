const jwt = require('jsonwebtoken');
const config = require('../config/env');

const protectAdmin = (req, res, next) => {
  let token;

  // Check for Token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET);

      // Attach admin user info to request
      req.admin = {
        id: decoded.id,
        username: decoded.username
      };

      next();
    } catch (error) {
      console.error('JWT Authorization error:', error.message);
      res.status(401).json({
        success: false,
        message: 'Not authorized: token verification failed'
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized: no token provided'
    });
  }
};

module.exports = { protectAdmin };
