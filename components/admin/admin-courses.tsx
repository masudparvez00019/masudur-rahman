"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  BookOpen,
  Edit,
  Trash,
  Plus,
  MoreHorizontal,
  Layers,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Course {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  featuredImage?: string;
  price: number;
  salePrice?: number;
  isFree: boolean;
  isPublished: boolean;
  level: string;
  category: {
    _id: string;
    name: string;
  };
  duration: string;
  totalLessons: number;
  enrollmentsCount: number;
  whatYouWillLearn?: string[];
  requirements?: string[];
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const courseFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  subtitle: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  salePrice: z.coerce
    .number()
    .min(0, "Sale price must be a positive number")
    .optional(),
  isFree: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  level: z.string(),
  categoryId: z.string(),
  duration: z.string(),
  // Note: These validations will be handled separately
  whatYouWillLearn: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
});

export default function AdminCourses() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string>("");
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>([]);
  const [newLearningItem, setNewLearningItem] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState("basic");

  const form = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      subtitle: "",
      description: "",
      price: 0,
      salePrice: undefined,
      isFree: false,
      isPublished: false,
      level: "beginner",
      categoryId: "",
      duration: "",
      whatYouWillLearn: [],
      requirements: [],
    },
  });

  console.log(courses);
  // Sync the external state with the form values when they change
  useEffect(() => {
    form.setValue("whatYouWillLearn", whatYouWillLearn);
    form.setValue("requirements", requirements);
  }, [whatYouWillLearn, requirements, form]);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      console.log("Fetching courses...");

      const response = await fetch("/api/courses");
      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText);
        throw new Error(`Failed to fetch courses: ${response.status}`);
      }

      const data = await response.json();
      console.log("Full API response:", data);

      // এখানে আমরা বিভিন্ন সম্ভাব্য ফরম্যাট হ্যান্ডল করছি
      if (data && data.courses && Array.isArray(data.courses)) {
        console.log(
          "Setting courses from nested object:",
          data.courses.length,
          "courses"
        );
        setCourses(data.courses);
      } else if (Array.isArray(data)) {
        console.log(
          "Setting courses from direct array:",
          data.length,
          "courses"
        );
        setCourses(data);
      } else {
        console.error("Unexpected data format:", data);
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/courses/categories");

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText);
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      console.log("Category Data: ", data);
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const handleCreateCourse = async (
    values: z.infer<typeof courseFormSchema>
  ) => {
    // Validate the whatYouWillLearn and requirements separately
    if (whatYouWillLearn.length === 0) {
      toast.error("Please add at least one learning outcome");
      setCurrentTab("details");
      return;
    }

    if (requirements.length === 0) {
      toast.error("Please add at least one requirement");
      setCurrentTab("details");
      return;
    }

    // Check if featuredImage is provided
    if (!featuredImage) {
      toast.error("Featured image is required");
      setCurrentTab("media");
      return;
    }

    setFormSubmitting(true);

    try {
      console.log("Submitting course data...");

      const courseData = {
        ...values,
        // Map categoryId to category as expected by the API
        category: values.categoryId, // This is the key change!
        featuredImage,
        whatYouWillLearn,
        requirements,
      };

      console.log("Course data:", courseData);

      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText);
        throw new Error(`Failed to create course: ${errorText}`);
      }

      const newCourse = await response.json();
      console.log("New course created:", newCourse);

      setCourses([...courses, newCourse]);
      setOpenDialog(false);
      resetForm();

      toast.success("Course created successfully");

      // Navigate to course chapters management
      router.push(`/admin/courses/${newCourse._id}/chapters`);
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error(
        "Failed to create course: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleUpdateCourse = async (
    values: z.infer<typeof courseFormSchema>
  ) => {
    if (!editingCourse) return;

    // Validate the whatYouWillLearn and requirements separately
    if (whatYouWillLearn.length === 0) {
      toast.error("Please add at least one learning outcome");
      setCurrentTab("details");
      return;
    }

    if (requirements.length === 0) {
      toast.error("Please add at least one requirement");
      setCurrentTab("details");
      return;
    }

    // Check if featuredImage is provided
    if (!featuredImage) {
      toast.error("Featured image is required");
      setCurrentTab("media");
      return;
    }

    setFormSubmitting(true);

    try {
      const courseData = {
        ...values,
        // Map categoryId to category as expected by the API
        category: values.categoryId,
        featuredImage,
        whatYouWillLearn,
        requirements,
      };

      const response = await fetch(`/api/courses/${editingCourse._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText);
        throw new Error(`Failed to update course: ${response.status}`);
      }

      const updatedCourse = await response.json();
      setCourses(
        courses.map((course) =>
          course._id === updatedCourse._id ? updatedCourse : course
        )
      );
      setOpenDialog(false);
      resetForm();

      toast.success("Course updated successfully");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error(
        "Failed to update course: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText);
        throw new Error(`Failed to delete course: ${response.status}`);
      }

      setCourses(courses.filter((course) => course._id !== courseId));

      toast.success("Course deleted successfully");
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadingImage(true);

    try {
      const response = await fetch("/api/upload/course-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload response:", errorText);
        throw new Error(`Failed to upload image: ${response.status}`);
      }

      const data = await response.json();
      console.log("Image upload response:", data);
      setFeaturedImage(data.imageUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const addLearningItem = () => {
    if (newLearningItem.trim()) {
      setWhatYouWillLearn([...whatYouWillLearn, newLearningItem.trim()]);
      setNewLearningItem("");
    }
  };

  const removeLearningItem = (index: number) => {
    setWhatYouWillLearn(whatYouWillLearn.filter((_, i) => i !== index));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const openCreateDialog = () => {
    resetForm();
    setEditingCourse(null);
    setOpenDialog(true);
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setFeaturedImage(course.featuredImage || "");
    setWhatYouWillLearn(course.whatYouWillLearn || []);
    setRequirements(course.requirements || []);

    form.reset({
      title: course.title,
      slug: course.slug,
      subtitle: course.subtitle || "",
      description: course.description,
      price: course.price,
      salePrice: course.salePrice,
      isFree: course.isFree,
      isPublished: course.isPublished,
      level: course.level,
      categoryId: course.category._id,
      duration: course.duration,
      whatYouWillLearn: course.whatYouWillLearn || [],
      requirements: course.requirements || [],
    });

    setOpenDialog(true);
  };

  const resetForm = () => {
    form.reset({
      title: "",
      slug: "",
      subtitle: "",
      description: "",
      price: 0,
      salePrice: undefined,
      isFree: false,
      isPublished: false,
      level: "beginner",
      categoryId: "",
      duration: "",
      whatYouWillLearn: [],
      requirements: [],
    });
    setFeaturedImage("");
    setWhatYouWillLearn([]);
    setRequirements([]);
    setEditingCourse(null);
    setCurrentTab("basic");
  };

  const generateSlug = () => {
    const title = form.getValues("title");
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");
      form.setValue("slug", slug);
    }
  };

  const filteredCourses = !Array.isArray(courses)
    ? []
    : activeTab === "all"
    ? courses
    : activeTab === "published"
    ? courses.filter((course) => course.isPublished)
    : courses.filter((course) => !course.isPublished);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-3xl font-bold">Courses</h2>
          <p className="text-muted-foreground">
            Manage your courses and their content
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>
      </Tabs>

      {!Array.isArray(filteredCourses) || filteredCourses.length === 0 ? (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">No courses found</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Get started by creating a new course
          </p>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card key={course._id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={
                    course.featuredImage ||
                    "/placeholder.svg?height=192&width=384"
                  }
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute right-2 top-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-black/50 text-white hover:bg-black/70"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openEditDialog(course)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Course
                      </DropdownMenuItem>
                      <DropdownMenuItem
                      onClick={() =>
                        router.push(`/admin/courses/${course._id}/chapters`)
                      }
                      >
                      <Layers className="mr-2 h-4 w-4" />
                      Manage Chapters
                      </DropdownMenuItem>
                      <DropdownMenuItem
                      onClick={() =>
                        router.push(`/admin/courses/${course._id}/quizzes`)
                      }
                      >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Manage Quizzes
                      </DropdownMenuItem>
                      <DropdownMenuItem
                      onClick={() =>
                        router.push(
                        `/admin/courses/${course._id}/enrollments`
                        )
                      }
                      >
                      <Users className="mr-2 h-4 w-4" />
                      Enrollments
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                      onClick={() => handleDeleteCourse(course._id)}
                      className="text-red-600 focus:text-red-600"
                      >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Course
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant={course.isPublished ? "default" : "outline"}>
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                  <Badge variant={course.isFree ? "success" : "secondary"}>
                    {course.isFree
                      ? "Free"
                      : `$${course.salePrice || course.price}`}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.subtitle || course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <BookOpen className="mr-1 h-4 w-4" />
                    <span>{course.totalLessons || 0} lessons</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span>{course.enrollmentsCount || 0} enrolled</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => openEditDialog(course)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  onClick={() =>
                    router.push(`/admin/courses/${course._id}/chapters`)
                  }
                >
                  <Layers className="mr-2 h-4 w-4" />
                  Chapters
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? "Edit Course" : "Create Course"}
            </DialogTitle>
            <DialogDescription>
              {editingCourse
                ? "Update the details of your course"
                : "Fill in the details to create a new course"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                editingCourse ? handleUpdateCourse : handleCreateCourse
              )}
              className="space-y-6"
            >
              <Tabs
                value={currentTab}
                onValueChange={setCurrentTab}
                className="w-full"
              >
                <TabsList className="mb-4 w-full justify-start">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger
                    value="media"
                    className={!featuredImage ? "text-red-500" : ""}
                  >
                    Media {!featuredImage && "⚠️"}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The title of your course. Keep it clear and concise.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-end gap-2">
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            The URL-friendly version of the title.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateSlug}
                    >
                      Generate
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          A brief description that appears below the title.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea rows={5} {...field} />
                        </FormControl>
                        <FormDescription>
                          Detailed description of what students will learn in
                          this course.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category._id}
                                  value={category._id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The category this course belongs to.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">
                                Intermediate
                              </SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                              <SelectItem value="all-levels">
                                All Levels
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The difficulty level of this course.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 2 hours" />
                        </FormControl>
                        <FormDescription>
                          The estimated time to complete the course.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div>
                    <Label
                      className={
                        whatYouWillLearn.length === 0 ? "text-destructive" : ""
                      }
                    >
                      What You'll Learn{" "}
                      {whatYouWillLearn.length === 0 && "(Required)"}
                    </Label>
                    <div className="mt-2 space-y-2">
                      {whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={item} readOnly />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLearningItem(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Input
                        value={newLearningItem}
                        onChange={(e) => setNewLearningItem(e.target.value)}
                        placeholder="Add a learning outcome"
                        className={
                          whatYouWillLearn.length === 0
                            ? "border-destructive"
                            : ""
                        }
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addLearningItem())
                        }
                      />
                      <Button type="button" onClick={addLearningItem}>
                        Add
                      </Button>
                    </div>
                    {whatYouWillLearn.length === 0 && (
                      <p className="mt-2 text-sm text-destructive">
                        Add at least one learning outcome
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      className={
                        requirements.length === 0 ? "text-destructive" : ""
                      }
                    >
                      Requirements {requirements.length === 0 && "(Required)"}
                    </Label>
                    <div className="mt-2 space-y-2">
                      {requirements.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={item} readOnly />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRequirement(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Input
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        placeholder="Add a requirement"
                        className={
                          requirements.length === 0 ? "border-destructive" : ""
                        }
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addRequirement())
                        }
                      />
                      <Button type="button" onClick={addRequirement}>
                        Add
                      </Button>
                    </div>
                    {requirements.length === 0 && (
                      <p className="mt-2 text-sm text-destructive">
                        Add at least one requirement
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isFree"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Free Course
                          </FormLabel>
                          <FormDescription>
                            Make this course available for free to all users.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {!form.watch("isFree") && (
                    <>
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              The regular price of the course in USD.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="salePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sale Price ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(
                                    value === "" ? undefined : Number(value)
                                  );
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Optional discounted price. Leave empty for no
                              discount.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Published</FormLabel>
                          <FormDescription>
                            Make this course visible to users.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  <div>
                    <Label className={!featuredImage ? "text-destructive" : ""}>
                      Featured Image {!featuredImage && "(Required)"}
                    </Label>
                    <div className="mt-2">
                      <div className="mb-4 flex items-center gap-4">
                        {featuredImage ? (
                          <div className="relative h-40 w-40 overflow-hidden rounded-md">
                            <Image
                              src={featuredImage || "/placeholder.svg"}
                              alt="Featured image"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-40 w-40 items-center justify-center rounded-md border border-dashed border-destructive">
                            <p className="text-sm text-muted-foreground">
                              No image
                            </p>
                          </div>
                        )}
                        <div className="flex flex-col gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className={
                              !featuredImage ? "border-destructive" : ""
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            Recommended size: 1280x720px
                          </p>
                        </div>
                      </div>
                      {!featuredImage && (
                        <p className="mt-2 text-sm text-destructive">
                          Featured image is required
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                {/* Debug button for development */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    console.log("Form state:", form.formState);
                    console.log("Form values:", form.getValues());
                    console.log("WhatYouWillLearn:", whatYouWillLearn);
                    console.log("Requirements:", requirements);
                    console.log("Is form valid:", form.formState.isValid);
                    console.log("Form errors:", form.formState.errors);

                    // Show example payload
                    const examplePayload = {
                      ...form.getValues(),
                      category: form.getValues().categoryId,
                      featuredImage,
                      whatYouWillLearn,
                      requirements,
                    };
                    console.log("Example API payload:", examplePayload);
                  }}
                >
                  Check Form
                </Button>
                <Button
                  type="submit"
                  disabled={uploadingImage || formSubmitting}
                >
                  {formSubmitting
                    ? "Submitting..."
                    : editingCourse
                    ? "Update Course"
                    : "Create Course"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
