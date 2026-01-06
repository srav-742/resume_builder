const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// POST /api/applications -> Apply for a job
router.post('/', async (req, res) => {
    try {
        const { uid } = req.user;
        const { jobId, answers } = req.body;

        const seeker = await User.findOne({ firebaseUid: uid });
        const job = await Job.findById(jobId);

        if (!seeker || !job) {
            return res.status(404).json({ error: 'User or Job not found' });
        }

        const application = new Application({
            job: jobId,
            seeker: seeker._id,
            answersToPreInterviewQuestions: answers
        });

        await application.save();

        // Update job applicant count
        job.applicantsCount += 1;
        await job.save();

        res.status(201).json(application);
    } catch (err) {
        res.status(500).json({ error: 'Application failed' });
    }
});

// GET /api/applications/my -> Get all applications for a seeker
router.get('/my', async (req, res) => {
    try {
        const { uid } = req.user;
        const seeker = await User.findOne({ firebaseUid: uid });
        const applications = await Application.find({ seeker: seeker._id }).populate('job');
        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

module.exports = router;
