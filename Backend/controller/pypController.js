const jwt = require('jsonwebtoken');
const Pyp = require('../models/PastYearPapers');
const User = require('../models/User');

const sendInfo = async (req, res) => {
    try {
        // Extract token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Decode JWT to get roll number
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const rollNo = decoded.rollNo;

        // Fetch all subjects from PastYearPapers
        const pastYearPapers = await Pyp.find({});
        const subjects = pastYearPapers.map(paper => paper.subject).filter(Boolean);

        // Fetch user details using roll number
        const user = await User.findOne({ rollNo });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract interested subjects
        const interestedSubjects = user.interestedSubjects || [];

        // Send response
        res.status(200).json({ subjects, interestedSubjects });
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error });
    }
};

// Function to add a starred (favorite) subject
const addStarredSubject = async (req, res) => {
    try {
        // Extract subject name from request body
        const { subject } = req.body;
        if (!subject) {
            return res.status(400).json({ message: "Subject is required" });
        }

        // Extract token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Decode JWT to get roll number
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const rollNo = decoded.rollNo;

        // Find the user
        const user = await User.findOne({ rollNo });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the subject is already in interestedSubjects
        if (user.interestedSubjects.includes(subject)) {
            return res.status(200).json({ message: "Subject is already in favorite subjects" });
        }

        // Add subject to interestedSubjects and update the user
        user.interestedSubjects.push(subject);
        await user.save();

        // Send success response
        res.status(200).json({ message: "Subject added to favorites", interestedSubjects: user.interestedSubjects });
    } catch (error) {
        res.status(500).json({ message: "Error adding subject", error });
    }
};

// Function to delete a starred (favorite) subject
const deleteStarredSubject = async (req, res) => {
    try {
        // Extract subject name from request body
        const { subject } = req.body;
        if (!subject) {
            return res.status(400).json({ message: "Subject is required" });
        }

        // Extract token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Decode JWT to get roll number
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const rollNo = decoded.rollNo;

        // Find the user
        const user = await User.findOne({ rollNo });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the subject exists in interestedSubjects
        if (!user.interestedSubjects.includes(subject)) {
            return res.status(400).json({ message: "Subject not in favorite subjects" });
        }

        // Remove subject from interestedSubjects and update the user
        user.interestedSubjects = user.interestedSubjects.filter(item => item !== subject);
        await user.save();

        // Send success response
        res.status(200).json({ message: "Subject removed from favorites", interestedSubjects: user.interestedSubjects });
    } catch (error) {
        res.status(500).json({ message: "Error removing subject", error });
    }
};

module.exports = { sendInfo, addStarredSubject, deleteStarredSubject };
