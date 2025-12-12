"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription, // ✅ IMPORTED
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useResume } from "@/context/resume-context"
import { saveResume } from "@/services/api"
import { BuilderNavigation } from "@/components/builder-navigation"
import { FormSkeleton } from "@/components/form-skeleton"
import { AutoSaveIndicator } from "@/components/auto-save-indicator"

const personalInfoSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(5, { message: "Please enter a valid phone number" }),
  location: z.string().min(2, { message: "Please enter your location" }),
  profilePicture: z.string().optional(),
  summary: z
    .string()
    .min(10, { message: "Summary should be at least 10 characters" })
    .max(500, { message: "Summary should not exceed 500 characters" }),
})

type PersonalInfoValues = z.infer<typeof personalInfoSchema>

export default function PersonalInfoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user, resumeData, updateResumeData, isLoading } = useResume()
  const [isSaving, setIsSaving] = useState(false)

  // ✅ DEFINE useForm AT THE TOP — BEFORE any conditional logic
  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      profilePicture: "",
      summary: "",
    },
  })

  // ✅ Sync form with resume data when it loads
  useEffect(() => {
    if (resumeData?.personalInfo) {
      form.reset({
        fullName: resumeData.personalInfo.fullName || "",
        email: resumeData.personalInfo.email || "",
        phone: resumeData.personalInfo.phone || "",
        location: resumeData.personalInfo.location || "",
        profilePicture: resumeData.personalInfo.profilePicture || "",
        summary: resumeData.personalInfo.summary || "",
      })
    }
  }, [resumeData, form])

  // ✅ Handle authentication redirect
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // ✅ 🔥 NEW: Sync template from URL to context on mount
  useEffect(() => {
    const urlTemplate = searchParams.get("template");
    if (urlTemplate && urlTemplate !== resumeData?.template) {
      updateResumeData({
        ...resumeData,
        template: urlTemplate,
      });
    }
  }, [searchParams, resumeData, updateResumeData]);

  // ✅ Conditional render AFTER all hooks
  if (isLoading || !user) {
    return <FormSkeleton />
  }

  const template = searchParams.get("template") || resumeData.template || "template1"

  async function onSubmit(values: PersonalInfoValues) {
    setIsSaving(true)
    try {
      const updatedData = {
        ...resumeData,
        template,
        personalInfo: values,
      }

      await saveResume(updatedData)
      updateResumeData(updatedData)

      toast({
        title: "Progress saved",
        description: "Your personal information has been saved",
      })

      router.push("/builder/education")
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Add your personal details to help employers contact you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="New York, NY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profilePicture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/your-photo.jpg  " {...field} />
                  </FormControl>
                  <FormDescription>
                    Recommended: Square JPG or PNG image URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Experienced software developer with a passion for creating user-friendly applications."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Write a short, compelling summary of your skills and experience. This is often the first thing
                    employers read.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push("/preview?from=personal-info")}
              >
                View Full Preview
              </Button>
            </div>

            <BuilderNavigation>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/builder/templates")}
              >
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