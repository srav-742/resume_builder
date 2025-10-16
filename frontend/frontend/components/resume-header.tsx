"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FileText, LogOut } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { useResume } from "@/context/resume-context"

type Step = {
  id: string
  label: string
  href: string
}

const steps: Step[] = [
  { id: "templates", label: "Template", href: "/templates" },
  { id: "personal-info", label: "Personal Info", href: "/builder/personal-info" },
  { id: "education", label: "Education", href: "/builder/education" },
  { id: "work-experience", label: "Work Experience", href: "/builder/work-experience" },
  { id: "skills-projects", label: "Skills & Projects", href: "/builder/skills-projects" },
  { id: "additional-sections", label: "Additional Sections", href: "/builder/additional-sections" },
  { id: "ats-score", label: "ATS Score", href: "/builder/ats-score" },
]

export function ResumeHeader({ currentStep }: { currentStep: string }) {
  const pathname = usePathname()
  const { user } = useResume()

  const activeStep = steps.findIndex((step) =>
    currentStep === "builder" ? pathname.includes(step.id) : step.id === currentStep,
  )

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem('resumeData')
      // ✅ Full page reload to avoid React hook errors
      window.location.href = '/login'
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">ResumeBuilder</span>
          </Link>

          {user ? (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-1">
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </Button>
          ) : (
            <div className="text-sm text-muted-foreground">
              <span className="mr-2">Save Progress</span>
              <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
            </div>
          )}
        </div>

        {currentStep !== "preview" && (
          <div className="hidden md:flex items-center justify-between">
            <div className="flex-1 flex">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <Link
                    href={step.href}
                    className={cn(
                      "flex items-center",
                      index <= activeStep
                        ? "text-primary hover:text-primary/80"
                        : "text-muted-foreground pointer-events-none",
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mr-2",
                        index < activeStep
                          ? "bg-primary text-white"
                          : index === activeStep
                            ? "border-2 border-primary text-primary"
                            : "border-2 border-muted text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium">{step.label}</span>
                  </Link>

                  {index < steps.length - 1 && (
                    <div className={cn("h-[2px] w-8 mx-2", index < activeStep ? "bg-primary" : "bg-muted")} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === "preview" && <h2 className="text-xl font-semibold">Build Your Resume</h2>}
      </div>
    </header>
  )
}