import { NextResponse } from "next/server"
import type { ResumeData } from "@/context/resume-context"

interface AnalyzeRequest {
  resume: ResumeData
  jobDescription: string
}

export async function POST(request: Request) {
  try {
    const { resume, jobDescription } = (await request.json()) as AnalyzeRequest

    if (!resume || !jobDescription) {
      return NextResponse.json({ error: "Resume data and job description are required" }, { status: 400 })
    }

    // Extract all text from resume
    const resumeText = extractResumeText(resume)

    // Extract keywords from job description
    const jobKeywords = extractKeywords(jobDescription)

    // Find matching and missing keywords
    const matchedKeywords: string[] = []
    const missingKeywords: string[] = []

    jobKeywords.forEach((keyword) => {
      if (resumeText.toLowerCase().includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword)
      } else {
        missingKeywords.push(keyword)
      }
    })

    // Calculate score based on keyword matches
    const score = Math.min(Math.round((matchedKeywords.length / (jobKeywords.length || 1)) * 100), 100)

    // Generate recommendations
    const recommendations = generateRecommendations(resume, matchedKeywords, missingKeywords)

    return NextResponse.json({
      score,
      matchedKeywords,
      missingKeywords,
      recommendations,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 })
  }
}

// Helper function to extract text from resume
function extractResumeText(resume: ResumeData): string {
  const parts: string[] = []

  // Personal info
  if (resume.personalInfo) {
    parts.push(resume.personalInfo.fullName || "")
    parts.push(resume.personalInfo.email || "")
    parts.push(resume.personalInfo.summary || "")
  }

  // Skills
  if (resume.skills && resume.skills.length) {
    parts.push(resume.skills.join(" "))
  }

  // Education
  if (resume.education && resume.education.length) {
    resume.education.forEach((edu) => {
      parts.push(edu.institution || "")
      parts.push(edu.degree || "")
      parts.push(edu.fieldOfStudy || "")
      parts.push(edu.description || "")
    })
  }

  // Work experience
  if (resume.workExperience && resume.workExperience.length) {
    resume.workExperience.forEach((job) => {
      parts.push(job.jobTitle || "")
      parts.push(job.company || "")
      parts.push(job.description || "")
      if (job.achievements && job.achievements.length) {
        job.achievements.forEach((achievement) => {
          parts.push(achievement.text || "")
        })
      }
    })
  }

  // Projects
  if (resume.projects && resume.projects.length) {
    resume.projects.forEach((project) => {
      parts.push(project.title || "")
      parts.push(project.description || "")
      if (project.technologies && project.technologies.length) {
        parts.push(project.technologies.join(" "))
      }
    })
  }

  return parts.join(" ")
}

// Helper function to extract keywords from job description
function extractKeywords(jobDescription: string): string[] {
  // This is a simplified implementation
  // In a real app, you'd use NLP or a more sophisticated algorithm

  // Common tech keywords
  const techKeywords = [
    "JavaScript",
    "TypeScript",
    "React",
    "Angular",
    "Vue",
    "Node.js",
    "Express",
    "MongoDB",
    "SQL",
    "PostgreSQL",
    "MySQL",
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Git",
    "Python",
    "Java",
    "C#",
    "PHP",
    "Ruby",
    "Go",
    "Swift",
    "Kotlin",
    "Flutter",
    "React Native",
    "HTML",
    "CSS",
    "SASS",
    "LESS",
    "Tailwind",
    "Bootstrap",
    "Material UI",
    "Redux",
    "GraphQL",
    "REST API",
    "Microservices",
    "Agile",
    "Scrum",
    "DevOps",
    "TDD",
    "Unit Testing",
    "Integration Testing",
    "E2E Testing",
  ]

  // Common soft skills
  const softSkills = [
    "Communication",
    "Teamwork",
    "Problem-solving",
    "Leadership",
    "Time management",
    "Adaptability",
    "Creativity",
    "Critical thinking",
    "Collaboration",
    "Project management",
    "Attention to detail",
  ]

  const allKeywords = [...techKeywords, ...softSkills]

  // Find keywords in job description
  return allKeywords.filter((keyword) => jobDescription.toLowerCase().includes(keyword.toLowerCase()))
}

// Helper function to generate recommendations
function generateRecommendations(resume: ResumeData, matchedKeywords: string[], missingKeywords: string[]): string[] {
  const recommendations: string[] = []

  // Recommend adding missing keywords
  if (missingKeywords.length > 0) {
    missingKeywords.forEach((keyword) => {
      recommendations.push(`Add "${keyword}" to your resume if you have experience with it`)
    })
  }

  // Check if summary is too short
  if (!resume.personalInfo?.summary || resume.personalInfo.summary.length < 50) {
    recommendations.push("Expand your professional summary to better highlight your experience and skills")
  }

  // Check if work achievements are quantified
  let hasQuantifiedAchievements = false
  if (resume.workExperience && resume.workExperience.length > 0) {
    for (const job of resume.workExperience) {
      if (job.achievements && job.achievements.length > 0) {
        for (const achievement of job.achievements) {
          if (/\d+%|\d+x|\$\d+|\d+ times/i.test(achievement.text)) {
            hasQuantifiedAchievements = true
            break
          }
        }
      }
      if (hasQuantifiedAchievements) break
    }
  }

  if (!hasQuantifiedAchievements) {
    recommendations.push("Quantify your achievements with specific metrics (e.g., increased sales by 20%)")
  }

  // If we have few recommendations, add some general ones
  if (recommendations.length < 2) {
    recommendations.push("Tailor your resume to match the specific job description")
    recommendations.push("Use action verbs to describe your experience and achievements")
  }

  return recommendations
}
