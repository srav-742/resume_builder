"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getResume } from "@/services/api"

export type ResumeData = {
  id?: string
  template?: string
  personalInfo?: {
    fullName: string
    email: string
    phone: string
    location: string
    profilePicture?: string
    summary: string
  }
  education?: Array<{
    institution: string
    location?: string
    degree: string
    fieldOfStudy: string
    startDate: string
    endDate?: string
    description?: string
  }>
  workExperience?: Array<{
    jobTitle: string
    company: string
    location?: string
    currentlyWorking: boolean
    startDate: string
    endDate?: string
    description?: string
    achievements?: Array<{ text: string }>
  }>
  skills?: string[]
  projects?: Array<{
    title: string
    description: string
    technologies: string[]
    link?: string
    startDate?: string
    endDate?: string
  }>
  additionalSections?: Array<{
    type: string
    title: string
    items: Array<{
      title: string
      content: string
    }>
  }>
}

type ResumeContextType = {
  resumeData: ResumeData
  updateResumeData: (data: ResumeData) => void
  isLoading: boolean
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadResume() {
      try {
        const data = await getResume()
        if (data) {
          setResumeData(data)
        }
      } catch (error) {
        console.error("Failed to load resume data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadResume()
  }, [])

  function updateResumeData(data: ResumeData) {
    setResumeData(data)
  }

  return <ResumeContext.Provider value={{ resumeData, updateResumeData, isLoading }}>{children}</ResumeContext.Provider>
}

export function useResume() {
  const context = useContext(ResumeContext)
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider")
  }
  return context
}
