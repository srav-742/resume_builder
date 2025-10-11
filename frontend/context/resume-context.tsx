"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getResume } from "@/services/api"
import { auth } from "@/lib/firebase" // ✅ Import Firebase auth

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

  // ✅ Load from localStorage on mount (if available)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('resumeData');
      if (saved) {
        try {
          setResumeData(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse resume data from localStorage');
        }
      }
    }
  }, []);

  // ✅ Save to localStorage whenever resumeData changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
    }
  }, [resumeData]);

  // ✅ ENHANCED: Load resume from backend if user is logged in
  useEffect(() => {
    async function loadResumeFromBackend() {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Get fresh ID token
          const idToken = await currentUser.getIdToken(true);
          
          // Fetch resume from backend using token
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/resumes`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${idToken}`,
            },
          });

          if (response.ok) {
            const { resumes } = await response.json();
            const resume = resumes[0] || {};
            setResumeData(resume);
            localStorage.setItem('resumeData', JSON.stringify(resume)); // sync with localStorage
          }
        }
      } catch (error) {
        console.error("Failed to load resume from backend:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadResumeFromBackend();
  }, []);

  function updateResumeData( ResumeData) {
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