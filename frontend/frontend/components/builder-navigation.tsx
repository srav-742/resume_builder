import type React from "react"
import { useResume } from "@/context/resume-context"
import { getFurthestStep } from "@/lib/getFurthestStep"

export function BuilderNavigation({ children }: { children: React.ReactNode }) {
  const { resumeData } = useResume()

  // Determine current step for progress indication (optional visual enhancement)
  const currentStep = getFurthestStep(resumeData)

  // You can now use `currentStep` to style a progress bar if you have one.
  // For now, we keep the layout unchanged — but the data is ready for UI updates.

  return <div className="flex items-center justify-between pt-6 border-t mt-8">{children}</div>
}