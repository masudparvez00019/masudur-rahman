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
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Upload,
  ImageIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { toast } from "sonner";
import TiptapEditor from "../ui/tiptap-editor";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  createdAt: string;
  readTime: string;
  image: string;
  category: string;
  tags: string[];
  published: boolean;
  author?: {
    _id: string;
    name: string;
    image?: string;
  };
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    readTime: "",
    image: "",
    category: "",
    tags: "",
    published: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    // Set image preview when form data changes (for editing)
    if (formData.image) {
      setImagePreview(formData.image);
    } else {
      setImagePreview(null);
    }
  }, [formData.image]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blogs");
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blog posts. Please try again.");
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

  const handleContentChange = (content: string) => {
    setFormData({ ...formData, content });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, published: checked });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      readTime: "",
      image: "",
      category: "",
      tags: "",
      published: false,
    });
    setIsEditing(false);
    setCurrentId("");
    setImagePreview(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);

      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Upload to Cloudinary via our API
      const response = await fetch("/api/upload/blog-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      // Update form with the Cloudinary URL
      setFormData((prev) => ({ ...prev, image: data.url }));
      setImagePreview(data.url);

      toast.success("Image uploaded", {
        description: "Your image has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tagsArray = formData.tags.split(",").map((tag) => tag.trim());

      const blogData = {
        ...formData,
        tags: tagsArray,
      };

      let response;
      if (isEditing) {
        response = await fetch(`/api/blogs/${currentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blogData),
        });
      } else {
        response = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blogData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save blog post");
      }

      toast.success(isEditing ? "Blog post updated" : "Blog post created", {
        description: isEditing
          ? "The blog post has been updated successfully."
          : "The blog post has been created successfully.",
      });

      resetForm();
      setDialogOpen(false);
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast.error("Failed to save blog post", {
        description: "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setIsEditing(true);
    setCurrentId(blog._id);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      readTime: blog.readTime,
      image: blog.image,
      category: blog.category,
      tags: blog.tags.join(", "),
      published: blog.published,
    });
    setImagePreview(blog.image);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        const response = await fetch(`/api/blogs/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete blog post");
        }

        toast.success("Blog post deleted", {
          description: "The blog post has been deleted successfully.",
        });

        fetchBlogs();
      } catch (error) {
        console.error("Error deleting blog post:", error);
        toast.error("Failed to delete blog post", {
          description: "Please try again.",
        });
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Blog Posts</CardTitle>
            <CardDescription>Manage your blog content</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1" onClick={resetForm}>
                <Plus className="h-4 w-4" /> Add Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Update your blog post details."
                    : "Fill in the details to create a new blog post."}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Post Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter post title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Brief summary of your post"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={handleSelectChange}
                        required
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web Development">
                            Web Development
                          </SelectItem>
                          <SelectItem value="CSS">CSS</SelectItem>
                          <SelectItem value="JavaScript">JavaScript</SelectItem>
                          <SelectItem value="Animations">Animations</SelectItem>
                          <SelectItem value="Frontend">Frontend</SelectItem>
                          <SelectItem value="Backend">Backend</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="readTime">Read Time</Label>
                      <Input
                        id="readTime"
                        placeholder="5 min read"
                        value={formData.readTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Featured Image</Label>
                    <div className="flex flex-col gap-4">
                      {/* Image preview */}
                      {imagePreview && (
                        <div className="relative w-full h-48 rounded-md overflow-hidden border">
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Blog featured image"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Hidden file input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />

                      {/* Upload button */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={triggerFileInput}
                        disabled={uploadingImage}
                        className="w-full"
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : imagePreview ? (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Change Image
                          </>
                        ) : (
                          <>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Upload Image
                          </>
                        )}
                      </Button>

                      {/* Hidden input to store the image URL */}
                      <Input
                        id="image"
                        type="hidden"
                        value={formData.image}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content (HTML)</Label>
                    {/* <Textarea
                      id="content"
                      className="min-h-[300px] font-mono text-sm"
                      placeholder="<p>Write your blog post content here...</p>"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                    /> */}
                    <TiptapEditor
                      value={formData.content}
                      onChange={(html) =>
                        setFormData({ ...formData, content: html })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
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
                      id="published"
                      checked={formData.published}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="published">Publish Post</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || uploadingImage}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {formData.published ? "Publish" : "Save as Draft"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : blogs.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Excerpt</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {post.excerpt}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{post.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.published ? "default" : "outline"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/blog/${post._id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(post)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(post._id)}
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
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No blog posts found. Create your first post to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
