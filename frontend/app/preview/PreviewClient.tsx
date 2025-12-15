// app/preview/PreviewClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useResume } from "@/context/resume-context";
import { FormSkeleton } from "@/components/form-skeleton";
import { ResumeHeader } from "@/components/resume-header";
import ResumeTemplate1 from "@/components/resume-templates/template1";
import ResumeTemplate2 from "@/components/resume-templates/template2";
import ResumeTemplate3 from "@/components/resume-templates/template3";
import ResumeTemplate4 from "@/components/resume-templates/template4";
import ResumeTemplate5 from "@/components/resume-templates/template5";
import ResumeTemplate6 from "@/components/resume-templates/template6";
import { ArrowLeft } from "lucide-react";
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper";
import { PdfDownloadButton } from "@/components/pdf-download-button";
import { useEffect, useState } from "react";

export function PreviewClient({ from }: { from: string }) {
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
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

  const handleBackToEditor = () => {
    router.push(`/builder/${from}`);
  };

  function renderTemplate() {
    switch (resumeData.template) {
      case "template1":
        return <ResumeTemplate1 data={resumeData} />;
      case "template2":
        return <ResumeTemplate2 data={resumeData} />;
      case "template3":
        return <ResumeTemplate3 data={resumeData} />;
      case "template4":
        return <ResumeTemplate4 data={resumeData} />;
      case "template5":
        return <ResumeTemplate5 data={resumeData} />;
      case "template6":
        return <ResumeTemplate6 data={resumeData} />;
      default:
        return <ResumeTemplate1 data={resumeData} />;
    }
  }

  return (
    <ThemeProviderWrapper>
      {/* ✅ ADDED: w-full max-w-full overflow-x-hidden */}
      <div className="min-h-screen flex flex-col bg-blue-50 w-full max-w-full overflow-x-hidden">
        <ResumeHeader currentStep="preview" />

        {/* ✅ ADDED: overflow-x-hidden + min-w-0 */}
        <main className="flex-1 w-full px-4 py-6 md:px-6 overflow-x-hidden min-w-0">
          <div className="max-w-6xl mx-auto mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 min-w-0">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Resume Preview
                </h1>
                <p className="text-muted-foreground">
                  Review your resume before downloading
                </p>
              </div>

              <div className="flex gap-3 w-full md:w-auto min-w-0">
                <Button
                  variant="outline"
                  onClick={handleBackToEditor}
                  className="w-full md:w-auto"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Editor
                </Button>
                <PdfDownloadButton className="w-full md:w-auto" />
              </div>
            </div>
          </div>

          {/* ✅ ADDED: overflow-x-hidden */}
          <div className="max-w-6xl mx-auto w-full overflow-x-hidden">
            {/* ✅ ADDED: overflow-x-hidden */}
            <Card className="overflow-x-hidden overflow-y-visible shadow-lg border">
              {/* ✅ ADDED: overflow-x-hidden */}
              <div className="p-4 md:p-6 bg-white overflow-x-hidden">
                {/* ✅ ADDED: w-full max-w-full */}
                <div
                  id="resume-content"
                  className="mx-auto w-full max-w-full overflow-x-hidden"
                >
                  {renderTemplate()}
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </ThemeProviderWrapper>
  );
}
