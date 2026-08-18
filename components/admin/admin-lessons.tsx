// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import { toast } from "@/components/ui/use-toast"
// import { Pencil, Plus, Trash2, Upload } from "lucide-react"
// import { MDXEditor } from "@/components/mdx/mdx-editor"

// interface Chapter {
//   _id: string
//   title: string
//   courseId: string
// }

// interface Lesson {
//   _id: string
//   title: string
//   description: string
//   videoUrl: string
//   duration: number
//   isFree: boolean
//   content: string
//   chapterId: string
//   order: number
// }

// export default function AdminLessons() {
//   const router = useRouter()
//   const [chapters, setChapters] = useState<Chapter[]>([])
//   const [lessons, setLessons] = useState<Lesson[]>([])
//   const [selectedChapter, setSelectedChapter] = useState<string>("")
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isDeleting, setIsDeleting] = useState(false)
//   const [isUploading, setIsUploading] = useState(false)
//   const [uploadProgress, setUploadProgress] = useState(0)
//   const [openDialog, setOpenDialog] = useState(false)
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
//   const [editMode, setEditMode] = useState(false)
//   const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     videoUrl: "",
//     duration: 0,
//     isFree: false,
//     content: "",
//     chapterId: "",
//     order: 0,
//   })

//   useEffect(() => {
//     fetchChapters()
//   }, [])

//   useEffect(() => {
//     if (selectedChapter) {
//       fetchLessons(selectedChapter)
//     }
//   }, [selectedChapter])

//   const fetchChapters = async () => {
//     try {
//       const response = await fetch("/api/courses/chapters")
//       const data = await response.json()
//       setChapters(data)
//       setIsLoading(false)
//       if (data.length > 0) {
//         setSelectedChapter(data[0]._id)
//       }
//     } catch (error) {
//       console.error("Error fetching chapters:", error)
//       toast({
//         title: "Error",
//         description: "Failed to fetch chapters",
//         variant: "destructive",
//       })
//       setIsLoading(false)
//     }
//   }

//   const fetchLessons = async (chapterId: string) => {
//     try {
//       setIsLoading(true)
//       const response = await fetch(`/api/courses/chapters/${chapterId}/lessons`)
//       const data = await response.json()
//       setLessons(data)
//       setIsLoading(false)
//     } catch (error) {
//       console.error("Error fetching lessons:", error)
//       toast({
//         title: "Error",
//         description: "Failed to fetch lessons",
//         variant: "destructive",
//       })
//       setIsLoading(false)
//     }
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSwitchChange = (checked: boolean) => {
//     setFormData((prev) => ({ ...prev, isFree: checked }))
//   }

//   const handleSelectChange = (value: string) => {
//     setFormData((prev) => ({ ...prev, chapterId: value }))
//   }

//   const handleContentChange = (content: string) => {
//     setFormData((prev) => ({ ...prev, content }))
//   }

//   const handleUploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     setIsUploading(true)
//     setUploadProgress(0)

//     const formData = new FormData()
//     formData.append("file", file)

//     try {
//       // Simulate upload progress
//       const interval = setInterval(() => {
//         setUploadProgress((prev) => {
//           if (prev >= 95) {
//             clearInterval(interval)
//             return 95
//           }
//           return prev + 5
//         })
//       }, 500)

//       // Replace with your actual video upload endpoint
//       const response = await fetch("/api/courses/upload-video", {
//         method: "POST",
//         body: formData,
//       })

//       clearInterval(interval)
//       setUploadProgress(100)

//       if (!response.ok) {
//         throw new Error("Failed to upload video")
//       }

//       const data = await response.json()
//       setFormData((prev) => ({
//         ...prev,
//         videoUrl: data.url,
//         duration: data.duration || 0,
//       }))

//       toast({
//         title: "Success",
//         description: "Video uploaded successfully",
//       })
//     } catch (error) {
//       console.error("Error uploading video:", error)
//       toast({
//         title: "Error",
//         description: "Failed to upload video",
//         variant: "destructive",
//       })
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)

//     try {
//       const url = editMode && currentLesson ? `/api/courses/lessons/${currentLesson._id}` : "/api/courses/lessons"

//       const method = editMode ? "PUT" : "POST"

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to save lesson")
//       }

//       toast({
//         title: "Success",
//         description: `Lesson ${editMode ? "updated" : "created"} successfully`,
//       })

//       setOpenDialog(false)
//       resetForm()
//       fetchLessons(selectedChapter)
//       router.refresh()
//     } catch (error) {
//       console.error("Error saving lesson:", error)
//       toast({
//         title: "Error",
//         description: `Failed to ${editMode ? "update" : "create"} lesson`,
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleDelete = async () => {
//     if (!currentLesson) return

//     setIsDeleting(true)

//     try {
//       const response = await fetch(`/api/courses/lessons/${currentLesson._id}`, {
//         method: "DELETE",
//       })

//       if (!response.ok) {
//         throw new Error("Failed to delete lesson")
//       }

//       toast({
//         title: "Success",
//         description: "Lesson deleted successfully",
//       })

//       setOpenDeleteDialog(false)
//       fetchLessons(selectedChapter)
//       router.refresh()
//     } catch (error) {
//       console.error("Error deleting lesson:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete lesson",
//         variant: "destructive",
//       })
//     } finally {
//       setIsDeleting(false)
//     }
//   }

//   const handleEdit = (lesson: Lesson) => {
//     setCurrentLesson(lesson)
//     setFormData({
//       title: lesson.title,
//       description: lesson.description,
//       videoUrl: lesson.videoUrl,
//       duration: lesson.duration,
//       isFree: lesson.isFree,
//       content: lesson.content,
//       chapterId: lesson.chapterId,
//       order: lesson.order,
//     })
//     setEditMode(true)
//     setOpenDialog(true)
//   }

//   const handleAdd = () => {
//     resetForm()
//     setFormData((prev) => ({ ...prev, chapterId: selectedChapter }))
//     setEditMode(false)
//     setOpenDialog(true)
//   }

//   const resetForm = () => {
//     setFormData({
//       title: "",
//       description: "",
//       videoUrl: "",
//       duration: 0,
//       isFree: false,
//       content: "",
//       chapterId: selectedChapter,
//       order: lessons.length + 1,
//     })
//     setCurrentLesson(null)
//   }

//   const formatDuration = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60)
//     const remainingSeconds = seconds % 60
//     return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
//   }

//   if (isLoading && chapters.length === 0) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Lessons</CardTitle>
//           <CardDescription>Loading chapters...</CardDescription>
//         </CardHeader>
//       </Card>
//     )
//   }

//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between">
//         <div>
//           <CardTitle>Lessons</CardTitle>
//           <CardDescription>Manage your course lessons</CardDescription>
//         </div>
//         <Button onClick={handleAdd}>
//           <Plus className="mr-2 h-4 w-4" />
//           Add Lesson
//         </Button>
//       </CardHeader>
//       <CardContent>
//         <div className="mb-6">
//           <Label htmlFor="chapter">Select Chapter</Label>
//           <Select value={selectedChapter} onValueChange={(value) => setSelectedChapter(value)}>
//             <SelectTrigger id="chapter">
//               <SelectValue placeholder="Select a chapter" />
//             </SelectTrigger>
//             <SelectContent>
//               {chapters.map((chapter) => (
//                 <SelectItem key={chapter._id} value={chapter._id}>
//                   {chapter.title}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {isLoading ? (
//           <div>Loading lessons...</div>
//         ) : (
//           <Table>
//             <TableCaption>List of lessons for the selected chapter</TableCaption>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Order</TableHead>
//                 <TableHead>Title</TableHead>
//                 <TableHead>Duration</TableHead>
//                 <TableHead>Free</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {lessons.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={5} className="text-center">
//                     No lessons found for this chapter
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 lessons.map((lesson) => (
//                   <TableRow key={lesson._id}>
//                     <TableCell>{lesson.order}</TableCell>
//                     <TableCell>{lesson.title}</TableCell>
//                     <TableCell>{formatDuration(lesson.duration)}</TableCell>
//                     <TableCell>{lesson.isFree ? "Yes" : "No"}</TableCell>
//                     <TableCell className="text-right">
//                       <Button variant="ghost" size="icon" onClick={() => handleEdit(lesson)}>
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => {
//                           setCurrentLesson(lesson)
//                           setOpenDeleteDialog(true)
//                         }}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         )}
//       </CardContent>

//       <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>{editMode ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
//             <DialogDescription>
//               {editMode ? "Update the details of your lesson" : "Fill in the details to create a new lesson"}
//             </DialogDescription>
//           </DialogHeader>
//           <form onSubmit={handleSubmit}>
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="col-span-2">
//                   <Label htmlFor="title">Title</Label>
//                   <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
//                 </div>
//                 <div className="col-span-2">
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea
//                     id="description"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     rows={3}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="chapter-select">Chapter</Label>
//                   <Select value={formData.chapterId} onValueChange={handleSelectChange}>
//                     <SelectTrigger id="chapter-select">
//                       <SelectValue placeholder="Select a chapter" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {chapters.map((chapter) => (
//                         <SelectItem key={chapter._id} value={chapter._id}>
//                           {chapter.title}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label htmlFor="order">Order</Label>
//                   <Input
//                     id="order"
//                     name="order"
//                     type="number"
//                     value={formData.order}
//                     onChange={handleInputChange}
//                     min={1}
//                   />
//                 </div>
//                 <div className="col-span-2">
//                   <Label htmlFor="video">Video</Label>
//                   <div className="flex items-center gap-2">
//                     <Input
//                       id="videoUrl"
//                       name="videoUrl"
//                       value={formData.videoUrl}
//                       onChange={handleInputChange}
//                       placeholder="Video URL"
//                     />
//                     <div className="relative">
//                       <Input
//                         id="video-upload"
//                         type="file"
//                         accept="video/*"
//                         onChange={handleUploadVideo}
//                         className="hidden"
//                         disabled={isUploading}
//                       />
//                       <Button
//                         type="button"
//                         variant="outline"
//                         onClick={() => document.getElementById("video-upload")?.click()}
//                         disabled={isUploading}
//                       >
//                         <Upload className="h-4 w-4 mr-2" />
//                         {isUploading ? `Uploading ${uploadProgress}%` : "Upload"}
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor="duration">Duration (seconds)</Label>
//                   <Input
//                     id="duration"
//                     name="duration"
//                     type="number"
//                     value={formData.duration}
//                     onChange={handleInputChange}
//                     min={0}
//                   />
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Switch id="isFree" checked={formData.isFree} onCheckedChange={handleSwitchChange} />
//                   <Label htmlFor="isFree">Free Preview</Label>
//                 </div>
//                 <div className="col-span-2">
//                   <Label htmlFor="content">Content</Label>
//                   <div className="mt-2 border rounded-md">
//                     <MDXEditor
//                       value={formData.content}
//                       onChange={handleContentChange}
//                       placeholder="Write your lesson content here..."
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isSubmitting}>
//                 {isSubmitting ? "Saving..." : "Save"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete the lesson and remove it from the chapter.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
//               {isDeleting ? "Deleting..." : "Delete"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </Card>
//   )
// }

"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  FileText,
  GripVertical,
  Edit,
  Trash,
  Plus,
  Video,
  MoreHorizontal,
  Lock,
  Unlock,
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Lesson {
  _id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  duration: string;
  isFree: boolean;
  order: number;
}

interface Chapter {
  _id: string;
  title: string;
  isFree: boolean;
}

interface Course {
  _id: string;
  title: string;
}

const lessonFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  videoUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  duration: z.string().min(1, "Duration is required"),
  isFree: z.boolean().default(false),
});

interface AdminLessonsProps {
  courseId: string;
  chapterId: string;
}

export function AdminLessons({ courseId, chapterId }: AdminLessonsProps) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const form = useForm<z.infer<typeof lessonFormSchema>>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      duration: "",
      isFree: false,
    },
  });

  useEffect(() => {
    fetchCourse();
    fetchChapter();
    fetchLessons();
  }, [courseId, chapterId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) throw new Error("Failed to fetch course");
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course:", error);
      toast({
        title: "Error",
        description: "Failed to load course details",
        variant: "destructive",
      });
    }
  };

  const fetchChapter = async () => {
    try {
      const response = await fetch(`/api/courses/chapters/${chapterId}`);
      if (!response.ok) throw new Error("Failed to fetch chapter");
      const data = await response.json();
      setChapter(data);
    } catch (error) {
      console.error("Error fetching chapter:", error);
      toast({
        title: "Error",
        description: "Failed to load chapter details",
        variant: "destructive",
      });
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await fetch(
        `/api/courses/chapters/${chapterId}/lessons`
      );
      if (!response.ok) throw new Error("Failed to fetch lessons");
      const data = await response.json();
      setLessons(data);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast({
        title: "Error",
        description: "Failed to load lessons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = async (
    values: z.infer<typeof lessonFormSchema>
  ) => {
    try {
      const response = await fetch(
        `/api/courses/chapters/${chapterId}/lessons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            order: lessons.length,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create lesson");

      const newLesson = await response.json();
      setLessons([...lessons, newLesson]);
      setOpenDialog(false);
      resetForm();

      toast({
        title: "Success",
        description: "Lesson created successfully",
      });
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast({
        title: "Error",
        description: "Failed to create lesson",
        variant: "destructive",
      });
    }
  };

  const handleUpdateLesson = async (
    values: z.infer<typeof lessonFormSchema>
  ) => {
    if (!editingLesson) return;

    try {
      const response = await fetch(
        `/api/courses/lessons/${editingLesson._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) throw new Error("Failed to update lesson");

      const updatedLesson = await response.json();
      setLessons(
        lessons.map((lesson) =>
          lesson._id === updatedLesson._id
            ? { ...lesson, ...updatedLesson }
            : lesson
        )
      );
      setOpenDialog(false);
      resetForm();

      toast({
        title: "Success",
        description: "Lesson updated successfully",
      });
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast({
        title: "Error",
        description: "Failed to update lesson",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/lessons/${lessonId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete lesson");

      setLessons(lessons.filter((lesson) => lesson._id !== lessonId));

      toast({
        title: "Success",
        description: "Lesson deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast({
        title: "Error",
        description: "Failed to delete lesson",
        variant: "destructive",
      });
    }
  };

  const handleReorderLessons = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(lessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setLessons(updatedItems);

    // Save the new order to the server
    try {
      await fetch(`/api/courses/chapters/${chapterId}/lessons/order`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonsOrder: updatedItems.map((lesson) => ({
            id: lesson._id,
            order: lesson.order,
          })),
        }),
      });
    } catch (error) {
      console.error("Error updating lesson order:", error);
      toast({
        title: "Error",
        description: "Failed to update lesson order",
        variant: "destructive",
      });
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingVideo(true);

    try {
      const response = await fetch("/api/upload/lesson-video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload video");

      const data = await response.json();
      form.setValue("videoUrl", data.url);

      toast({
        title: "Success",
        description: "Video uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading video:", error);
      toast({
        title: "Error",
        description: "Failed to upload video",
        variant: "destructive",
      });
    } finally {
      setUploadingVideo(false);
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setEditingLesson(null);
    setOpenDialog(true);
  };

  const openEditDialog = (lesson: Lesson) => {
    setEditingLesson(lesson);
    form.reset({
      title: lesson.title,
      description: lesson.description || "",
      videoUrl: lesson.videoUrl || "",
      duration: lesson.duration,
      isFree: lesson.isFree,
    });
    setOpenDialog(true);
  };

  const resetForm = () => {
    form.reset({
      title: "",
      description: "",
      videoUrl: "",
      duration: "",
      isFree: false,
    });
    setEditingLesson(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <Skeleton className="h-8 w-[300px]" />
            <Skeleton className="mt-1 h-4 w-[400px]" />
          </div>
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[100px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">
            Lessons for {chapter?.title} in {course?.title}
          </h2>
          <p className="text-muted-foreground">
            Manage lessons for this chapter
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/courses/${courseId}/chapters`)}
          >
            Back to Chapters
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lesson
          </Button>
        </div>
      </div>

      {lessons.length === 0 ? (
        <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">No lessons yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Get started by creating your first lesson
          </p>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lesson
          </Button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleReorderLessons}>
          <Droppable droppableId="lessons">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {lessons.map((lesson, index) => (
                  <Draggable
                    key={lesson._id}
                    draggableId={lesson._id}
                    index={index}
                  >
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="border-2"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-move rounded-md p-1 hover:bg-muted"
                              >
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                  Lesson {index + 1}: {lesson.title}
                                  {(lesson.isFree || chapter?.isFree) && (
                                    <Badge
                                      variant="outline"
                                      className="ml-2 bg-green-50 text-green-700"
                                    >
                                      Free
                                    </Badge>
                                  )}
                                </CardTitle>
                                {lesson.description && (
                                  <CardDescription className="mt-1">
                                    {lesson.description}
                                  </CardDescription>
                                )}
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => openEditDialog(lesson)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Lesson
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteLesson(lesson._id)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete Lesson
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Duration: {lesson.duration}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {lesson.isFree || chapter?.isFree ? (
                                <>
                                  <Unlock className="h-4 w-4 text-green-600" />
                                  <span className="text-sm text-green-600">
                                    Free access
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    Premium
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => openEditDialog(lesson)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Lesson
                          </Button>
                        </CardFooter>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? "Edit Lesson" : "Create Lesson"}
            </DialogTitle>
            <DialogDescription>
              {editingLesson
                ? "Update the details of this lesson"
                : "Add a new lesson to your chapter"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                editingLesson ? handleUpdateLesson : handleCreateLesson
              )}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>The title of this lesson.</FormDescription>
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
                      <Textarea rows={3} {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>
                      Optional description of what this lesson covers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Video</FormLabel>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      disabled={uploadingVideo}
                    />
                    {uploadingVideo && (
                      <p className="text-sm text-muted-foreground">
                        Uploading...
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload a video file or enter a URL below.
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>
                      URL to the video for this lesson.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 10:30" />
                    </FormControl>
                    <FormDescription>
                      The duration of this lesson (e.g., 10:30).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Free Lesson</FormLabel>
                      <FormDescription>
                        Make this lesson available for free preview.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={chapter?.isFree}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {chapter?.isFree && (
                <p className="text-sm text-muted-foreground">
                  This lesson is part of a free chapter and will be available
                  for free.
                </p>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploadingVideo}>
                  {editingLesson ? "Update Lesson" : "Create Lesson"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
