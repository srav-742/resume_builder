"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ResumeHeader } from "@/components/resume-header"
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper"
import { useResume } from "@/context/resume-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { saveResume } from "@/services/api"

export default function TemplatesPage() {
  const { resumeData, updateResumeData } = useResume()
  const router = useRouter()
  const { toast } = useToast()
  const [selectedTemplate, setSelectedTemplate] = useState<string>(resumeData.template || "template1")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const templates = [
    {
      id: "template1",
      name: "Professional",
      image: "/placeholder.svg?height=400&width=300",
      description: "Clean and professional design suitable for most industries",
    },
    {
      id: "template2",
      name: "Modern",
      image: "/placeholder.svg?height=400&width=300",
      description: "Contemporary layout with a creative touch",
    },
    {
      id: "template3",
      name: "Minimal",
      image: "/placeholder.svg?height=400&width=300",
      description: "Simple and elegant design focusing on content",
    },
  ]

  async function handleTemplateSelect(templateId: string) {
    setIsLoading(true)
    setSelectedTemplate(templateId)

    try {
      const updatedData = {
        ...resumeData,
        template: templateId,
      }

      // ✅ Update local state FIRST (saves to localStorage)
      updateResumeData(updatedData)

      // ✅ NAVIGATE IMMEDIATELY — don't wait for backend
      router.push(`/builder/personal-info`)

      // Save to backend in background
      await saveResume(updatedData)

      toast({
        title: "Template Selected",
        description: `You've selected the ${templates.find((t) => t.id === templateId)?.name} template.`,
      })
    } catch (error) {
      console.error("Error saving template selection:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save template selection. Please try again.",
      })
      // Navigation already happened — user is not blocked
    } finally {
      setIsLoading(false)
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`overflow-hidden transition-all hover:shadow-lg ${
                  selectedTemplate === template.id ? "ring-2 ring-primary" : ""
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
  )
}