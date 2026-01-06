const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: {
        name: String,
        logo: String,
        description: String
    },
    role: String,
    skillsRequired: [{
        name: String,
        mandatory: { type: Boolean, default: true }
    }],
    experienceRange: {
        min: Number,
        max: Number,
        label: { type: String, enum: ["Fresher", "0-2", "3-5", "5+"] }
    },
    employmentType: {
        type: String,
        enum: ["Full-time", "Internship", "Freelance", "Contract"],
        default: "Full-time"
    },
    workMode: {
        type: String,
        enum: ["Remote", "Hybrid", "Onsite"],
        default: "Remote"
    },
    location: String,
    salary: {
        min: Number,
        max: Number,
        currency: { type: String, default: "INR" },
        hidden: { type: Boolean, default: false }
    },
    urgency: {
        type: String,
        enum: ["Immediate", "Normal"],
        default: "Normal"
    },
    openings: { type: Number, default: 1 },
    description: String,
    problemToSolve: String, // Q&A based
    status: {
        type: String,
        enum: ["active", "closed", "draft"],
        default: "active"
    },
    applicantsCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
