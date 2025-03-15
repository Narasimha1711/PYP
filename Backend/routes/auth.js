const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { rollNo, name, mobileNumber, password } = req.body;

        const existingUser = await User.findOne({ rollNo });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ rollNo, name, mobileNumber, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Signin Route
router.post('/signin', async (req, res) => {
    try {
        const { rollNo, password } = req.body;

        const user = await User.findOne({ rollNo });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ rollNo: user.rollNo, id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(200).json({ message: 'Signin successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
