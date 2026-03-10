const jwt = require('jsonwebtoken');
const config = require('../config/env');
const logger = require('../utils/logger');

/**
 * Middleware to verify JWT and attach user to request
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Authentication token required' });
    }

    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) {
            logger.warn(`Invalid token attempt: ${err.message}`);
            return res.status(403).json({ status: 'error', message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

/**
 * Middleware to restrict access based on user role
 * @param {string[]} roles - Allowed roles
 */
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied: insufficient permissions'
            });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRoles };
