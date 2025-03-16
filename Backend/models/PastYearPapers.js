const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    year: { type: String, required: false },
    papers: { type: [String], required: false }
});

const PastYearPapersSchema = new mongoose.Schema({
    subjectId: { type: String, required: false },
    subject: { type: String, required: false },
    mid1: { type: [ExamSchema], required: false },
    mid2: { type: [ExamSchema], required: false },
    end: { type: [ExamSchema], required: false }
});

const PastYearPapers = mongoose.model('PastYearPapers', PastYearPapersSchema);

module.exports = PastYearPapers;
