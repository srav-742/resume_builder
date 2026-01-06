const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const authenticate = require('../middleware/auth');

// POST /api/jobs -> Create a new job post
router.post('/', authenticate, async (req, res) => {
    try {
        const { uid } = req.user;
        const recruiter = await User.findOne({ firebaseUid: uid });

        if (!recruiter || recruiter.role !== 'recruiter') {
            return res.status(403).json({ error: 'Only recruiters can post jobs' });
        }

        const jobData = {
            ...req.body,
            recruiter: recruiter._id,
            company: {
                name: recruiter.company?.name || 'Unknown Company',
                logo: recruiter.company?.logo || '',
                description: recruiter.company?.description || ''
            }
        };

        const job = new Job(jobData);
        await job.save();

        res.status(201).json(job);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create job' });
    }
});

// GET /api/jobs -> List all jobs (with optional filters)
router.get('/', async (req, res) => {
    try {
        const { search, type, mode } = req.query;
        let query = { status: 'active' };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { problemToSolve: { $regex: search, $options: 'i' } }
            ];
        }
        if (type) query.employmentType = type;
        if (mode) query.workMode = mode;

        const jobs = await Job.find(query).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

// GET /api/jobs/:id -> Get specific job details
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('recruiter', 'name company');
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch job details' });
    }
});

module.exports = router;
