// Remove "use client" from the top
// "use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useResume } from "@/context/resume-context"
import { FormSkeleton } from "@/components/form-skeleton"
import { ResumeHeader } from "@/components/resume-templates/template1"
import ResumeTemplate1 from "@/components/resume-templates/template1"
import ResumeTemplate2 from "@/components/resume-templates/template2"
import ResumeTemplate3 from "@/components/resume-templates/template3"
import { ArrowLeft } from "lucide-react"
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper"
import { PdfDownloadButton } from "@/components/pdf-download-button"
import { useEffect, useState } from "react"

// ✅ Export dynamic config to prevent SSR
export const dynamic = 'force-dynamic'

// ✅ Create a separate component for the actual preview logic
function PreviewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resumeData, isLoading } = useResume()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // ✅ Wait for client + data to be ready
  if (!isClient || isLoading || !resumeData || typeof resumeData.template !== 'string') {
    return <FormSkeleton />
  }

  function renderTemplate(): JSX.Element {
    switch (resumeData.template) {
      case "template1":
        return <ResumeTemplate1 data={resumeData} />
      case "template2":
        return <ResumeTemplate2 data={resumeData} />
      case "template3":
        return <ResumeTemplate3 data={resumeData} />
      default:
        return <ResumeTemplate1 data={resumeData} />
    }
  }

  const fromStep = searchParams.get("from") || "personal-info"

  const handleBackToEditor = () => {
    router.push(`/builder/${fromStep}`)
  }

  return (
    <ThemeProviderWrapper>
      <div className="min-h-screen flex flex-col">
        <ResumeHeader currentStep="preview" />
        <main className="flex-1 container max-w-6xl mx-auto p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Resume Preview</h1>
              <p className="text-muted-foreground">Review your resume before downloading</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBackToEditor}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Editor
              </Button>
              <PdfDownloadButton />
            </div>
          </div>

          <Card className="p-0 shadow-lg print:shadow-none overflow-hidden">
            <div className="w-[8.5in] mx-auto bg-white" id="resume-content">
              {renderTemplate()}
            </div>
          </Card>
        </main>
      </div>
    </ThemeProviderWrapper>
  )
}

// ✅ Wrap the component with dynamic import to disable SSR
import dynamic from 'next/dynamic'
const DynamicPreviewContent = dynamic(() => Promise.resolve(PreviewContent), { ssr: false })

export default function PreviewPage() {
  return <DynamicPreviewContent />
}
