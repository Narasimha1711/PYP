const bcrypt = require('bcrypt');
const User = require('../models/User');

const signup = async (req, res) => {
    try {
        const { rollNo, name, gmail, password, mobileNumber, languages, skills, projectsAchievements, interestedSubjects, is_private } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ gmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

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
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error signing up', error });
    }
};

module.exports = { signup };
