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
  const { resumeData, isLoading } = useResume(); // ✅ Fixed: assuming context exports resumeData
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Map current pathname to step name for ?from=...
  const getCurrentStep = () => {
    if (pathname.includes("/builder/education")) return "education";
    if (pathname.includes("/builder/work-experience")) return "work-experience";
    if (pathname.includes("/builder/skills-projects")) return "skills-projects";
    if (pathname.includes("/builder/additional-sections")) return "additional-sections";
    if (pathname.includes("/builder/ats-score")) return "ats-score";
    return "personal-info"; // default fallback
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

  // 💡 Auto-scale the resume to fit the preview container width
  useEffect(() => {
    const resumeWidth = 816; // 8.5in * 96px/in

    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      if (containerWidth > 0 && resumeWidth > containerWidth) {
        setScale(containerWidth / resumeWidth);
      } else {
        setScale(1);
      }
    }
  }, [resumeData]);

  if (isLoading) {
    return (
      <Card className="p-4 h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading preview...</p>
        </div>
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

      {/* ✅ FIXED: Responsive preview container with controlled height */}
      <Card className="p-4 overflow-hidden bg-white">
        <div
          ref={containerRef}
          className="w-full flex justify-center"
          style={{
            minHeight: "200px",
            maxHeight: "calc(100vh - 200px)", // Limit height to avoid excessive scrolling
            overflowY: "auto", // Allow vertical scroll if needed
          }}
        >
          <div
            ref={resumeRef}
            className="bg-white"
            style={{
              width: "816px",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              transition: "transform 0.2s ease-in-out",
              // Ensure content respects scaled dimensions
              boxSizing: "border-box",
            }}
          >
            {renderTemplate()}
          </div>
        </div>
      </Card>

      {/* Auto-Save & Tips */}
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium mb-2">Auto-Save Enabled</h4>
        <p className="text-sm text-muted-foreground">
          Your progress is automatically saved as you work. You can safely navigate between sections without losing your
          data.
        </p>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium mb-2">Tips</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Keep your resume concise and relevant to the job
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Use action verbs to describe your achievements
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Quantify your accomplishments with numbers when possible
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Tailor your resume to match the job description for better ATS scores
          </li>
        </ul>
      </div>
    </div>
  );
}