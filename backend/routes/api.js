const express = require("express")
const router = express.Router()
const Resume = require("../models/Resume")
const { generatePDF } = require("../utils/pdfGenerator")
const { analyzeResume } = require("../utils/resumeAnalyzer")

// Get all resumes (for admin purposes)
router.get("/resumes", async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ updatedAt: -1 })
    res.json(resumes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get a specific resume by ID
router.get("/resume/:id", async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id)
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" })
    }
    res.json(resume)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get the most recent resume (for demo purposes)
router.get("/resume", async (req, res) => {
  try {
    const resume = await Resume.findOne().sort({ updatedAt: -1 })
    res.json(resume || {})
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create or update a resume
router.post("/resume", async (req, res) => {
  try {
    const resumeData = req.body
    let resume

    if (resumeData._id) {
      // Update existing resume
      resume = await Resume.findByIdAndUpdate(resumeData._id, resumeData, { new: true, runValidators: true })
    } else {
      // Create new resume
      resume = new Resume(resumeData)
      await resume.save()
    }

    res.json(resume)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Delete a resume
router.delete("/resume/:id", async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id)
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" })
    }
    res.json({ message: "Resume deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Analyze resume against job description
router.post("/analyze", async (req, res) => {
  try {
    const { resume, jobDescription } = req.body

    if (!resume || !jobDescription) {
      return res.status(400).json({ error: "Resume data and job description are required" })
    }

    const analysis = analyzeResume(resume, jobDescription)
    res.json(analysis)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Generate and download resume PDF
router.post("/download", async (req, res) => {
  try {
    const resumeData = req.body

    // Generate PDF
    const pdfBuffer = await generatePDF(resumeData)

    // Set response headers
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resumeData.personalInfo?.fullName || "resume"}.pdf".replace(/\s+/g, "_").toLowerCase()`,
    )

    // Send PDF
    res.send(pdfBuffer)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
