// app/templates/page.tsx

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ResumeHeader } from "@/components/resume-header";
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper";
import { useResume } from "@/context/resume-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { saveResume } from "@/services/api";

// ✅ ADD: Firebase auth and profile save
import { getAuth } from 'firebase/auth';

export default function TemplatesPage() {
  const { resumeData, updateResumeData } = useResume();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>(resumeData.template || "template1");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const templates = [
    {
      id: "template1",
      name: "Professional",
      image: "images/templates/Professional.png",
      description: "Clean and professional design suitable for most industries",
    },
    {
      id: "template2",
      name: "Modern",
      image: "images/templates/Modern.png",
      description: "Contemporary layout with a creative touch",
    },
    {
      id: "template3",
      name: "Minimal",
      image: "images/templates/Minimal.png",
      description: "Simple and elegant design focusing on content",
    },
    {
      id: "template4",
      name: "Web Designer",
      image: "/images/templates/web-designer.png",
      description: "Clean, single-column layout optimized for web designers and creatives",
    },
    {
      id: "template5",
      name: "Professional Profile",
      image: "images/templates/SoftwareDeveloper.png",
      description: "Clean design with profile photo and two-column skills",
    },
    {
      id: "template6",
      name: "Data Analyst",
      image: "images/templates/DataAnalyst.png",
      description: "Minimalist single-column layout with pink headings — perfect for data analysts and professionals.",
    },
  ];

  async function handleTemplateSelect(templateId: string) {
    setIsLoading(true);
    setSelectedTemplate(templateId);

    try {
      const updatedData = {
        ...resumeData,
        template: templateId,
      };

      updateResumeData(updatedData);

      // ✅ Save to resume system (your existing logic)
      await saveResume(updatedData);

      // ✅ ALSO save to USER PROFILE (so /profile page can read it)
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const idToken = await user.getIdToken();
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://resume-builder-2gji.onrender.com';

        const profileResponse = await fetch(`${BACKEND_URL}/api/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            selectedTemplate: templateId, // 👈 Only send template ID
          }),
        });

        if (!profileResponse.ok) {
          console.warn("Failed to save template to user profile (non-critical)");
        }
      }

      router.push(`/builder/personal-info`);

      toast({
        title: "Template Selected",
        description: `You've selected the ${templates.find((t) => t.id === templateId)?.name} template.`,
      });
    } catch (error) {
      console.error("Error saving template selection:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save template selection. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ThemeProviderWrapper>
      <div className="min-h-screen flex flex-col">
        <ResumeHeader currentStep="templates" />
        <main className="flex-1 container max-w-6xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Choose a Template</h1>
            <p className="text-muted-foreground">Select a template to get started with your resume</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`overflow-hidden transition-all hover:shadow-lg ${selectedTemplate === template.id ? "ring-2 ring-primary" : ""
                  }`}
              >
                <div className="relative h-80 bg-muted">
                  <Image src={template.image || "/placeholder.svg"} alt={template.name} fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                  <p className="text-muted-foreground mb-4">{template.description}</p>
                  <Button className="w-full" onClick={() => handleTemplateSelect(template.id)} disabled={isLoading}>
                    {selectedTemplate === template.id ? "Selected" : "Select Template"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </ThemeProviderWrapper>
  );
}