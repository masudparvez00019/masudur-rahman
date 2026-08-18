"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, MoveUp, MoveDown } from "lucide-react";
import { toast } from "sonner";
import type { ISkill } from "@/lib/models/skill";

export default function AdminSkills() {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSkill, setEditingSkill] = useState<ISkill | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
 

  // Form state
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("Frontend");
  const [skillsList, setSkillsList] = useState("");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/skills");
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      } else {
        toast.error("Failed to fetch skills");
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("Failed to fetch skills");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const skillsArray = skillsList
        .split("\n")
        .filter((skill) => skill.trim() !== "");

      const skillData = {
        title,
        icon,
        skills: skillsArray,
      };

      let response;

      if (editingSkill) {
        // Update existing skill
        response = await fetch(`/api/skills/${editingSkill._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(skillData),
        });
      } else {
        // Create new skill
        response = await fetch("/api/skills", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(skillData),
        });
      }

      if (response.ok) {
        toast.success(editingSkill ? "Skill updated successfully." : "Skill created successfully.");

        // Reset form and refresh skills
        resetForm();
        fetchSkills();
        setIsDialogOpen(false);
      } else {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (skill: ISkill) => {
    setEditingSkill(skill);
    setTitle(skill.title);
    setIcon(skill.icon);
    setSkillsList(skill.skills.join("\n"));
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      try {
        const response = await fetch(`/api/skills/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
            toast.success("The skill has been deleted successfully.");
          fetchSkills();
        } else {
          const data = await response.json();
          throw new Error(data.message || "Something went wrong");
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete skill"
        );
      }
    }
  };

  const handleMoveUp = async (skill: ISkill, index: number) => {
    if (index === 0) return;

    try {
      const prevSkill = skills[index - 1];

      // Swap orders
      const newOrder = prevSkill.order;
      const prevOrder = skill.order;

      // Update current skill
      await fetch(`/api/skills/${skill._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: newOrder }),
      });

      // Update previous skill
      await fetch(`/api/skills/${prevSkill._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: prevOrder }),
      });

      fetchSkills();
    } catch (error) {
      toast.error("Failed to reorder skills");
    }
  };

  const handleMoveDown = async (skill: ISkill, index: number) => {
    if (index === skills.length - 1) return;

    try {
      const nextSkill = skills[index + 1];

      // Swap orders
      const newOrder = nextSkill.order;
      const nextOrder = skill.order;

      // Update current skill
      await fetch(`/api/skills/${skill._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: newOrder }),
      });

      // Update next skill
      await fetch(`/api/skills/${nextSkill._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: nextOrder }),
      });

      fetchSkills();
    } catch (error) {
      toast.error("Failed to reorder skills");
    }
  };

  const resetForm = () => {
    setTitle("");
    setIcon("Frontend");
    setSkillsList("");
    setEditingSkill(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Skills & Expertise</CardTitle>
            <CardDescription>Manage your skills and expertise</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1" onClick={resetForm}>
                <Plus className="h-4 w-4" /> Add Skill Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingSkill ? "Edit Skill Category" : "Add Skill Category"}
                </DialogTitle>
                <DialogDescription>
                  {editingSkill
                    ? "Update the details of this skill category."
                    : "Add a new skill category to showcase your expertise."}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Category Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Frontend, Backend, etc."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={icon} onValueChange={setIcon}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Frontend">Frontend</SelectItem>
                      <SelectItem value="Backend">Backend</SelectItem>
                      <SelectItem value="Database">Database</SelectItem>
                      <SelectItem value="Cloud">Cloud & DevOps</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Tools">Tools & Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (one per line)</Label>
                  <Textarea
                    id="skills"
                    value={skillsList}
                    onChange={(e) => setSkillsList(e.target.value)}
                    placeholder="HTML&#10;CSS&#10;JavaScript&#10;React"
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Saving..."
                      : editingSkill
                      ? "Update"
                      : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading skills...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <TableRow key={skill._id.toString()}>
                      <TableCell className="font-medium">
                        {skill.title}
                      </TableCell>
                      <TableCell>{skill.icon}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {skill.skills.slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="text-xs px-2 py-1 rounded-full bg-primary/10"
                            >
                              {s}
                            </span>
                          ))}
                          {skill.skills.length > 3 && (
                            <span className="text-xs px-2 py-1 rounded-full bg-muted">
                              +{skill.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(skill)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(skill._id.toString())}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveUp(skill, index)}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                            <span className="sr-only">Move Up</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveDown(skill, index)}
                            disabled={index === skills.length - 1}
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
                    <TableCell colSpan={4} className="text-center py-4">
                      No skills found. Add some skills to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
