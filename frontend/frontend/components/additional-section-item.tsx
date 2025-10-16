"use client"

import { useState } from "react"
import { type Control, useFieldArray } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp, Trash2, Plus } from "lucide-react"

interface AdditionalSectionItemProps {
  index: number
  control: Control<any>
  remove: (index: number) => void
  isRemovable: boolean
}

export function AdditionalSectionItem({ index, control, remove, isRemovable }: AdditionalSectionItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const {
    fields,
    append,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: `sections.${index}.items`,
  })

  function addItem() {
    append({
      title: "",
      content: "",
    })
  }

  return (
    <Card>
      <CardHeader
        className="p-4 flex flex-row items-center justify-between space-y-0 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <FormField
          control={control}
          name={`sections.${index}.title`}
          render={({ field }) => <CardTitle className="text-base">{field.value || "Custom Section"}</CardTitle>}
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
            name={`sections.${index}.type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a section type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="custom">Custom Section</SelectItem>
                    <SelectItem value="certifications">Certifications</SelectItem>
                    <SelectItem value="languages">Languages</SelectItem>
                    <SelectItem value="awards">Awards</SelectItem>
                    <SelectItem value="publications">Publications</SelectItem>
                    <SelectItem value="volunteer">Volunteer Experience</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`sections.${index}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Title</FormLabel>
                <FormControl>
                  <Input placeholder="Custom Section" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>Items</FormLabel>
            </div>

            {fields.length === 0 ? (
              <div className="text-center p-4 border rounded-md text-muted-foreground">
                <p>No items added yet. Click "Add Item" to add content to this section.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((item, itemIndex) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Item {itemIndex + 1}</h4>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(itemIndex)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>

                      <FormField
                        control={control}
                        name={`sections.${index}.items.${itemIndex}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Item Title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`sections.${index}.items.${itemIndex}.content`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Item content or description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Button type="button" variant="outline" className="w-full" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          <FormField
            control={control}
            name={`sections.${index}.isCollapsed`}
            render={({ field }) => <input type="hidden" {...field} value={isCollapsed.toString()} />}
          />
        </CardContent>
      )}
    </Card>
  )
}
