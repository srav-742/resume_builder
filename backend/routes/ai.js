const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Resume = require('../models/Resume');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.uid; // From authenticate middleware

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing in .env");
            return res.status(500).json({ error: "AI service configuration error. Please check server logs." });
        }

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // 1. Fetch user's resume data
        const resume = await Resume.findOne({ firebaseUid: userId });

        let resumeContext = "The user has not created a resume yet.";
        if (resume) {
            // Clean up resume data for the prompt (remove IDs, empty fields if needed)
            const cleanResume = {
                fullName: resume.personalInfo?.fullName,
                skills: resume.skills,
                experience: resume.workExperience?.map(exp => ({
                    role: exp.jobTitle,
                    company: exp.company,
                    desc: exp.description
                })),
                projects: resume.projects?.map(proj => ({
                    title: proj.title,
                    tech: proj.technologies,
                    desc: proj.description
                })),
                education: resume.education?.map(edu => ({
                    degree: edu.degree,
                    field: edu.fieldOfStudy
                }))
            };
            resumeContext = JSON.stringify(cleanResume);
        }

        // 2. Construct the prompt
        // We act as a Career Counsellor with access to their data.
        const prompt = `
        You are an expert AI Career Counsellor. 
        Your goal is to help the user with their career, specifically focusing on their resume, skill gaps, and interview prep.
        
        CONTEXT - USER RESUME DATA:
        ${resumeContext}
        
        INSTRUCTIONS:
        1. Analyze the user's data provided above.
        2. If the user asks for a specific analysis (like "check my resume"), look for gaps in their skills or experience compared to typical industry standards for their role.
        3. If the user asks for a "skill quiz", ask them a technical question based on their listed skills.
        4. If the user asks for a "mock interview", ask a behavioral or technical interview question relevant to their experience.
        5. Be encouraging, professional, and concise.
        
        USER MESSAGE: "${message}"
        
        RESPONSE:
        `;

        // 3. Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            response: text,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('AI Chat Error Full Object:', JSON.stringify(error, null, 2));

        // Handle specific API errors
        if (error.status === 404) {
            console.error("Gemini API 404 Error - Model not found or API not enabled. Details:", error);
            return res.status(500).json({
                error: "AI Model not found. Check if the API Key has access to 'gemini-1.5-flash' or if the API is enabled in Google Cloud Console."
            });
        }

        if (error.status === 400) {
            return res.status(500).json({
                error: "Invalid AI Request. Please check input or API Key permissions."
            });
        }

        res.status(500).json({ error: "Failed to generate response. Please try again later." });
    }
});

module.exports = router;
