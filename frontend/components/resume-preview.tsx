"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useResume } from "@/context/resume-context";
import { Eye, Loader2 } from "lucide-react"; 
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useMemo, memo } from "react";
import dynamic from "next/dynamic";

// =========================================================================================
// ⚡️ NEXT.JS OPTIMIZATION: DYNAMIC IMPORTS
// This stops the 'Localhost' dev server from crashing/freezing by not loading all 6 templates 
// at once. It only loads the one you are currently viewing.
// =========================================================================================

const ResumeTemplate1 = dynamic(() => import("@/components/resume-templates/template1"), {
  loading: () => <TemplateLoader />
});
const ResumeTemplate2 = dynamic(() => import("@/components/resume-templates/template2"), {
  loading: () => <TemplateLoader />
});
const ResumeTemplate3 = dynamic(() => import("@/components/resume-templates/template3"), {
  loading: () => <TemplateLoader />
});
const ResumeTemplate4 = dynamic(() => import("@/components/resume-templates/template4"), {
  loading: () => <TemplateLoader />
});
const ResumeTemplate5 = dynamic(() => import("@/components/resume-templates/template5"), {
  loading: () => <TemplateLoader />
});
const ResumeTemplate6 = dynamic(() => import("@/components/resume-templates/template6"), {
  loading: () => <TemplateLoader />
});

// A small loading spinner component for TypeScript safety
const TemplateLoader = () => (
  <div className="h-[800px] flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// =========================================================================================

export const ResumePreview = memo(function ResumePreview() {
  const { resumeData, isLoading } = useResume();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const getCurrentStep = () => {
    if (pathname.includes("/builder/education")) return "education";
    if (pathname.includes("/builder/work-experience")) return "work-experience";
    if (pathname.includes("/builder/skills-projects")) return "skills-projects";
    if (pathname.includes("/builder/additional-sections")) return "additional-sections";
    if (pathname.includes("/builder/ats-score")) return "ats-score";
    return "personal-info";
  };

  const fullPreviewUrl = `/preview?from=${getCurrentStep()}`;

  // ⚡️ MEMOIZE: Prevents re-calculation lag when clicking unrelated buttons
  const RenderedTemplate = useMemo(() => {
    if (!resumeData) return null;

    switch (resumeData.template) {
      case "template1": return <ResumeTemplate1 data={resumeData} />;
      case "template2": return <ResumeTemplate2 data={resumeData} />;
      case "template3": return <ResumeTemplate3 data={resumeData} />;
      case "template4": return <ResumeTemplate4 data={resumeData} />;
      case "template5": return <ResumeTemplate5 data={resumeData} />;
      case "template6": return <ResumeTemplate6 data={resumeData} />;
      default: return <ResumeTemplate1 data={resumeData} />;
    }
  }, [resumeData]);

  // 🔥 Auto-scale logic
  useEffect(() => {
    const idealResumeWidth = 816;
    const adjustScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const newScale = containerWidth / idealResumeWidth;
        setScale(newScale);
      }
    };
    adjustScale();
    window.addEventListener("resize", adjustScale);
    return () => window.removeEventListener("resize", adjustScale);
  }, [resumeData]);

  if (isLoading) {
    return (
      <Card className="p-4 h-full flex items-center justify-center">
        <p className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading preview...
        </p>
      </Card>
    );
  }

  return (
    <div className="sticky top-24 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Resume Preview</h3>
        <Link href={fullPreviewUrl}>
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            View Full Preview
          </Button>
        </Link>
      </div>

      {/* ⭐ FULL-WIDTH RESUME PREVIEW */}
      <Card className="bg-white h-full p-0">
        <div
          ref={containerRef}
          className="w-full h-full overflow-x-hidden overflow-y-auto flex justify-start"
        >
          <div
            ref={resumeRef}
            // ⚡️ CSS OPTIMIZATION: Ensure 'optimize-paint' is in your global.css
            className="optimize-paint" 
            style={{
              minWidth: "816px",
              width: "100%",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              transition: "transform 0.2s ease-in-out",
            }}
          >
            {RenderedTemplate}
          </div>
        </div>
      </Card>

      {/* Auto-save info */}
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium mb-2">Auto-Save Enabled</h4>
        <p className="text-sm text-muted-foreground">
          Your progress is automatically saved. You can safely navigate between sections.
        </p>
      </div>

      {/* Tips */}
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium mb-2">Tips</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Keep your resume concise and relevant
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Use action verbs to describe achievements
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Add measurable accomplishments
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Tailor your resume to match the job description
          </li>
        </ul>
      </div>
    </div>
  );
});