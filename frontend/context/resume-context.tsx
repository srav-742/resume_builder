'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
// ✅ FIXED: onAuthStateChanged comes from 'firebase/auth', NOT your lib
import { auth, type User } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth"; // ✅ Correct import
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
    gender?: string;
    dateOfBirth?: string;
    address?: string;
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
  updateSection: <K extends keyof ResumeData>(section: K, value: ResumeData[K]) => void;
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
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const saved = localStorage.getItem('resumeData');
    if (saved) {
      try {
        setResumeData(JSON.parse(saved));
      } catch (e) {
        setResumeData({});
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const resume = await getUserResume();
          if (resume && Object.keys(resume).length > 0) {
            setResumeData(resume);
            localStorage.setItem('resumeData', JSON.stringify(resume));
          }
        } catch (error) {
          console.error('Failed to load user resume:', error);
        }
      } else {
        if (window.location.pathname.startsWith('/builder')) {
          window.location.href = '/login';
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      !isLoading &&
      resumeData &&
      !isInitialRedirectDone &&
      user
    ) {
      const currentPath = window.location.pathname;
      const isProfileOrFixedRoute =
        currentPath === '/profile' ||
        currentPath.startsWith('/profile/') ||
        currentPath === '/dashboard' ||
        currentPath === '/settings';

      if (!isProfileOrFixedRoute) {
        const nextStep = getFurthestStep(resumeData);
        router.replace(`/builder/${nextStep}`);
        setIsInitialRedirectDone(true);
      }
    }
  }, [resumeData, isLoading, isInitialRedirectDone, user, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
    }
  }, [resumeData]);

  function updateResumeData(data: ResumeData) {
    setResumeData(data);
  }

  const updateSection = useCallback(<K extends keyof ResumeData>(section: K, value: ResumeData[K]) => {
    setResumeData(prev => ({ ...prev, [section]: value }));
  }, []);

  return (
    <ResumeContext.Provider value={{ resumeData, updateResumeData, updateSection, isLoading, user }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}