const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    rollNo: { type: String, required: true },
    name: { type: String, required: true },
    gmail: { type: String, required: false },
    password: { type: String, required: false },
    otp: { type: String, required: false },
    isActive: { type: Boolean, required: false },
    mobileNumber: { type: Number, required: true },
    languages: {
        type: [String],
        enum: ["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam"],
        required: false
    },
    skills: {
        type: [String],
        enum: ["Web Development", "Machine Learning", "Cyber Security", "DSA"],
        required: false
    },
    projectsAchievements: { type: [String], required: false },
    interestedSubjects: { type: [String], required: false },
    is_private: { type: Boolean, required: false, default: false },
    
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
