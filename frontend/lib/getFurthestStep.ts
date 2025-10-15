// frontend/lib/getFurthestStep.ts
import type { ResumeData } from "@/context/resume-context"

export function getFurthestStep(resumeData: ResumeData): string {
  // Step 1: Personal Info
  const hasPersonalInfo = resumeData.personalInfo?.fullName && resumeData.personalInfo.email

  if (!hasPersonalInfo) return "personal-info"

  // Step 2: Work Experience
  const hasWork = resumeData.workExperience && resumeData.workExperience.length > 0
  if (!hasWork) return "work-experience"

  // Step 3: Education
  const hasEducation = resumeData.education && resumeData.education.length > 0
  if (!hasEducation) return "education"

  // Step 4: Skills & Projects
  const hasSkills = resumeData.skills && resumeData.skills.length > 0
  const hasProjects = resumeData.projects && resumeData.projects.length > 0
  if (!hasSkills && !hasProjects) return "skills-projects"

  // Step 5: Additional Sections (optional)
  // Step 6: ATS Score (final step)
  return "ats-score"
}