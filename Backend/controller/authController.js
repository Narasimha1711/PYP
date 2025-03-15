const bcryptjs = require('bcryptjs');
const User = require('../models/User');

const signup = async (req, res) => {
    try {
        const { rollNo, name, gmail, password, mobileNumber, languages, skills, projectsAchievements, interestedSubjects, is_private } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ gmail, rollNo });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10); // Generate salt
        const hashedPassword = await bcryptjs.hash(password, salt);

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
        console.log(error);
        res.status(500).json({ message: 'Error signing up', error });
    }
};


const signin = async(req, res) => {

    const { rollNo, password } = req.body;

    try {
        const existingUser = await User.findOne({
            rollNo
        }); 
        if (!existingUser) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        res.status(200).json({ message: 'User signed in successfully' });

    }
    catch (error) {
        res.status(500).json({ message: 'Error signing in', error });
    }


}

module.exports = { signup, signin };
