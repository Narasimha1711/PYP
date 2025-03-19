const jwt = require('jsonwebtoken');
const Pyp = require('../models/PastYearPapers');
const User = require('../models/User');
const PastYearPapers = require('../models/PastYearPapers');

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
        const subjects = pastYearPapers
            .map(paper => ({
                subjectId: paper.subjectId,
                subject: paper.subject,
                gateQuestions: paper.gateQuestions || ""
            }))
            .filter(paper => paper.subjectId);

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
        // Extract subjectId from request body
        const { subjectId } = req.body;
        if (!subjectId) {
            return res.status(400).json({ message: "Subject ID is required" });
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
        // console.log(rollNo);
        const user = await User.findOne({ rollNo });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the subject by ID
        const subjectDoc = await PastYearPapers.findOne({subjectId});
        if (!subjectDoc) {
            return res.status(404).json({ message: "Subject not found" });
        }
    
        const subject = subjectDoc.subjectId;

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

const deleteStarredSubject = async (req, res) => {
    try {
        // Extract subjectId from request body

        const { subjectId } = req.body;
        if (!subjectId) {
            return res.status(400).json({ message: "Subject ID is required" });
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

        // Find the subject by ID
        const subjectDoc = await Pyp.findOne({subjectId});
        if (!subjectDoc) {
            return res.status(404).json({ message: "Subject not found" });
        }
        const subject = subjectDoc.subjectId;

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


const sendPapers = async (req, res) => {
    try {
        // Extract query parameter in the format x/y
        const query = req.params;
        
        const { id: subjectId, type: examType } = query;

        if (!subjectId || !examType) {
            return res.status(400).json({ message: "Invalid query format. Use subjectId/examType." });
        }

        // Find the subject by ID
        const subjectDoc = await Pyp.findOne({subjectId});
        if (!subjectDoc) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // Check if the requested examType exists in the document
        if (!subjectDoc[examType]) {
            return res.status(400).json({ message: "Invalid exam type" });
        }

        // Send response with requested exam type papers
        res.status(200).json({ papers: subjectDoc[examType] });
    } catch (error) {
        res.status(500).json({ message: "Error fetching papers", error });
    }
};




module.exports = { sendInfo, addStarredSubject, deleteStarredSubject, sendPapers };