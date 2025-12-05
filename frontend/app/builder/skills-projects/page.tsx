// app/builder/skills-projects/page.tsx
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useResume } from "@/context/resume-context";
import { saveResume, getUserResume } from "@/services/api";
import { BuilderNavigation } from "@/components/builder-navigation";
import { FormSkeleton } from "@/components/form-skeleton";
import { AutoSaveIndicator } from "@/components/auto-save-indicator";
import { ProjectItem } from "@/components/project-item";
import { Badge } from "@/components/ui/badge";
import { X, PlusCircle } from "lucide-react";

// --- Schemas ---
const technologySchema = z.object({
  name: z.string().min(1, { message: "Technology name is required" }),
});

const projectItemSchema = z.object({
  title: z.string().min(2, { message: "Project title is required" }),
  description: z.string().min(10, { message: "Project description is required" }),
  technologies: z.array(technologySchema).min(1, { message: "Add at least one technology" }),
  link: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCollapsed: z.boolean().default(false),
});

const skillsProjectsSchema = z.object({
  skills: z.array(z.object({ name: z.string() })).min(1, { message: "Add at least one skill" }),
  projectItems: z.array(projectItemSchema),
});

type SkillsProjectsValues = z.infer<typeof skillsProjectsSchema>;

export default function SkillsProjectsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, resumeData, updateSection, isLoading } = useResume();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SkillsProjectsValues>({
    resolver: zodResolver(skillsProjectsSchema),
    defaultValues: {
      skills: [{ name: "" }],
      projectItems: [],
    },
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control: form.control,
    name: "projectItems",
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  // ✅ Initialize form ONLY once on mount
  useEffect(() => {
    if (resumeData) {
      form.reset({
        skills: resumeData.skills?.length
          ? resumeData.skills.map((name) => ({ name }))
          : [{ name: "" }],
        projectItems: resumeData.projects?.length
          ? resumeData.projects.map((p) => ({
              ...p,
              technologies: p.technologies ? p.technologies.map((tech) => ({ name: tech })) : [],
              isCollapsed: true,
            }))
          : [],
      });
    }
  }, []); // 👈 Empty dependency array means run ONCE on mount

  // 🔴 Watch form state and sync to context in real-time
  const rawSkills = useWatch({ control: form.control, name: "skills" });
  const rawProjects = useWatch({ control: form.control, name: "projectItems" });

  useEffect(() => {
    if (!form.formState.isLoading) {
      const skills = rawSkills.map(s => s.name.trim()).filter(Boolean);
      const projects = rawProjects.map(p => ({
        title: p.title.trim(),
        description: p.description.trim(),
        technologies: p.technologies.map(t => t.name.trim()).filter(Boolean),
        link: p.link?.trim() || undefined,
        startDate: p.startDate?.trim() || undefined,
        endDate: p.endDate?.trim() || undefined,
      })).filter(p => p.title && p.description);

      updateSection("skills", skills);
      updateSection("projects", projects);
    }
  }, [rawSkills, rawProjects, form.formState.isLoading, updateSection]);

  // 🔐 Auth guard
  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  // 📤 Save Handler (UPDATED WITH DEBUG)
  async function onSubmit(values: SkillsProjectsValues) {
    console.log("✅ Form submitted with values:", values);
    setIsSaving(true);

    try {
      const formattedData = {
        skills: values.skills.map(s => s.name.trim()).filter(Boolean),
        projects: values.projectItems.map(p => ({
          title: p.title.trim(),
          description: p.description.trim(),
          technologies: p.technologies.map(t => t.name.trim()).filter(Boolean),
          link: p.link?.trim(),
          startDate: p.startDate?.trim(),
          endDate: p.endDate?.trim(),
        })).filter(p => p.title && p.description),
      };

      const dataToSave = { ...resumeData, ...formattedData };
      await saveResume(dataToSave);

      updateSection("skills", formattedData.skills);
      updateSection("projects", formattedData.projects);

      toast({ title: "✅ Saved", description: "Skills and projects updated." });
      console.log("→ Navigating to /builder/additional-sections");
      router.push("/builder/additional-sections");
    } catch (error: any) {
      console.error("❌ Save failed:", error);
      const isVersionConflict = error?.message?.includes("No matching document");
      if (isVersionConflict) {
        const fresh = await getUserResume();
        if (fresh) {
          const retryData = { ...fresh, ...formattedData };
          await saveResume(retryData);
          updateSection("skills", formattedData.skills);
          updateSection("projects", formattedData.projects);
          toast({ title: "✅ Recovered & Saved", description: "Synced and saved." });
          router.push("/builder/additional-sections");
          return;
        }
      }
      toast({ variant: "destructive", title: "❌ Save Failed", description: "Try again." });
    } finally {
      setIsSaving(false);
    }
  }

  // ➕ Skills
  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value) {
        appendSkill({ name: value });
        e.currentTarget.value = "";
      }
    }
  };

  const handleRemoveSkill = (index: number) => removeSkill(index);
  const handleAddProject = () => appendProject({
    title: "", description: "", technologies: [], link: "", startDate: "", endDate: "", isCollapsed: false,
  });
  const handleRemoveProject = (index: number) => removeProject(index);

  if (isLoading || !user) return <FormSkeleton />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Projects</CardTitle>
        <CardDescription>Add your skills and highlight key projects</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Skills */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="skills"
                render={() => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {skillFields.map((field, index) => (
                        <Badge key={field.id} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                          {field.name}
                          <button type="button" onClick={() => handleRemoveSkill(index)} className="ml-1 hover:text-foreground">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <FormControl>
                      <Input placeholder="JavaScript, React..." onKeyDown={handleAddSkill} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Projects */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base">Projects</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={handleAddProject}>
                  <PlusCircle className="mr-1 h-4 w-4" /> Add Project
                </Button>
              </div>

              {projectFields.length === 0 ? (
                <p className="text-muted-foreground text-sm">No projects yet.</p>
              ) : (
                projectFields.map((field, index) => (
                  <ProjectItem
                    key={field.id}
                    index={index}
                    control={form.control}
                    remove={() => handleRemoveProject(index)}
                    isRemovable={true}
                  />
                ))
              )}
            </div>

            {/* Navigation */}
            <BuilderNavigation>
              <Button type="button" variant="outline" onClick={() => router.push("/builder/work-experience")}>
                ← Previous
              </Button>
              <div className="flex items-center gap-4">
                <AutoSaveIndicator />
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Next →"}
                </Button>
              </div>
            </BuilderNavigation>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}