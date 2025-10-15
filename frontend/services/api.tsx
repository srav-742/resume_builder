// frontend/services/api.tsx
import type { ResumeData } from "@/context/resume-context"
import { getAuth } from "firebase/auth"

// ✅ Use backend URL from .env.local
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`

// Get resume data from the server (public - used only for demo)
export async function getResume(): Promise<ResumeData | null> {
  try {
    const response = await fetch(`${API_URL}/resume`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch resume data")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching resume data:", error)
    return {}
  }
}

// ✅ Get resume data for the CURRENT USER (protected)
export async function getUserResume(): Promise<ResumeData | null> {
  try {
    const auth = getAuth()
    const currentUser = auth.currentUser

    if (!currentUser) {
      return null
    }

    const token = await currentUser.getIdToken()

    const response = await fetch(`${API_URL}/user/resumes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user resume")
    }

    const { resumes } = await response.json()
    return resumes[0] || {}
  } catch (error) {
    console.error("Error fetching user resume:", error)
    return {}
  }
}

// Save resume data to the server
export async function saveResume(data: ResumeData): Promise<ResumeData> {
  try {
    const auth = getAuth()
    const currentUser = auth.currentUser

    if (!currentUser) {
      throw new Error("User not authenticated")
    }

    const token = await currentUser.getIdToken()

    const response = await fetch(`${API_URL}/user/resumes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "Failed to save resume data")
    }

    return await response.json()
  } catch (error) {
    console.error("Error saving resume data:", error)
    return data
  }
}

// Analyze resume against job description
export async function analyzeResume(
  resumeData: ResumeData,
  jobDescription: string,
): Promise<{
  score: number
  matchedKeywords: string[]
  missingKeywords: string[]
  recommendations: string[]
}> {
  try {
    const response = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume: resumeData,
        jobDescription,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to analyze resume")
    }

    return await response.json()
  } catch (error) {
    console.error("Error analyzing resume:", error)
    return {
      score: 75,
      matchedKeywords: ["React", "JavaScript", "Node.js"],
      missingKeywords: ["Docker", "AWS"],
      recommendations: [
        "Add Docker to your skills if you have experience with it",
        "Include AWS in your technical skills if applicable",
        "Quantify your achievements with more specific metrics",
      ],
    }
  }
}

// Download resume as PDF
export async function downloadResume(resumeData: ResumeData): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resumeData),
    })

    if (!response.ok) {
      throw new Error("Failed to generate PDF")
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${resumeData.personalInfo?.fullName || "resume"}.pdf`.replace(/\s+/g, "_").toLowerCase()
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    a.remove()
  } catch (error) {
    console.error("Error downloading resume:", error)
    throw error
  }
}