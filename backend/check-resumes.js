// Debug script to check resumes in database
require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        checkResumes();
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

async function checkResumes() {
    try {
        // Import Resume model
        const Resume = require('./models/Resume');

        // Get all resumes
        const allResumes = await Resume.find({});

        console.log(`\n📊 Total resumes in database: ${allResumes.length}\n`);

        if (allResumes.length === 0) {
            console.log('❌ No resumes found in database!');
            console.log('Create some resumes first at: http://localhost:3000/builder\n');
        } else {
            // Group by user
            const byUser = {};
            allResumes.forEach(resume => {
                const uid = resume.firebaseUid || 'unknown';
                if (!byUser[uid]) {
                    byUser[uid] = [];
                }
                byUser[uid].push(resume);
            });

            console.log('Resumes by User:\n');
            Object.keys(byUser).forEach(uid => {
                console.log(`User ID: ${uid}`);
                console.log(`  Resumes: ${byUser[uid].length}`);
                byUser[uid].forEach((r, i) => {
                    console.log(`  ${i + 1}. ${r.personalInfo?.fullName || 'Untitled'} (${r.template})`);
                });
                console.log('');
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
