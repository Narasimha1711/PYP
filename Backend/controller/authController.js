require('dotenv').config();
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { rollNo, name, gmail, password, mobileNumber, languages, skills, projectsAchievements, interestedSubjects, is_private } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ rollNo });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create new user
        const newUser = new User({
            rollNo,
            name,
            gmail,
            password: hashedPassword,
            mobileNumber,
            languages,
            skills,
            projectsAchievements,
            interestedSubjects,
            is_private
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id, rollNo: newUser.rollNo }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error signing up', error });
    }
};

const signin = async (req, res) => {
    const { rollNo, password } = req.body;

    try {
        const existingUser = await User.findOne({ rollNo });
        if (!existingUser) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: existingUser._id, rollNo: existingUser.rollNo }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 3600000,
        });

        res.status(200).json({ message: 'User signed in successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error signing in', error });
    }
};

const logout = async (req, res) => {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'Strict',
      });
      res.status(200).json({ message: 'User signed out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error signing out', error });
    }
  };

module.exports = { signup, signin, logout };