"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  ImageIcon,
} from "lucide-react";
import MDXEditor from "@/components/mdx/mdx-editor";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Define types
interface TutorialTopic {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image?: string;
  order: number;
  isPublished: boolean;
  tutorialCount?: number;
}

interface TutorialContent {
  _id: string;
  title: string;
  slug: string;
  content: string;
  topic: string;
  order: number;
  isPublished: boolean;
  metaDescription?: string;
  tags?: string[];
  readTime?: number;
}

export default function AdminTutorials() {
  const { toast } = useToast();

  // State for topics
  const [topics, setTopics] = useState<TutorialTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [newTopic, setNewTopic] = useState<Partial<TutorialTopic>>({
    title: "",
    slug: "",
    description: "",
    isPublished: false,
  });
  const [topicImageFile, setTopicImageFile] = useState<File | null>(null);
  const [topicImagePreview, setTopicImagePreview] = useState<string | null>(
    null
  );
  const [isUploadingTopicImage, setIsUploadingTopicImage] = useState(false);

  // State for tutorials
  const [tutorials, setTutorials] = useState<TutorialContent[]>([]);
  const [isLoadingTutorials, setIsLoadingTutorials] = useState(false);
  const [isAddingTutorial, setIsAddingTutorial] = useState(false);
  const [isEditingTutorial, setIsEditingTutorial] = useState(false);
  const [newTutorial, setNewTutorial] = useState<Partial<TutorialContent>>({
    title: "",
    slug: "",
    content: "",
    topic: "",
    metaDescription: "",
    tags: [],
    isPublished: false,
  });

  // Fetch topics on component mount
  useEffect(() => {
    fetchTopics();
  }, []);

  // Fetch tutorials when a topic is selected
  useEffect(() => {
    if (selectedTopic) {
      fetchTutorials(selectedTopic);
    } else {
      setTutorials([]);
    }
  }, [selectedTopic]);

  // Reset image preview when closing the dialog
  useEffect(() => {
    if (!isAddingTopic) {
      setTopicImageFile(null);
      setTopicImagePreview(null);
    }
  }, [isAddingTopic]);

  // Fetch topics from API
  const fetchTopics = async () => {
    setIsLoadingTopics(true);
    try {
      const response = await fetch(
        "/api/tutorials/topics?includeUnpublished=true"
      );
      if (!response.ok) throw new Error("Failed to fetch topics");

      const data = await response.json();
      setTopics(data);

      // Select the first topic if none is selected
      if (data.length > 0 && !selectedTopic) {
        setSelectedTopic(data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tutorial topics",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTopics(false);
    }
  };

  // Fetch tutorials for a topic
  const fetchTutorials = async (topicId: string) => {
    setIsLoadingTutorials(true);
    try {
      const response = await fetch(
        `/api/tutorials/content?topicId=${topicId}&includeUnpublished=true`
      );
      if (!response.ok) throw new Error("Failed to fetch tutorials");

      const data = await response.json();
      setTutorials(data);
    } catch (error) {
      console.error("Error fetching tutorials:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tutorials",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTutorials(false);
    }
  };

  // Handle topic image selection
  const handleTopicImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTopicImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTopicImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload topic image to Cloudinary
  const uploadTopicImage = async () => {
    if (!topicImageFile) return null;

    setIsUploadingTopicImage(true);
    try {
      const formData = new FormData();
      formData.append("file", topicImageFile);
      formData.append("upload_preset", "tutorial_images");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploadingTopicImage(false);
    }
  };

  // Handle topic form submission
  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTopic.title || !newTopic.slug || !newTopic.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Upload image if selected
      let imageUrl = newTopic.image;
      if (topicImageFile) {
        imageUrl = await uploadTopicImage();
        if (!imageUrl) return; // Stop if image upload failed
      }

      let response;

      if (isEditingTopic && newTopic._id) {
        // Update existing topic
        response = await fetch(`/api/tutorials/topics/${newTopic._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newTopic,
            image: imageUrl,
          }),
        });
      } else {
        // Create new topic
        response = await fetch("/api/tutorials/topics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newTopic,
            image: imageUrl,
          }),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save topic");
      }

      const savedTopic = await response.json();

      toast({
        title: "Success",
        description: isEditingTopic
          ? "Topic updated successfully"
          : "Topic created successfully",
      });

      // Reset form and refresh topics
      setNewTopic({
        title: "",
        slug: "",
        description: "",
        isPublished: false,
      });
      setIsAddingTopic(false);
      setIsEditingTopic(false);
      setTopicImageFile(null);
      setTopicImagePreview(null);
      fetchTopics();

      // Select the newly created topic
      if (!isEditingTopic) {
        setSelectedTopic(savedTopic._id);
      }
    } catch (error: any) {
      console.error("Error saving topic:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save topic",
        variant: "destructive",
      });
    }
  };

  // Handle tutorial form submission
  const handleTutorialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newTutorial.title ||
      !newTutorial.slug ||
      !newTutorial.content ||
      !selectedTopic
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      let response;

      if (isEditingTutorial && newTutorial._id) {
        // Update existing tutorial
        response = await fetch(`/api/tutorials/content/${newTutorial._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newTutorial,
            topic: selectedTopic,
          }),
        });
      } else {
        // Create new tutorial
        response = await fetch("/api/tutorials/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newTutorial,
            topic: selectedTopic,
          }),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save tutorial");
      }

      toast({
        title: "Success",
        description: isEditingTutorial
          ? "Tutorial updated successfully"
          : "Tutorial created successfully",
      });

      // Reset form and refresh tutorials
      setNewTutorial({
        title: "",
        slug: "",
        content: "",
        metaDescription: "",
        tags: [],
        isPublished: false,
        topic: "",
      });
      setIsAddingTutorial(false);
      setIsEditingTutorial(false);
      fetchTutorials(selectedTopic);
    } catch (error: any) {
      console.error("Error saving tutorial:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save tutorial",
        variant: "destructive",
      });
    }
  };

  // Handle topic deletion
  const handleDeleteTopic = async (topicId: string) => {
    try {
      const response = await fetch(`/api/tutorials/topics/${topicId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete topic");
      }

      toast({
        title: "Success",
        description: "Topic deleted successfully",
      });

      // Refresh topics and reset selection
      fetchTopics();
      setSelectedTopic(null);
    } catch (error: any) {
      console.error("Error deleting topic:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete topic",
        variant: "destructive",
      });
    }
  };

  // Handle tutorial deletion
  const handleDeleteTutorial = async (tutorialId: string) => {
    try {
      const response = await fetch(`/api/tutorials/content/${tutorialId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete tutorial");
      }

      toast({
        title: "Success",
        description: "Tutorial deleted successfully",
      });

      // Refresh tutorials
      if (selectedTopic) {
        fetchTutorials(selectedTopic);
      }
    } catch (error: any) {
      console.error("Error deleting tutorial:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete tutorial",
        variant: "destructive",
      });
    }
  };

  // Handle topic edit
  const handleEditTopic = (topic: TutorialTopic) => {
    setNewTopic({ ...topic });
    setIsEditingTopic(true);
    setIsAddingTopic(true);
    if (topic.image) {
      setTopicImagePreview(topic.image);
    }
  };

  // Handle tutorial edit
  const handleEditTutorial = (tutorial: TutorialContent) => {
    setNewTutorial({ ...tutorial });
    setIsEditingTutorial(true);
    setIsAddingTutorial(true);
    // Set the topic in the topic selector as well
    if (tutorial.topic) {
      setSelectedTopic(tutorial.topic);
    }
  };

  // Handle topic order change with drag and drop
  const handleTopicDragEnd = async (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const newTopics = [...topics];
    const [removed] = newTopics.splice(sourceIndex, 1);
    newTopics.splice(destinationIndex, 0, removed);

    // Update UI immediately
    setTopics(newTopics);

    // Update order in database
    try {
      const topicIds = newTopics.map((t) => t._id);
      const response = await fetch("/api/tutorials/topics/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to update topic order");
      }
    } catch (error) {
      console.error("Error updating topic order:", error);
      toast({
        title: "Error",
        description: "Failed to update topic order",
        variant: "destructive",
      });

      // Revert to original order on error
      fetchTopics();
    }
  };

  // Handle tutorial order change with drag and drop
  const handleTutorialDragEnd = async (result: any) => {
    if (!result.destination || !selectedTopic) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const newTutorials = [...tutorials];
    const [removed] = newTutorials.splice(sourceIndex, 1);
    newTutorials.splice(destinationIndex, 0, removed);

    // Update UI immediately
    setTutorials(newTutorials);

    // Update order in database
    try {
      const tutorialIds = newTutorials.map((t) => t._id);
      const response = await fetch("/api/tutorials/content/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId: selectedTopic, tutorialIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to update tutorial order");
      }
    } catch (error) {
      console.error("Error updating tutorial order:", error);
      toast({
        title: "Error",
        description: "Failed to update tutorial order",
        variant: "destructive",
      });

      // Revert to original order on error
      fetchTutorials(selectedTopic);
    }
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  };

  // Handle image upload for MDX editor
  const handleImageUpload = useCallback(
    async (file: File): Promise<string> => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "tutorial_images");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) throw new Error("Failed to upload image");

        const data = await response.json();
        return data.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Error",
          description: "Failed to upload image to Cloudinary",
          variant: "destructive",
        });
        throw error;
      }
    },
    [toast]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tutorial Management</CardTitle>
        <CardDescription>
          Create and manage tutorials for your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="topics">
          <TabsList className="mb-4">
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          </TabsList>

          {/* Topics Tab */}
          <TabsContent value="topics">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Tutorial Topics</h3>
              <Dialog open={isAddingTopic} onOpenChange={setIsAddingTopic}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Topic
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>
                      {isEditingTopic ? "Edit Topic" : "Add New Topic"}
                    </DialogTitle>
                    <DialogDescription>
                      {isEditingTopic
                        ? "Update the details of this tutorial topic"
                        : "Create a new tutorial topic to organize your tutorials"}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleTopicSubmit} className="space-y-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newTopic.title}
                          onChange={(e) => {
                            const title = e.target.value;
                            setNewTopic({
                              ...newTopic,
                              title,
                              // Only auto-generate slug if it's a new topic or slug is empty
                              slug:
                                !isEditingTopic || !newTopic.slug
                                  ? generateSlug(title)
                                  : newTopic.slug,
                            });
                          }}
                          placeholder="e.g., HTML Basics"
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          value={newTopic.slug}
                          onChange={(e) =>
                            setNewTopic({ ...newTopic, slug: e.target.value })
                          }
                          placeholder="e.g., html-basics"
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newTopic.description}
                          onChange={(e) =>
                            setNewTopic({
                              ...newTopic,
                              description: e.target.value,
                            })
                          }
                          placeholder="Brief description of this tutorial topic"
                          rows={3}
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="image">Topic Image</Label>
                        <div className="flex items-center gap-4">
                          {(topicImagePreview || newTopic.image) && (
                            <div className="h-20 w-20 rounded-md overflow-hidden">
                              <img
                                src={topicImagePreview || newTopic.image}
                                alt="Topic preview"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <Input
                              id="image"
                              type="file"
                              accept="image/*"
                              onChange={handleTopicImageChange}
                              className="cursor-pointer"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Recommended size: 800x400px. Max size: 2MB
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isPublished"
                          checked={newTopic.isPublished}
                          onCheckedChange={(checked) =>
                            setNewTopic({ ...newTopic, isPublished: checked })
                          }
                        />
                        <Label htmlFor="isPublished">Publish this topic</Label>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsAddingTopic(false);
                          setIsEditingTopic(false);
                          setNewTopic({
                            title: "",
                            slug: "",
                            description: "",
                            isPublished: false,
                          });
                          setTopicImageFile(null);
                          setTopicImagePreview(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isUploadingTopicImage}>
                        {isUploadingTopicImage ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : isEditingTopic ? (
                          "Update Topic"
                        ) : (
                          "Create Topic"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {isLoadingTopics ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : topics.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>
                  No tutorial topics found. Create your first topic to get
                  started.
                </p>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleTopicDragEnd}>
                <Droppable droppableId="topics">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {topics.map((topic, index) => (
                        <Draggable
                          key={topic._id}
                          draggableId={topic._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex items-center justify-between p-3 border rounded-md ${
                                selectedTopic === topic._id ? "bg-muted" : ""
                              }`}
                              onClick={() => setSelectedTopic(topic._id)}
                            >
                              <div className="flex items-center space-x-3">
                                {topic.image ? (
                                  <div className="h-10 w-10 rounded-md overflow-hidden">
                                    <img
                                      src={topic.image || "/placeholder.svg"}
                                      alt={topic.title}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium flex items-center">
                                    {topic.title}
                                    {!topic.isPublished && (
                                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                        Draft
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {topic.tutorialCount || 0} tutorials
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditTopic(topic);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Topic
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this
                                        topic? This action cannot be undone.
                                        {topic.tutorialCount &&
                                        topic.tutorialCount > 0 ? (
                                          <p className="mt-2 text-red-500">
                                            This topic contains{" "}
                                            {topic.tutorialCount} tutorials that
                                            will also be deleted.
                                          </p>
                                        ) : null}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteTopic(topic._id)
                                        }
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </TabsContent>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials">
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Tutorial Content</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedTopic
                    ? `Manage tutorials for the selected topic`
                    : "Select a topic to manage its tutorials"}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Select
                  value={selectedTopic || ""}
                  onValueChange={(value) => setSelectedTopic(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic._id} value={topic._id}>
                        {topic.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Dialog
                  open={isAddingTutorial}
                  onOpenChange={setIsAddingTutorial}
                >
                  <DialogTrigger asChild>
                    <Button disabled={!selectedTopic}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Tutorial
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {isEditingTutorial
                          ? "Edit Tutorial"
                          : "Add New Tutorial"}
                      </DialogTitle>
                      <DialogDescription>
                        {isEditingTutorial
                          ? "Update the details of this tutorial"
                          : "Create a new tutorial for the selected topic"}
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleTutorialSubmit} className="space-y-4">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="tutorial-title">Title</Label>
                          <Input
                            id="tutorial-title"
                            value={newTutorial.title}
                            onChange={(e) => {
                              const title = e.target.value;
                              setNewTutorial({
                                ...newTutorial,
                                title,
                                // Only auto-generate slug if it's a new tutorial or slug is empty
                                slug:
                                  !isEditingTutorial || !newTutorial.slug
                                    ? generateSlug(title)
                                    : newTutorial.slug,
                              });
                            }}
                            placeholder="e.g., Getting Started with HTML"
                            required
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="tutorial-slug">Slug</Label>
                          <Input
                            id="tutorial-slug"
                            value={newTutorial.slug}
                            onChange={(e) =>
                              setNewTutorial({
                                ...newTutorial,
                                slug: e.target.value,
                              })
                            }
                            placeholder="e.g., getting-started-with-html"
                            required
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="tutorial-meta">
                            Meta Description (Optional)
                          </Label>
                          <Textarea
                            id="tutorial-meta"
                            value={newTutorial.metaDescription || ""}
                            onChange={(e) =>
                              setNewTutorial({
                                ...newTutorial,
                                metaDescription: e.target.value,
                              })
                            }
                            placeholder="Brief description for SEO purposes"
                            rows={2}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="tutorial-topic">Topic</Label>
                          <Select
                            value={selectedTopic || ""}
                            onValueChange={setSelectedTopic}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a topic" />
                            </SelectTrigger>
                            <SelectContent>
                              {topics.map((topic) => (
                                <SelectItem key={topic._id} value={topic._id}>
                                  {topic.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="tutorial-tags">
                            Tags (Optional, comma-separated)
                          </Label>
                          <Input
                            id="tutorial-tags"
                            value={
                              newTutorial.tags
                                ? newTutorial.tags.join(", ")
                                : ""
                            }
                            onChange={(e) => {
                              const tagsString = e.target.value;
                              const tags = tagsString
                                .split(",")
                                .map((tag) => tag.trim())
                                .filter((tag) => tag.length > 0);
                              setNewTutorial({ ...newTutorial, tags });
                            }}
                            placeholder="e.g., html, beginner, web development"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="tutorial-content">
                            Content (MDX)
                          </Label>
                          <MDXEditor
                            initialContent={newTutorial.content || ""}
                            onChange={(content) =>
                              setNewTutorial({ ...newTutorial, content })
                            }
                            placeholder="Write your tutorial content here using Markdown and MDX..."
                            minHeight="300px"
                            onImageUpload={handleImageUpload}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="tutorial-published"
                            checked={newTutorial.isPublished}
                            onCheckedChange={(checked) =>
                              setNewTutorial({
                                ...newTutorial,
                                isPublished: checked,
                              })
                            }
                          />
                          <Label htmlFor="tutorial-published">
                            Publish this tutorial
                          </Label>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsAddingTutorial(false);
                            setIsEditingTutorial(false);
                            setNewTutorial({
                              title: "",
                              slug: "",
                              content: "",
                              metaDescription: "",
                              tags: [],
                              isPublished: false,
                              topic: "",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          {isEditingTutorial
                            ? "Update Tutorial"
                            : "Create Tutorial"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {!selectedTopic ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Select a topic to view and manage its tutorials</p>
              </div>
            ) : isLoadingTutorials ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : tutorials.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>
                  No tutorials found for this topic. Create your first tutorial
                  to get started.
                </p>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleTutorialDragEnd}>
                <Droppable droppableId="tutorials">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {tutorials.map((tutorial, index) => (
                        <Draggable
                          key={tutorial._id}
                          draggableId={tutorial._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center justify-between p-3 border rounded-md"
                            >
                              <div>
                                <div className="font-medium flex items-center">
                                  {tutorial.title}
                                  {!tutorial.isPublished && (
                                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                      Draft
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {tutorial.readTime
                                    ? `${tutorial.readTime} min read`
                                    : "No read time"}
                                  {tutorial.tags &&
                                    tutorial.tags.length > 0 && (
                                      <span className="ml-2">
                                        Tags: {tutorial.tags.join(", ")}
                                      </span>
                                    )}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const newPublishedState =
                                      !tutorial.isPublished;
                                    fetch(
                                      `/api/tutorials/content/${tutorial._id}`,
                                      {
                                        method: "PUT",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                          isPublished: newPublishedState,
                                        }),
                                      }
                                    )
                                      .then((response) => {
                                        if (!response.ok)
                                          throw new Error("Failed to update");
                                        return response.json();
                                      })
                                      .then(() => {
                                        // Update local state
                                        setTutorials(
                                          tutorials.map((t) =>
                                            t._id === tutorial._id
                                              ? {
                                                  ...t,
                                                  isPublished:
                                                    newPublishedState,
                                                }
                                              : t
                                          )
                                        );

                                        toast({
                                          title: "Success",
                                          description: newPublishedState
                                            ? "Tutorial published"
                                            : "Tutorial unpublished",
                                        });
                                      })
                                      .catch((error) => {
                                        console.error(
                                          "Error updating tutorial:",
                                          error
                                        );
                                        toast({
                                          title: "Error",
                                          description:
                                            "Failed to update tutorial status",
                                          variant: "destructive",
                                        });
                                      });
                                  }}
                                >
                                  {tutorial.isPublished ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditTutorial(tutorial)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Tutorial
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this
                                        tutorial? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteTutorial(tutorial._id)
                                        }
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
