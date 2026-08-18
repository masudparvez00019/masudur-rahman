"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Upload,
  X,
  ImageIcon,
  ArrowUp,
  ArrowDown,
  MoveVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: string;
  features?: string[];
  screenshots?: string[];
  order?: number;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    tags: "",
    demoUrl: "",
    githubUrl: "",
    features: "",
    featured: false,
    image: "",
    screenshots: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [screenshotUploadProgress, setScreenshotUploadProgress] = useState(0);
  const [isScreenshotUploading, setIsScreenshotUploading] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/projects");
      const data = await response.json();

      // Sort projects by order field if it exists, otherwise by createdAt
      const sortedProjects = data.sort((a: Project, b: Project) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      setProjects(sortedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, featured: checked });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      longDescription: "",
      tags: "",
      demoUrl: "",
      githubUrl: "",
      features: "",
      featured: false,
      image: "",
      screenshots: [],
    });
    setIsEditing(false);
    setCurrentId("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      const response = await fetch("/api/upload/project-image", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, image: data.filePath }));
      setUploadProgress(100);

      toast.success("Image uploaded", {
        description: "Your image has been uploaded successfully.",
      });

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleScreenshotUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setIsScreenshotUploading(true);
    setScreenshotUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setScreenshotUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      const response = await fetch("/api/upload/project-image", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload screenshot");
      }

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        screenshots: [...prev.screenshots, data.filePath],
      }));
      setScreenshotUploadProgress(100);

      toast.success("Screenshot uploaded", {
        description: "Your screenshot has been uploaded successfully.",
      });

      // Reset progress after a short delay
      setTimeout(() => {
        setScreenshotUploadProgress(0);
        setIsScreenshotUploading(false);
      }, 1000);
    } catch (error) {
      console.error("Error uploading screenshot:", error);
      toast.error("Failed to upload screenshot");
      setIsScreenshotUploading(false);
      setScreenshotUploadProgress(0);
    }
  };

  const removeScreenshot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tagsArray = formData.tags.split(",").map((tag) => tag.trim());
      const featuresArray = formData.features
        .split("\n")
        .filter((feature) => feature.trim() !== "")
        .map((feature) => feature.trim());

      const projectData = {
        ...formData,
        tags: tagsArray,
        features: featuresArray,
      };

      let response;
      if (isEditing) {
        response = await fetch(`/api/projects/${currentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
      } else {
        response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save project");
      }

      toast.success(isEditing ? "Project updated" : "Project created", {
        description: isEditing
          ? "The project has been updated successfully."
          : "The project has been created successfully.",
      });

      resetForm();
      setDialogOpen(false);
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project: Project) => {
    setIsEditing(true);
    setCurrentId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || "",
      tags: project.tags.join(", "),
      demoUrl: project.demoUrl || "",
      githubUrl: project.githubUrl || "",
      features: project.features ? project.features.join("\n") : "",
      featured: project.featured,
      image: project.image,
      screenshots: project.screenshots || [],
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete project");
        }

        toast.success("Project deleted", {
          description: "The project has been deleted successfully.",
        });

        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project. Please try again.");
      }
    }
  };

  const toggleReordering = () => {
    setIsReordering(!isReordering);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property for each item
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setProjects(updatedItems);
  };

  const saveOrder = async () => {
    setIsSavingOrder(true);
    try {
      const projectIds = projects.map((project, index) => ({
        id: project._id,
        order: index,
      }));

      const response = await fetch("/api/projects/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: projectIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save project order");
      }

      toast.success("Order saved", {
        description: "Project order has been updated successfully.",
      });

      setIsReordering(false);
    } catch (error) {
      console.error("Error saving project order:", error);
      toast.error("Failed to save project order. Please try again.");
    } finally {
      setIsSavingOrder(false);
    }
  };

  const moveProject = async (id: string, direction: "up" | "down") => {
    const currentIndex = projects.findIndex((project) => project._id === id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === projects.length - 1)
    ) {
      return; // Can't move further in this direction
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newProjects = [...projects];
    const [movedProject] = newProjects.splice(currentIndex, 1);
    newProjects.splice(newIndex, 0, movedProject);

    // Update order property
    const updatedProjects = newProjects.map((project, index) => ({
      ...project,
      order: index,
    }));

    setProjects(updatedProjects);

    // Save the new order immediately
    try {
      const projectIds = updatedProjects.map((project, index) => ({
        id: project._id,
        order: index,
      }));

      const response = await fetch("/api/projects/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: projectIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to save project order");
      }

      toast.success("Order updated", {
        description: "Project order has been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving project order:", error);
      toast.error("Failed to save project order. Please try again.");
      // Revert to original order on error
      fetchProjects();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Manage your portfolio projects</CardDescription>
          </div>
          <div className="flex gap-2">
            {isReordering ? (
              <>
                <Button
                  variant="outline"
                  onClick={toggleReordering}
                  disabled={isSavingOrder}
                >
                  Cancel
                </Button>
                <Button onClick={saveOrder} disabled={isSavingOrder}>
                  {isSavingOrder && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Order
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={toggleReordering}
                  className="gap-1"
                >
                  <MoveVertical className="h-4 w-4" /> Reorder
                </Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-1" onClick={resetForm}>
                      <Plus className="h-4 w-4" /> Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {isEditing ? "Edit Project" : "Add New Project"}
                      </DialogTitle>
                      <DialogDescription>
                        {isEditing
                          ? "Update the details of your existing project."
                          : "Fill in the details to create a new project for your portfolio."}
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                      <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="mb-4">
                          <TabsTrigger value="basic">Basic Info</TabsTrigger>
                          <TabsTrigger value="details">Details</TabsTrigger>
                          <TabsTrigger value="media">Media</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="title">Project Title</Label>
                              <Input
                                id="title"
                                placeholder="Enter project title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="description">
                                Short Description
                              </Label>
                              <Textarea
                                id="description"
                                placeholder="Brief description of your project"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="tags">
                                Tags (comma separated)
                              </Label>
                              <Input
                                id="tags"
                                placeholder="Next.js, React, TypeScript"
                                value={formData.tags}
                                onChange={handleInputChange}
                                required
                              />
                            </div>

                            <div className="flex items-center space-x-2">
                              <Switch
                                id="featured"
                                checked={formData.featured}
                                onCheckedChange={handleSwitchChange}
                              />
                              <Label htmlFor="featured">Featured Project</Label>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="details" className="space-y-4">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="longDescription">
                                Detailed Description
                              </Label>
                              <Textarea
                                id="longDescription"
                                className="min-h-[150px]"
                                placeholder="Detailed description of your project"
                                value={formData.longDescription}
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="features">
                                Key Features (one per line)
                              </Label>
                              <Textarea
                                id="features"
                                className="min-h-[100px]"
                                placeholder="Real-time conversations&#10;Voice commands&#10;Mobile responsive"
                                value={formData.features}
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="demoUrl">Demo URL</Label>
                                <Input
                                  id="demoUrl"
                                  placeholder="https://example.com"
                                  value={formData.demoUrl}
                                  onChange={handleInputChange}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="githubUrl">GitHub URL</Label>
                                <Input
                                  id="githubUrl"
                                  placeholder="https://github.com/example/project"
                                  value={formData.githubUrl}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="media" className="space-y-4">
                          <div className="grid gap-6">
                            {/* Main Project Image */}
                            <div className="space-y-4">
                              <Label>Main Project Image</Label>

                              <div className="flex flex-col gap-4">
                                {formData.image ? (
                                  <div className="relative w-full h-48 border rounded-md overflow-hidden">
                                    <Image
                                      src={formData.image || "/placeholder.svg"}
                                      alt="Project preview"
                                      fill
                                      className="object-cover"
                                    />
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      className="absolute top-2 right-2 h-8 w-8"
                                      onClick={() =>
                                        setFormData((prev) => ({
                                          ...prev,
                                          image: "",
                                        }))
                                      }
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="border border-dashed rounded-md p-8 text-center flex flex-col items-center justify-center gap-2 h-48 bg-muted/50">
                                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                      No image selected
                                    </p>
                                  </div>
                                )}

                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                />

                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => fileInputRef.current?.click()}
                                  disabled={isUploading}
                                  className="w-full"
                                >
                                  {isUploading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <Upload className="mr-2 h-4 w-4" />
                                  )}
                                  {formData.image
                                    ? "Change Image"
                                    : "Upload Image"}
                                </Button>

                                {isUploading && (
                                  <div className="space-y-2">
                                    <Progress
                                      value={uploadProgress}
                                      className="h-2"
                                    />
                                    <p className="text-xs text-center text-muted-foreground">
                                      {uploadProgress < 100
                                        ? "Uploading..."
                                        : "Upload complete!"}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Project Screenshots */}
                            <div className="space-y-4">
                              <Label>Project Screenshots</Label>

                              <div className="grid grid-cols-2 gap-4">
                                {formData.screenshots.map(
                                  (screenshot, index) => (
                                    <div
                                      key={index}
                                      className="relative border rounded-md overflow-hidden h-32"
                                    >
                                      <Image
                                        src={screenshot || "/placeholder.svg"}
                                        alt={`Screenshot ${index + 1}`}
                                        fill
                                        className="object-cover"
                                      />
                                      <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6"
                                        onClick={() => removeScreenshot(index)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )
                                )}

                                {formData.screenshots.length < 6 && (
                                  <div
                                    className="border border-dashed rounded-md flex items-center justify-center h-32 cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors"
                                    onClick={() =>
                                      screenshotInputRef.current?.click()
                                    }
                                  >
                                    <Plus className="h-8 w-8 text-muted-foreground" />
                                  </div>
                                )}
                              </div>

                              <input
                                type="file"
                                ref={screenshotInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleScreenshotUpload}
                              />

                              {isScreenshotUploading && (
                                <div className="space-y-2">
                                  <Progress
                                    value={screenshotUploadProgress}
                                    className="h-2"
                                  />
                                  <p className="text-xs text-center text-muted-foreground">
                                    {screenshotUploadProgress < 100
                                      ? "Uploading screenshot..."
                                      : "Upload complete!"}
                                  </p>
                                </div>
                              )}

                              <p className="text-xs text-muted-foreground">
                                Add up to 6 screenshots of your project. Click
                                on the plus icon to add more.
                              </p>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>

                      <DialogFooter className="mt-6">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {isEditing ? "Update Project" : "Add Project"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : projects.length > 0 ? (
          <div className="rounded-md border">
            {isReordering ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="projects">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead>Featured</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {projects.map((project, index) => (
                            <Draggable
                              key={project._id}
                              draggableId={project._id}
                              index={index}
                            >
                              {(provided) => (
                                <TableRow
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="cursor-move hover:bg-muted/50"
                                >
                                  <TableCell className="font-medium">
                                    {index + 1}
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {project.title}
                                  </TableCell>
                                  <TableCell className="max-w-xs truncate">
                                    {project.description}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                      {project.tags.slice(0, 2).map((tag) => (
                                        <Badge
                                          key={tag}
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {tag}
                                        </Badge>
                                      ))}
                                      {project.tags.length > 2 && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          +{project.tags.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {project.featured ? "Yes" : "No"}
                                  </TableCell>
                                </TableRow>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project._id}>
                      <TableCell className="font-medium">
                        {project.title}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {project.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {project.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(project.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </TableCell>
                      <TableCell>{project.featured ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveProject(project._id, "up")}
                            title="Move Up"
                          >
                            <ArrowUp className="h-4 w-4" />
                            <span className="sr-only">Move Up</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveProject(project._id, "down")}
                            title="Move Down"
                          >
                            <ArrowDown className="h-4 w-4" />
                            <span className="sr-only">Move Down</span>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link
                              href={`/projects/${project._id}`}
                              target="_blank"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(project)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(project._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No projects found. Create your first project to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
