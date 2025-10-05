"use client"

import type React from "react"

import { useState } from "react"
import { type Control, useFieldArray } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronUp, Trash2, Plus, X } from "lucide-react"

interface WorkExperienceItemProps {
  index: number
  control: Control<any>
  remove: (index: number) => void
  isRemovable: boolean
}

export function WorkExperienceItem({ index, control, remove, isRemovable }: WorkExperienceItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [newAchievement, setNewAchievement] = useState("")

  const {
    fields: achievements,
    append,
    remove: removeAchievement,
  } = useFieldArray({
    control,
    name: `workExperienceItems.${index}.achievements`,
  })

  // Changed to regular function instead of form submission
  function addAchievement(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (newAchievement.trim()) {
      append({ text: newAchievement.trim() })
      setNewAchievement("")
    }
  }

  // Handle key press to add achievement when Enter is pressed
  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && newAchievement.trim()) {
      e.preventDefault()
      append({ text: newAchievement.trim() })
      setNewAchievement("")
    }
  }

  return (
    <Card>
      <CardHeader
        className="p-4 flex flex-row items-center justify-between space-y-0 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex flex-col">
          <FormField
            control={control}
            name={`workExperienceItems.${index}.jobTitle`}
            render={({ field }) => <CardTitle className="text-base">{field.value || "New Work Experience"}</CardTitle>}
          />
          <FormField
            control={control}
            name={`workExperienceItems.${index}.company`}
            render={({ field }) => (
              <div className="text-sm text-muted-foreground">
                {field.value
                  ? `${field.value}${control._formValues.workExperienceItems[index].location ? `, ${control._formValues.workExperienceItems[index].location}` : ""}`
                  : ""}
              </div>
            )}
          />
        </div>
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
            name={`workExperienceItems.${index}.jobTitle`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Software Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`workExperienceItems.${index}.company`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Tech Solutions Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`workExperienceItems.${index}.location`}
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
            control={control}
            name={`workExperienceItems.${index}.currentlyWorking`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I currently work here</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`workExperienceItems.${index}.startDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input placeholder="06/2020" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`workExperienceItems.${index}.endDate`}
              render={({ field }) => {
                const currentlyWorking = control._formValues.workExperienceItems[index].currentlyWorking
                return (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={currentlyWorking ? "Present" : "01/2023"}
                        {...field}
                        disabled={currentlyWorking}
                        value={currentlyWorking ? "Present" : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>

          <FormField
            control={control}
            name={`workExperienceItems.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Developing and maintaining web applications using React and Node.js."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>Key Achievements</FormLabel>
            <ul className="space-y-2">
              {achievements.map((achievement, achievementIndex) => (
                <li key={achievement.id} className="flex items-center gap-2">
                  <FormField
                    control={control}
                    name={`workExperienceItems.${index}.achievements.${achievementIndex}.text`}
                    render={({ field }) => (
                      <FormItem className="flex-1 mb-0">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeAchievement(achievementIndex)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove achievement</span>
                  </Button>
                </li>
              ))}
            </ul>

            {/* Replaced form with div */}
            <div className="flex gap-2">
              <Input
                placeholder="Add an achievement (e.g., Increased sales by 20%)"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
              />
              <Button type="button" size="sm" onClick={addAchievement} disabled={!newAchievement.trim()}>
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add</span>
              </Button>
            </div>
          </div>

          <FormField
            control={control}
            name={`workExperienceItems.${index}.isCollapsed`}
            render={({ field }) => <input type="hidden" {...field} value={isCollapsed.toString()} />}
          />
        </CardContent>
      )}
    </Card>
  )
}
