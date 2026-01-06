const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    seeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ["Applied", "Viewed", "Shortlisted", "Interview", "Selected", "Rejected"],
        default: "Applied"
    },
    matchScore: { type: Number, default: 0 },
    matchExplanation: String,
    resumeUrl: String,
    coverLetter: String,
    answersToPreInterviewQuestions: [{
        question: String,
        answer: String
    }],
    notes: String, // Recruiter private notes
    interviewDate: Date,
    interviewLink: String,
    feedback: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);
