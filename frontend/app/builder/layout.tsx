import type React from "react"
import { ResumeHeader } from "@/components/resume-header"
import { ResumePreview } from "@/components/resume-preview"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper"

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProviderWrapper>
      {/* ✅ Added overflow-x-hidden to root container */}
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <ResumeHeader currentStep="builder" />
        <div className="flex-1 container max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ✅ WRAP CHILDREN IN A SAFE CONTAINER */}
          <div className="lg:col-span-3 overflow-x-hidden">
            {children}
          </div>
          <div className="lg:col-span-2 hidden lg:block">
            <ResumePreview />
          </div>
        </div>
        <Toaster />
      </div>
    </ThemeProviderWrapper>
  )
}