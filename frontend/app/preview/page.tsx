// app/preview/page.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useResume } from "@/context/resume-context";
import { FormSkeleton } from "@/components/form-skeleton";
// ❌ WRONG: ResumeHeader is NOT in template1
// import { ResumeHeader } from "@/components/resume-templates/template1";

// ✅ CORRECT: Import from actual file
import { ResumeHeader } from "@/components/resume-header";

import ResumeTemplate1 from "@/components/resume-templates/template1";
import ResumeTemplate2 from "@/components/resume-templates/template2";
import ResumeTemplate3 from "@/components/resume-templates/template3";
import { ArrowLeft } from "lucide-react";
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper";
import { PdfDownloadButton } from "@/components/pdf-download-button";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function PreviewPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resumeData, isLoading } = useResume();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <FormSkeleton />;
  }

  if (isLoading || !resumeData || typeof resumeData.template !== "string") {
    return <FormSkeleton />;
  }

  const fromStep = searchParams.get("from") || "personal-info";

  const handleBackToEditor = () => {
    router.push(`/builder/${fromStep}`);
  };

  function renderTemplate(): JSX.Element {
    switch (resumeData.template) {
      case "template1": return <ResumeTemplate1 data={resumeData} />;
      case "template2": return <ResumeTemplate2 data={resumeData} />;
      case "template3": return <ResumeTemplate3 data={resumeData} />;
      default: return <ResumeTemplate1 data={resumeData} />;
    }
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
  );
}