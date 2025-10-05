"use client"

import type React from "react"

import { useState } from "react"
import { type Control, useFieldArray } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Trash2, Plus, X } from "lucide-react"

interface ProjectItemProps {
  index: number
  control: Control<any>
  remove: (index: number) => void
  isRemovable: boolean
}

export function ProjectItem({ index, control, remove, isRemovable }: ProjectItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [newTechnology, setNewTechnology] = useState("")

  const {
    fields: technologies,
    append,
    remove: removeTechnology,
  } = useFieldArray({
    control,
    name: `projectItems.${index}.technologies`,
  })

  // Changed to regular function instead of form submission
  function addTechnology(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (newTechnology.trim()) {
      append({ name: newTechnology.trim() })
      setNewTechnology("")
    }
  }

  // Handle key press to add technology when Enter is pressed
  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && newTechnology.trim()) {
      e.preventDefault()
      append({ name: newTechnology.trim() })
      setNewTechnology("")
    }
  }

  return (
    <Card>
      <CardHeader
        className="p-4 flex flex-row items-center justify-between space-y-0 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <FormField
          control={control}
          name={`projectItems.${index}.title`}
          render={({ field }) => <CardTitle className="text-base">{field.value || "New Project"}</CardTitle>}
        />
        <div className="flex items-center gap-2">
          {isRemovable && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                remove(index)
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          )}
          <Button variant="ghost" size="icon">
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="p-4 pt-0 space-y-4">
          <FormField
            control={control}
            name={`projectItems.${index}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input placeholder="E-commerce Platform" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`projectItems.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Developed a full-stack e-commerce platform with user authentication, product catalog, and payment processing."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>Technologies Used</FormLabel>
            <div className="flex flex-wrap gap-2 mb-3">
              {technologies.map((tech, techIndex) => (
                <Badge key={tech.id} className="flex items-center gap-1 px-3 py-1.5">
                  {tech.name}
                  <button
                    type="button"
                    onClick={() => removeTechnology(techIndex)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {tech.name}</span>
                  </button>
                </Badge>
              ))}
            </div>

            {/* Replaced form with div */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a technology (e.g., React, Node.js)"
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
              />
              <Button type="button" size="sm" onClick={addTechnology} disabled={!newTechnology.trim()}>
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add</span>
              </Button>
            </div>
          </div>

          <FormField
            control={control}
            name={`projectItems.${index}.link`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Link (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/username/project" {...field} />
                </FormControl>
                <FormDescription>Link to GitHub repository, live demo, or other relevant URL</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`projectItems.${index}.startDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="01/2021" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`projectItems.${index}.endDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="04/2021" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name={`projectItems.${index}.isCollapsed`}
            render={({ field }) => <input type="hidden" {...field} value={isCollapsed.toString()} />}
          />
        </CardContent>
      )}
    </Card>
  )
}
