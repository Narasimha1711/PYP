//jwt middleware
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

const jwtMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Authorization Denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
}

module.exports = jwtMiddleware;
