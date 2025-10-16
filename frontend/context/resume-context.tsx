"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { auth, onAuthStateChanged, type User } from "@/lib/firebase";
import { getUserResume } from "@/services/api";
import { getFurthestStep } from "@/lib/getFurthestStep";

export type ResumeData = {
  id?: string;
  template?: string;
  personalInfo?: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    profilePicture?: string;
    summary: string;
  };
  education?: Array<{
    institution: string;
    location?: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  workExperience?: Array<{
    jobTitle: string;
    company: string;
    location?: string;
    currentlyWorking: boolean;
    startDate: string;
    endDate?: string;
    description?: string;
    achievements?: Array<{ text: string }>;
  }>;
  skills?: string[];
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    startDate?: string;
    endDate?: string;
  }>;
  additionalSections?: Array<{
    type: string;
    title: string;
    items: Array<{
      title: string;
      content: string;
    }>;
  }>;
};

type ResumeContextType = {
  resumeData: ResumeData;
  updateResumeData: (data: ResumeData) => void;
  isLoading: boolean;
  user: User | null;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [resumeData, setResumeData] = useState<ResumeData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialRedirectDone, setIsInitialRedirectDone] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const resume = await getUserResume();
          const finalData = resume || {};
          setResumeData(finalData);
          if (typeof window !== "undefined") {
            localStorage.setItem("resumeData", JSON.stringify(finalData));
          }
        } catch (error) {
          console.error("Failed to load user resume:", error);
          setResumeData({});
          if (typeof window !== "undefined") {
            localStorage.setItem("resumeData", JSON.stringify({}));
          }
        }
      } else {
        try {
          if (typeof window !== "undefined") {
            const saved = localStorage.getItem("resumeData");
            setResumeData(saved ? JSON.parse(saved) : {});
          } else {
            setResumeData({});
          }
        } catch (e) {
          setResumeData({});
        }

        // ✅ Redirect to login only on client and only if on /builder
        if (
          typeof window !== "undefined" &&
          window.location.pathname.startsWith("/builder")
        ) {
          window.location.href = "/login";
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Redirect authenticated users to their furthest step
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !isLoading &&
      resumeData &&
      !isInitialRedirectDone &&
      user
    ) {
      const nextStep = getFurthestStep(resumeData);
      router.replace(`/builder/${nextStep}`);
      setIsInitialRedirectDone(true);
    }
  }, [resumeData, isLoading, isInitialRedirectDone, user, router]);

  // Persist resume data to localStorage on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("resumeData", JSON.stringify(resumeData));
    }
  }, [resumeData]);

  function updateResumeData(data: ResumeData) {
    setResumeData(data);
  }

  return (
    <ResumeContext.Provider value={{ resumeData, updateResumeData, isLoading, user }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}