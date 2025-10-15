"use client"

import type React from "react"

import { useState, useEffect } from "react" // 👈 Added useEffect
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useResume } from "@/context/resume-context" // 👈 Already imported
import { saveResume } from "@/services/api"
import { BuilderNavigation } from "@/components/builder-navigation"
import { FormSkeleton } from "@/components/form-skeleton"
import { AutoSaveIndicator } from "@/components/auto-save-indicator"
import { ProjectItem } from "@/components/project-item"
import { Badge } from "@/components/ui/badge"
import { X, PlusCircle } from "lucide-react"

const technologySchema = z.object({
  name: z.string().min(1, { message: "Technology name is required" }),
})

const projectItemSchema = z.object({
  title: z.string().min(2, { message: "Project title is required" }),
  description: z.string().min(10, { message: "Project description is required" }),
  technologies: z.array(technologySchema).min(1, { message: "Add at least one technology" }),
  link: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCollapsed: z.boolean().default(false),
})

const skillsProjectsSchema = z.object({
  skills: z.array(z.object({ name: z.string() })).min(1, { message: "Add at least one skill" }),
  projectItems: z.array(projectItemSchema).optional().default([]),
})

type SkillsProjectsValues = z.infer<typeof skillsProjectsSchema>

export default function SkillsProjectsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, resumeData, updateResumeData, isLoading } = useResume() // 👈 Destructure `user`
  const [isSaving, setIsSaving] = useState(false)
  const [newSkill, setNewSkill] = useState("")

  // 👇 Added: Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return <FormSkeleton />
  }

  const form = useForm<SkillsProjectsValues>({
    resolver: zodResolver(skillsProjectsSchema),
    defaultValues: {
      skills: resumeData.skills?.length ? resumeData.skills.map((skill) => ({ name: skill })) : [],
      projectItems: resumeData.projects?.length
        ? resumeData.projects.map((item) => ({
            ...item,
            technologies: item.technologies.map((tech) => ({ name: tech })),
            isCollapsed: true,
          }))
        : [
            {
              title: "",
              description: "",
              technologies: [],
              link: "",
              startDate: "",
              endDate: "",
              isCollapsed: false,
            },
          ],
    },
  })

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control: form.control,
    name: "projectItems",
  })

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control: form.control,
    name: "skills",
  })

  async function onSubmit(values: SkillsProjectsValues) {
    setIsSaving(true)

    try {
      const skills = values.skills.map((skill) => skill.name)
      const projects = values.projectItems.map(({ isCollapsed, technologies, ...item }) => ({
        ...item,
        technologies: technologies.map((tech) => tech.name),
      }))
      const updatedData = {
        ...resumeData,
        skills,
        projects,
      }
      await saveResume(updatedData)
      updateResumeData(updatedData)
      toast({
        title: "Progress saved",
        description: "Your skills and projects have been saved",
      })
      router.push("/builder/additional-sections")
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

  function addSkill(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && newSkill.trim()) {
      e.preventDefault()
      appendSkill({ name: newSkill.trim() })
      setNewSkill("")
    }
  }

  function addProject() {
    appendProject({
      title: "",
      description: "",
      technologies: [],
      link: "",
      startDate: "",
      endDate: "",
      isCollapsed: false,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Projects</CardTitle>
        <CardDescription>Add your technical skills and showcase your projects</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="skills"
                render={() => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {skillFields.map((field, index) => (
                        <Badge key={field.id} className="flex items-center gap-1 px-3 py-1.5">
                          {field.name}
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove {field.name}</span>
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Add a skill (e.g., JavaScript, Project Management)"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={addSkill}
                      />
                    </FormControl>
                    <FormDescription>
                      Press Enter to add a skill. Include both technical skills (programming languages, tools) and soft
                      skills.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base">Projects</FormLabel>
              </div>

              {projectFields.map((field, index) => (
                <ProjectItem
                  key={field.id}
                  index={index}
                  control={form.control}
                  remove={removeProject}
                  isRemovable={projectFields.length > 1}
                />
              ))}

              <Button type="button" variant="outline" className="w-full" onClick={addProject}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another Project
              </Button>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push("/preview?from=skills-projects")}
              >
                View Full Preview
              </Button>
            </div>

            <BuilderNavigation>
              <Button type="button" variant="outline" onClick={() => router.push("/builder/work-experience")}>
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