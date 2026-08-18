"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash, Upload, X, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface Certification {
  _id: string;
  title: string;
  organization: string;
  issueDate: string;
  description: string;
  imagePath: string;
  order: number;
}

export default function AdminCertifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    issueDate: "",
    description: "",
    imagePath: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch certifications
  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const response = await fetch("/api/certifications");
        if (response.ok) {
          const data = await response.json();
          setCertifications(data);
        } else {
          toast.error("Failed to fetch certifications");
        }
      } catch (error) {
        console.error("Error fetching certifications:", error);
        toast.error("Failed to fetch certifications");
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, [toast]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear image selection
  const clearImageSelection = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload image to Cloudinary
  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploadProgress(10); // Start progress

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      setUploadProgress(30); // Update progress
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(70); // Update progress

      if (response.ok) {
        const data = await response.json();
        setUploadProgress(100); // Complete progress
        return data.filePath; // This is now a Cloudinary URL
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      organization: "",
      issueDate: "",
      description: "",
      imagePath: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Open dialog for editing
  const handleEdit = (certification: Certification) => {
    setEditingId(certification._id);
    setFormData({
      title: certification.title,
      organization: certification.organization,
      issueDate: new Date(certification.issueDate).toISOString().split("T")[0],
      description: certification.description,
      imagePath: certification.imagePath,
    });
    setImagePreview(certification.imagePath);
    setOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imagePath = formData.imagePath;

      // Upload image if a new one is selected
      if (imageFile) {
        imagePath = await uploadImage();
        if (!imagePath) throw new Error("Failed to upload image");
      }

      const certificationData = {
        ...formData,
        imagePath,
      };

      let response;
      if (editingId) {
        // Update existing certification
        response = await fetch(`/api/certifications/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(certificationData),
        });
      } else {
        // Create new certification
        response = await fetch("/api/certifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(certificationData),
        });
      }

      if (response.ok) {
        const data = await response.json();

        if (editingId) {
          setCertifications((prev) =>
            prev.map((cert) => (cert._id === editingId ? data : cert))
          );
          toast.success("Certification updated successfully");
        } else {
          setCertifications((prev) => [...prev, data]);
          toast.success("Certification created successfully");
        }

        setOpen(false);
        resetForm();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to save certification");
      }
    } catch (error) {
      console.error("Error saving certification:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save certification"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle certification deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) {
      return;
    }

    try {
      const response = await fetch(`/api/certifications/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCertifications((prev) => prev.filter((cert) => cert._id !== id));
        toast.success("Certification deleted successfully");
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete certification");
      }
    } catch (error) {
      console.error("Error deleting certification:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete certification"
      );
    }
  };

  // Handle drag and drop reordering
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(certifications);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update local state immediately for better UX
    setCertifications(items);

    // Update order in the database
    try {
      const orderedIds = items.map((item) => item._id);
      const response = await fetch("/api/certifications/order", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update certification order");
    }
  };

  // Move certification up in order
  const moveUp = async (index: number) => {
    if (index === 0) return;

    const items = Array.from(certifications);
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;

    setCertifications(items);

    // Update order in the database
    try {
      const orderedIds = items.map((item) => item._id);
      await fetch("/api/certifications/order", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedIds }),
      });
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Move certification down in order
  const moveDown = async (index: number) => {
    if (index === certifications.length - 1) return;

    const items = Array.from(certifications);
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;

    setCertifications(items);

    // Update order in the database
    try {
      const orderedIds = items.map((item) => item._id);
      await fetch("/api/certifications/order", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedIds }),
      });
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Certifications</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>Add New Certification</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Certification" : "Add New Certification"}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Update the certification details below."
                  : "Fill in the details to add a new certification."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="organization" className="text-right">
                    Organization
                  </Label>
                  <Input
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="issueDate" className="text-right">
                    Issue Date
                  </Label>
                  <Input
                    id="issueDate"
                    name="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="col-span-3"
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">
                    Certificate Image
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="w-full"
                      />
                      {imageFile && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearImageSelection}
                        >
                          <X className="h-4 w-4 mr-1" /> Clear
                        </Button>
                      )}
                    </div>
                    {uploadProgress > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                    {imagePreview && (
                      <div className="relative h-40 w-full border rounded-md overflow-hidden">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Certificate preview"
                          fill
                          className="object-contain"
                          unoptimized={imagePreview.startsWith("data:")}
                        />
                      </div>
                    )}
                    {!imageFile && !imagePreview && (
                      <div className="flex items-center justify-center h-40 w-full border rounded-md border-dashed">
                        <div className="text-center">
                          <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mt-2">
                            Upload certificate image
                          </p>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Accepted formats: JPEG, PNG, WebP, GIF. Max size: 5MB.
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingId ? "Update" : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
          <CardDescription>
            Manage your professional certifications and achievements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading certifications...</div>
          ) : certifications.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No certifications found. Add your first certification to get
              started.
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="certifications">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead style={{ width: "5%" }}>Order</TableHead>
                          <TableHead style={{ width: "15%" }}>Image</TableHead>
                          <TableHead style={{ width: "20%" }}>Title</TableHead>
                          <TableHead style={{ width: "20%" }}>
                            Organization
                          </TableHead>
                          <TableHead style={{ width: "15%" }}>
                            Issue Date
                          </TableHead>
                          <TableHead style={{ width: "15%" }}>
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {certifications.map((certification, index) => (
                          <Draggable
                            key={certification._id}
                            draggableId={certification._id}
                            index={index}
                          >
                            {(provided) => (
                              <TableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TableCell>
                                  <div className="flex flex-col gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => moveUp(index)}
                                      disabled={index === 0}
                                    >
                                      <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => moveDown(index)}
                                      disabled={
                                        index === certifications.length - 1
                                      }
                                    >
                                      <ArrowDown className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="relative h-16 w-24 rounded-md overflow-hidden">
                                    <Image
                                      src={
                                        certification.imagePath ||
                                        "/placeholder.svg"
                                      }
                                      alt={certification.title}
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </div>
                                </TableCell>
                                <TableCell>{certification.title}</TableCell>
                                <TableCell>
                                  {certification.organization}
                                </TableCell>
                                <TableCell>
                                  {new Date(
                                    certification.issueDate
                                  ).toLocaleDateString("en-US", {
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleEdit(certification)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() =>
                                        handleDelete(certification._id)
                                      }
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
