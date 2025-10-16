"use client"

import { useState, useEffect } from "react" // 👈 Added useEffect
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { useResume } from "@/context/resume-context" // 👈 Already imported
import { saveResume } from "@/services/api"
import { BuilderNavigation } from "@/components/builder-navigation"
import { FormSkeleton } from "@/components/form-skeleton"
import { AutoSaveIndicator } from "@/components/auto-save-indicator"
import { WorkExperienceItem } from "@/components/work-experience-item"
import { PlusCircle } from "lucide-react"

const achievementSchema = z.object({
  text: z.string().min(1, { message: "Achievement text is required" }),
})

const workExperienceItemSchema = z.object({
  jobTitle: z.string().min(2, { message: "Job title is required" }),
  company: z.string().min(2, { message: "Company name is required" }),
  location: z.string().optional(),
  currentlyWorking: z.boolean().default(false),
  startDate: z.string().min(2, { message: "Start date is required" }),
  endDate: z.string().optional(),
  description: z.string().optional(),
  achievements: z.array(achievementSchema).optional().default([]),
  isCollapsed: z.boolean().default(false),
})

const workExperienceSchema = z.object({
  workExperienceItems: z.array(workExperienceItemSchema).min(1, { message: "Add at least one work experience entry" }),
})

type WorkExperienceValues = z.infer<typeof workExperienceSchema>

export default function WorkExperiencePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, resumeData, updateResumeData, isLoading } = useResume() // 👈 Destructure `user`
  const [isSaving, setIsSaving] = useState(false)

  // 👇 Added: Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return <FormSkeleton />
  }

  const form = useForm<WorkExperienceValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperienceItems: resumeData.workExperience?.length
        ? resumeData.workExperience.map((item) => ({
            ...item,
            isCollapsed: true,
          }))
        : [
            {
              jobTitle: "",
              company: "",
              location: "",
              currentlyWorking: false,
              startDate: "",
              endDate: "",
              description: "",
              achievements: [],
              isCollapsed: false,
            },
          ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workExperienceItems",
  })

  async function onSubmit(values: WorkExperienceValues) {
    setIsSaving(true)

    try {
      // Remove isCollapsed property before saving
      const workExperienceItems = values.workExperienceItems.map(({ isCollapsed, ...item }) => item)

      const updatedData = {
        ...resumeData,
        workExperience: workExperienceItems,
      }

      await saveResume(updatedData)
      updateResumeData(updatedData)

      toast({
        title: "Progress saved",
        description: "Your work experience information has been saved",
      })

      router.push("/builder/skills-projects")
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

  function addWorkExperience() {
    append({
      jobTitle: "",
      company: "",
      location: "",
      currentlyWorking: false,
      startDate: "",
      endDate: "",
      description: "",
      achievements: [],
      isCollapsed: false,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
        <CardDescription>Add your work history, starting with your most recent position</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <WorkExperienceItem
                key={field.id}
                index={index}
                control={form.control}
                remove={remove}
                isRemovable={fields.length > 1}
              />
            ))}

            <Button type="button" variant="outline" className="w-full" onClick={addWorkExperience}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Experience
            </Button>

            {/* ✅ ADDED: View Full Preview Button */}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push("/preview?from=work-experience")}
              >
                View Full Preview
              </Button>
            </div>

            <BuilderNavigation>
              <Button type="button" variant="outline" onClick={() => router.push("/builder/education")}>
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