// app/builder/additional-sections/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { useResume } from "@/context/resume-context"
import { saveResume } from "@/services/api"
import { BuilderNavigation } from "@/components/builder-navigation"
import { FormSkeleton } from "@/components/form-skeleton"
import { AutoSaveIndicator } from "@/components/auto-save-indicator"
import { AdditionalSectionItem } from "@/components/additional-section-item"
import { PlusCircle } from "lucide-react"

const sectionItemSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
})

const additionalSectionSchema = z.object({
  type: z.string(),
  title: z.string().min(2, { message: "Section title is required" }),
  items: z.array(sectionItemSchema).optional().default([]),
  isCollapsed: z.boolean().default(false),
})

const additionalSectionsSchema = z.object({
  sections: z.array(additionalSectionSchema).optional().default([]),
})

type AdditionalSectionsValues = z.infer<typeof additionalSectionsSchema>

export default function AdditionalSectionsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, resumeData, updateResumeData, isLoading } = useResume()
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return <FormSkeleton />
  }

  const form = useForm<AdditionalSectionsValues>({
    resolver: zodResolver(additionalSectionsSchema),
    defaultValues: {
      sections: Array.isArray(resumeData.additionalSections)
        ? resumeData.additionalSections.map((section) => ({
            ...section,
            isCollapsed: true,
          }))
        : [
            {
              type: "custom",
              title: "Custom Section",
              items: [],
              isCollapsed: false,
            },
          ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sections",
  })

  async function onSubmit(values: AdditionalSectionsValues) {
    setIsSaving(true)

    try {
      const sections = values.sections.map(({ isCollapsed, ...section }) => section)

      const updatedData = {
        ...resumeData,
        additionalSections: sections,
      }

      await saveResume(updatedData)
      updateResumeData(updatedData)

      toast({
        title: "Progress saved",
        description: "Your additional sections have been saved",
      })

      router.push("/builder/ats-score")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your information. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  function addSection() {
    append({
      type: "custom",
      title: "Custom Section",
      items: [],
      isCollapsed: false,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Sections</CardTitle>
        <CardDescription>Add more sections to enhance your resume</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <AdditionalSectionItem
                key={field.id}
                index={index}
                control={form.control}
                remove={remove}
                isRemovable={fields.length > 1}
              />
            ))}

            <Button type="button" variant="outline" className="w-full" onClick={addSection}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Section
            </Button>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push("/preview?from=additional-sections")}
              >
                View Full Preview
              </Button>
            </div>

            <BuilderNavigation>
              <Button type="button" variant="outline" onClick={() => router.push("/builder/skills-projects")}>
                Previous
              </Button>
              <div className="flex items-center gap-4">
                <AutoSaveIndicator />
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Next"}
                </Button>
              </div>
            </BuilderNavigation>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}