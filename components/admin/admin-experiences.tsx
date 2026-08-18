"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, MoveUp, MoveDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { IExperience } from "@/lib/models/experience"

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState<IExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingExperience, setEditingExperience] = useState<IExperience | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)


  // Form state
  const [position, setPosition] = useState("")
  const [company, setCompany] = useState("")
  const [duration, setDuration] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/experiences")
      if (response.ok) {
        const data = await response.json()
        setExperiences(data)
      } else {
        toast.error("Failed to fetch experiences")
      }
    } catch (error) {
      console.error("Error fetching experiences:", error)
      toast.error("Failed to fetch experiences")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const descriptionArray = description.split("\n").filter((item) => item.trim() !== "")
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "")

      const experienceData = {
        position,
        company,
        duration,
        location,
        description: descriptionArray,
        tags: tagsArray,
      }

      let response

      if (editingExperience) {
        // Update existing experience
        response = await fetch(`/api/experiences/${editingExperience._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(experienceData),
        })
      } else {
        // Create new experience
        response = await fetch("/api/experiences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(experienceData),
        })
      }

      if (response.ok) {
        toast.success(
          editingExperience
            ? "Experience updated successfully."
            : "Experience created successfully."
        )

        // Reset form and refresh experiences
        resetForm()
        fetchExperiences()
        setIsDialogOpen(false)
      } else {
        const data = await response.json()
        throw new Error(data.message || "Something went wrong")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (experience: IExperience) => {
    setEditingExperience(experience)
    setPosition(experience.position)
    setCompany(experience.company)
    setDuration(experience.duration)
    setLocation(experience.location)
    setDescription(experience.description.join("\n"))
    setTags(experience.tags.join(", "))
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      try {
        const response = await fetch(`/api/experiences/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
            toast.success("The experience has been deleted successfully.")
          fetchExperiences()
        } else {
          const data = await response.json()
          throw new Error(data.message || "Something went wrong")
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete experience")
      }
    }
  }

  const handleMoveUp = async (experience: IExperience, index: number) => {
    if (index === 0) return

    try {
      const prevExperience = experiences[index - 1]

      // Swap orders
      const newOrder = prevExperience.order
      const prevOrder = experience.order

      // Update current experience
      await fetch(`/api/experiences/${experience._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: newOrder }),
      })

      // Update previous experience
      await fetch(`/api/experiences/${prevExperience._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: prevOrder }),
      })

      fetchExperiences()
    } catch (error) {
      toast.error("Failed to reorder experiences")
    }
  }

  const handleMoveDown = async (experience: IExperience, index: number) => {
    if (index === experiences.length - 1) return

    try {
      const nextExperience = experiences[index + 1]

      // Swap orders
      const newOrder = nextExperience.order
      const nextOrder = experience.order

      // Update current experience
      await fetch(`/api/experiences/${experience._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: newOrder }),
      })

      // Update next experience
      await fetch(`/api/experiences/${nextExperience._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: nextOrder }),
      })

      fetchExperiences()
    } catch (error) {
      toast.error("Failed to reorder experiences")
    }
  }

  const resetForm = () => {
    setPosition("")
    setCompany("")
    setDuration("")
    setLocation("")
    setDescription("")
    setTags("")
    setEditingExperience(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Work Experience</CardTitle>
            <CardDescription>Manage your professional experience</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1" onClick={resetForm}>
                <Plus className="h-4 w-4" /> Add Experience
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingExperience ? "Edit Experience" : "Add Experience"}</DialogTitle>
                <DialogDescription>
                  {editingExperience
                    ? "Update the details of this work experience."
                    : "Add a new work experience to your portfolio."}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="e.g., Senior Developer"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g., Tech Company Inc."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g., 2020 - Present"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Remote, New York, etc."
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (one point per line)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Led a team of 5 developers&#10;Implemented CI/CD pipeline&#10;Reduced load time by 40%"
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., React, Node.js, TypeScript"
                    required
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm()
                      setIsDialogOpen(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : editingExperience ? "Update" : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading experiences...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experiences.length > 0 ? (
                  experiences.map((experience, index) => (
                    <TableRow key={experience._id.toString()}>
                      <TableCell className="font-medium">{experience.position}</TableCell>
                      <TableCell>{experience.company}</TableCell>
                      <TableCell>{experience.duration}</TableCell>
                      <TableCell>{experience.location}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {experience.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {experience.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{experience.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(experience)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(experience._id.toString())}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveUp(experience, index)}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                            <span className="sr-only">Move Up</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveDown(experience, index)}
                            disabled={index === experiences.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                            <span className="sr-only">Move Down</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No experiences found. Add some experiences to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

