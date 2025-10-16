// Type definitions for resume data

export interface Achievement {
  text: string
}

export interface Education {
  institution: string
  location?: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate?: string
  description?: string
}

export interface WorkExperience {
  jobTitle: string
  company: string
  location?: string
  currentlyWorking: boolean
  startDate: string
  endDate?: string
  description?: string
  achievements?: Achievement[]
}

export interface Project {
  title: string
  description: string
  technologies: string[]
  link?: string
  startDate?: string
  endDate?: string
}

export interface SectionItem {
  title: string
  content: string
}

export interface AdditionalSection {
  type: string
  title: string
  items: SectionItem[]
}

export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  profilePicture?: string
  summary: string
}

export interface ResumeData {
  id?: string
  template?: string
  personalInfo?: PersonalInfo
  education?: Education[]
  workExperience?: WorkExperience[]
  skills?: string[]
  projects?: Project[]
  additionalSections?: AdditionalSection[]
}
