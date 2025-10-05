"use client"

import { useState } from "react"
import type { Control } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react"

interface EducationItemProps {
  index: number
  control: Control<any>
  remove: (index: number) => void
  isRemovable: boolean
}

export function EducationItem({ index, control, remove, isRemovable }: EducationItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <Card>
      <CardHeader
        className="p-4 flex flex-row items-center justify-between space-y-0 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <FormField
          control={control}
          name={`educationItems.${index}.institution`}
          render={({ field }) => <CardTitle className="text-base">{field.value || "New Education Entry"}</CardTitle>}
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
            name={`educationItems.${index}.institution`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution</FormLabel>
                <FormControl>
                  <Input placeholder="University of Technology" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`educationItems.${index}.location`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Boston, MA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`educationItems.${index}.degree`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Degree</FormLabel>
                <FormControl>
                  <Input placeholder="Bachelor of Science" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`educationItems.${index}.fieldOfStudy`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field of Study</FormLabel>
                <FormControl>
                  <Input placeholder="Computer Science" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`educationItems.${index}.startDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input placeholder="09/2016" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`educationItems.${index}.endDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date (or Expected)</FormLabel>
                  <FormControl>
                    <Input placeholder="05/2020" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name={`educationItems.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Graduated with honors. Relevant coursework included Data Structures, Algorithms, and Web Development."
                    {...field}
                  />
                </FormControl>
                <FormDescription>Include relevant coursework, honors, or achievements</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`educationItems.${index}.isCollapsed`}
            render={({ field }) => <input type="hidden" {...field} value={isCollapsed.toString()} />}
          />
        </CardContent>
      )}
    </Card>
  )
}
