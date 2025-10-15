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
import { EducationItem } from "@/components/education-item"
import { PlusCircle } from "lucide-react"

const educationItemSchema = z.object({
  institution: z.string().min(2, { message: "Institution name is required" }),
  location: z.string().optional(),
  degree: z.string().min(2, { message: "Degree is required" }),
  fieldOfStudy: z.string().min(2, { message: "Field of study is required" }),
  startDate: z.string().min(2, { message: "Start date is required" }),
  endDate: z.string().optional(),
  description: z.string().optional(),
  isCollapsed: z.boolean().default(false),
})

const educationSchema = z.object({
  educationItems: z.array(educationItemSchema).min(1, { message: "Add at least one education entry" }),
})

type EducationValues = z.infer<typeof educationSchema>

export default function EducationPage() {
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

  const form = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educationItems: resumeData.education?.length
        ? resumeData.education.map((item) => ({
            ...item,
            isCollapsed: true,
          }))
        : [
            {
              institution: "",
              location: "",
              degree: "",
              fieldOfStudy: "",
              startDate: "",
              endDate: "",
              description: "",
              isCollapsed: false,
            },
          ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educationItems",
  })

  async function onSubmit(values: EducationValues) {
    setIsSaving(true)

    try {
      // Remove isCollapsed property before saving
      const educationItems = values.educationItems.map(({ isCollapsed, ...item }) => item)

      const updatedData = {
        ...resumeData,
        education: educationItems,
      }

      await saveResume(updatedData)
      updateResumeData(updatedData)

      toast({
        title: "Progress saved",
        description: "Your education information has been saved",
      })

      router.push("/builder/work-experience")
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

  function addEducation() {
    append({
      institution: "",
      location: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      description: "",
      isCollapsed: false,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>Add your educational background</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <EducationItem
                key={field.id}
                index={index}
                control={form.control}
                remove={remove}
                isRemovable={fields.length > 1}
              />
            ))}

            <Button type="button" variant="outline" className="w-full" onClick={addEducation}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Education
            </Button>

            {/* ✅ ADDED: View Full Preview Button */}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push("/preview?from=education")}
              >
                View Full Preview
              </Button>
            </div>

            <BuilderNavigation>
              <Button type="button" variant="outline" onClick={() => router.push("/builder/personal-info")}>
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