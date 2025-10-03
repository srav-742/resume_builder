import { NextResponse } from "next/server"
import type { ResumeData } from "@/context/resume-context"

export async function POST(request: Request) {
  try {
    const resumeData = (await request.json()) as ResumeData

    // In a real application, you would generate a PDF here
    // For this demo, we'll just return a mock PDF as a text file

    // Create a simple text representation of the resume
    const resumeText = `
${resumeData.personalInfo?.fullName || ""}
${resumeData.personalInfo?.email || ""}
${resumeData.personalInfo?.phone || ""}
${resumeData.personalInfo?.location || ""}

${resumeData.personalInfo?.summary || ""}

WORK EXPERIENCE
${
  resumeData.workExperience
    ?.map(
      (job) =>
        `${job.jobTitle} at ${job.company}
  ${job.startDate} - ${job.currentlyWorking ? "Present" : job.endDate}
  ${job.description || ""}
  ${job.achievements?.map((a) => `• ${a.text}`).join("\n  ") || ""}
`,
    )
    .join("\n\n") || ""
}

EDUCATION
${
  resumeData.education
    ?.map(
      (edu) =>
        `${edu.degree} in ${edu.fieldOfStudy}
  ${edu.institution}, ${edu.location || ""}
  ${edu.startDate} - ${edu.endDate || ""}
  ${edu.description || ""}
`,
    )
    .join("\n\n") || ""
}

SKILLS
${resumeData.skills?.join(", ") || ""}

PROJECTS
${
  resumeData.projects
    ?.map(
      (project) =>
        `${project.title}
  ${project.description || ""}
  Technologies: ${project.technologies?.join(", ") || ""}
  ${project.link ? `Link: ${project.link}` : ""}
`,
    )
    .join("\n\n") || ""
}
    `

    // Convert text to a Blob that simulates a PDF
    const blob = new Blob([resumeText], { type: "application/pdf" })
    const buffer = await blob.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resumeData.personalInfo?.fullName || "resume"}.pdf"`
          .replace(/\s+/g, "_")
          .toLowerCase(),
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
