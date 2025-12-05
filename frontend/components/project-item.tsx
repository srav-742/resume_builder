// components/project-item.tsx
"use client";

import type React from "react";
import { useState } from "react"; // ✅ Import useState from react
import { useFieldArray } from "react-hook-form"; // ✅ Import useFieldArray from react-hook-form
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Trash2, Plus, X } from "lucide-react";

interface ProjectItemProps {
  index: number;
  control: any;
  remove: (index: number) => void;
  isRemovable: boolean;
}

export function ProjectItem({ index, control, remove, isRemovable }: ProjectItemProps) {
  const {
    fields: technologies,
    append: appendTechnology,
    remove: removeTechnology,
  } = useFieldArray({
    control,
    name: `projectItems.${index}.technologies`,
  });

  const [newTechnology, setNewTechnology] = useState("");

  const addTechnology = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const value = newTechnology.trim();
    if (value) {
      appendTechnology({ name: value });
      setNewTechnology("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTechnology(e);
    }
  };

  return (
    <Card>
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
        <FormField
          control={control}
          name={`projectItems.${index}.title`}
          render={({ field }) => (
            <CardTitle className="text-base">{field.value || "New Project"}</CardTitle>
          )}
        />
        <div className="flex items-center gap-2">
          {isRemovable && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                remove(index);
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          )}
        </div>
      </CardHeader>

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
                  placeholder="Developed a full-stack e-commerce platform..."
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Technologies Used</FormLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {technologies.map((tech, i) => (
              <Badge key={tech.id} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                {tech.name}
                <button
                  type="button"
                  onClick={() => removeTechnology(i)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tech.name}</span>
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTechnology}
              onChange={(e) => setNewTechnology(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="React, Node.js..."
              className="flex-1"
            />
            <Button type="button" size="sm" onClick={addTechnology} disabled={!newTechnology.trim()}>
              <Plus className="h-4 w-4" />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={control}
            name={`projectItems.${index}.startDate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input placeholder="MM/YYYY" {...field} />
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
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input placeholder="MM/YYYY or Present" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}