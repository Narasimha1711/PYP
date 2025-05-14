const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    id: { type: String, required: true }, // Subject Name (e.g., "Data Structures")
    grade: { type: String, enum: ["O", "A", "B+", "B", "C", "D", "F"], required: true },
    credits: { type: Number, required: true } // Credit Hours for the subject
});

const SemesterSchema = new mongoose.Schema({
    semesterNumber: { type: Number, required: true, min: 1, max: 8 }, // 1 to 8 semesters
    subjects: { type: [SubjectSchema], required: true } // List of subjects in this semester
});

const UserSchema = new mongoose.Schema({
    rollNo: { type: String, required: true },
    name: { type: String, required: true },
    gmail: { type: String, required: false },
    password: { type: String, required: false},
    otp: { type: String, required: false },
    isActive: { type: Boolean, required: false },
    mobileNumber: { type: Number, required: false },
    languages: {
        type: [String],
        enum: ["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam"],
        required: false
    },
    skills: {
        type: [String],
        enum: ["Web Development", "Machine Learning", "Cyber Security", "DSA","App Development"],
        required: false
    },
    projectsAchievements: { type: [String], required: false },
    interestedSubjects: { type: [String], required: false },
    is_private: { type: Boolean, required: false, default: false },

    semesters: { type: [SemesterSchema], required: false }
    
});




const User = mongoose.model('User', UserSchema);

module.exports = User;
