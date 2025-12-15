"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useResume } from "@/context/resume-context";
import ResumeTemplate1 from "@/components/resume-templates/template1";
import ResumeTemplate2 from "@/components/resume-templates/template2";
import ResumeTemplate3 from "@/components/resume-templates/template3";
import ResumeTemplate4 from "@/components/resume-templates/template4";
import ResumeTemplate5 from "@/components/resume-templates/template5";
import ResumeTemplate6 from "@/components/resume-templates/template6";
import { Eye } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function ResumePreview() {
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

  function renderTemplate() {
    if (!resumeData) return null;

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

  // 🔥 Auto-scale resume to fill full width
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
        <p className="text-muted-foreground">Loading preview...</p>
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

      {/* ⭐ FULL-WIDTH RESUME PREVIEW — HORIZONTAL SCROLL REMOVED */}
      <Card className="bg-white h-full p-0">
        <div
          ref={containerRef}
          className="w-full h-full overflow-x-hidden overflow-y-auto flex justify-start"
        >
          <div
            ref={resumeRef}
            style={{
              minWidth: "816px",
              width: "100%",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              transition: "transform 0.2s ease-in-out",
            }}
          >
            {renderTemplate()}
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
}
