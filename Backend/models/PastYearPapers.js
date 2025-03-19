const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    year: { type: String, required: false },
    papers: { type: [String], required: false }
});

const PastYearPapersSchema = new mongoose.Schema({
    subjectId: { type: String, required: false },
    subject: { type: String, required: false },
    mid1: { type: [ExamSchema], required: false, default: [] },
    mid2: { type: [ExamSchema], required: false, default: [] },
    end: { type: [ExamSchema], required: false, default: [] },
    gateQuestions: { type: String, required: false } // Added gateQuestions field
});

const PastYearPapers = mongoose.model('PastYearPapers', PastYearPapersSchema);

module.exports = PastYearPapers;
