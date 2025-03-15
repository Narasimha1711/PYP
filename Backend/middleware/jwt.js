//jwt middleware
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

const jwtMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies
    if (!token) {
        return res.status(401).json({ message: 'Authorization Denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
};


module.exports = jwtMiddleware;
