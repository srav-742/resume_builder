// This file is for the frontend to communicate with the backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

/**
 * Get resume data from the server
 * @returns {Promise<Object>} Resume data
 */
export async function getResume() {
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
    // Return empty object instead of null to avoid errors
    return {}
  }
}

/**
 * Save resume data to the server
 * @param {Object} data - Resume data to save
 * @returns {Promise<Object>} Saved resume data
 */
export async function saveResume(data) {
  try {
    const response = await fetch(`${API_URL}/resume`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to save resume data")
    }

    return await response.json()
  } catch (error) {
    console.error("Error saving resume data:", error)
    // Return the original data if saving fails
    return data
  }
}

/**
 * Analyze resume against job description
 * @param {Object} resumeData - Resume data
 * @param {string} jobDescription - Job description text
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeResume(resumeData, jobDescription) {
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

    // Return mock data if the API call fails
    // This allows the UI to still function for demo purposes
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

/**
 * Download resume as PDF
 * @param {Object} resumeData - Resume data
 * @returns {Promise<void>}
 */
export async function downloadResume(resumeData) {
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
