// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Badge } from "@/components/ui/badge"
// import { Skeleton } from "@/components/ui/skeleton"
// import { toast } from "@/components/ui/use-toast"
// import { Plus, MoreVertical, Pencil, Trash2, ArrowLeft, FileText } from "lucide-react"

// interface Chapter {
//   _id: string
//   title: string
//   description: string
//   isPublished: boolean
//   order: number
//   lessonsCount: number
// }

// interface Course {
//   _id: string
//   title: string
// }

// export default function AdminChapters({ courseId }: { courseId: string }) {
//   const router = useRouter()
//   const [chapters, setChapters] = useState<Chapter[]>([])
//   const [course, setCourse] = useState<Course | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [isAddingChapter, setIsAddingChapter] = useState(false)
//   const [isEditingChapter, setIsEditingChapter] = useState(false)
//   const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     isPublished: false,
//   })

//   useEffect(() => {
//     fetchCourse()
//     fetchChapters()
//   }, [courseId])

//   const fetchCourse = async () => {
//     try {
//       const response = await fetch(`/api/courses/${courseId}`)
//       if (!response.ok) throw new Error("Failed to fetch course")
//       const data = await response.json()
//       setCourse(data)
//     } catch (error) {
//       console.error("Error fetching course:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load course details. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const fetchChapters = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch(`/api/courses/${courseId}/chapters`)
//       if (!response.ok) throw new Error("Failed to fetch chapters")
//       const data = await response.json()
//       setChapters(data)
//     } catch (error) {
//       console.error("Error fetching chapters:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load chapters. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSwitchChange = (name: string, checked: boolean) => {
//     setFormData((prev) => ({ ...prev, [name]: checked }))
//   }

//   const handleAddChapter = async () => {
//     try {
//       const response = await fetch(`/api/courses/${courseId}/chapters`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       })

//       if (!response.ok) throw new Error("Failed to add chapter")

//       toast({
//         title: "Success",
//         description: "Chapter added successfully!",
//       })

//       setIsAddingChapter(false)
//       resetForm()
//       fetchChapters()
//     } catch (error) {
//       console.error("Error adding chapter:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add chapter. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleEditChapter = async () => {
//     if (!selectedChapter) return

//     try {
//       const response = await fetch(`/api/courses/chapters/${selectedChapter._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       })

//       if (!response.ok) throw new Error("Failed to update chapter")

//       toast({
//         title: "Success",
//         description: "Chapter updated successfully!",
//       })

//       setIsEditingChapter(false)
//       resetForm()
//       fetchChapters()
//     } catch (error) {
//       console.error("Error updating chapter:", error)
//       toast({
//         title: "Error",
//         description: "Failed to update chapter. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleDeleteChapter = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this chapter? This action cannot be undone.")) {
//       return
//     }

//     try {
//       const response = await fetch(`/api/courses/chapters/${id}`, {
//         method: "DELETE",
//       })

//       if (!response.ok) throw new Error("Failed to delete chapter")

//       toast({
//         title: "Success",
//         description: "Chapter deleted successfully!",
//       })

//       fetchChapters()
//     } catch (error) {
//       console.error("Error deleting chapter:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete chapter. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const resetForm = () => {
//     setFormData({
//       title: "",
//       description: "",
//       isPublished: false,
//     })
//     setSelectedChapter(null)
//   }

//   const handleEditClick = (chapter: Chapter) => {
//     setSelectedChapter(chapter)
//     setFormData({
//       title: chapter.title,
//       description: chapter.description,
//       isPublished: chapter.isPublished,
//     })
//     setIsEditingChapter(true)
//   }

//   const handleManageLessons = (chapterId: string) => {
//     router.push(`/admin/courses/${courseId}/chapters/${chapterId}/lessons`)
//   }

//   const handleReorderChapters = async (id: string, direction: "up" | "down") => {
//     const currentIndex = chapters.findIndex((chapter) => chapter._id === id)
//     if ((direction === "up" && currentIndex === 0) || (direction === "down" && currentIndex === chapters.length - 1)) {
//       return
//     }

//     const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
//     const updatedChapters = [...chapters]
//     const [movedChapter] = updatedChapters.splice(currentIndex, 1)
//     updatedChapters.splice(newIndex, 0, movedChapter)

//     // Update the UI immediately for better UX
//     setChapters(updatedChapters)

//     try {
//       const response = await fetch(`/api/courses/${courseId}/chapters/reorder`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           chapterId: id,
//           newOrder: newIndex + 1, // Orders typically start at 1
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to reorder chapters")
//         // Revert the UI change if the API call fails
//         fetchChapters()
//       }
//     } catch (error) {
//       console.error("Error reordering chapters:", error)
//       toast({
//         title: "Error",
//         description: "Failed to reorder chapters. Please try again.",
//         variant: "destructive",
//       })
//       // Revert the UI change if there's an error
//       fetchChapters()
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <Button variant="outline" size="sm" onClick={() => router.push("/admin")} className="mb-2">
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back to Courses
//             </Button>
//             <CardTitle>Manage Chapters</CardTitle>
//             <CardDescription>{course ? `Course: ${course.title}` : "Loading course details..."}</CardDescription>
//           </div>
//           <Dialog open={isAddingChapter} onOpenChange={setIsAddingChapter}>
//             <DialogTrigger asChild>
//               <Button>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Add Chapter
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Add New Chapter</DialogTitle>
//                 <DialogDescription>Create a new chapter for this course.</DialogDescription>
//               </DialogHeader>
//               <div className="grid gap-4 py-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="title">Title</Label>
//                   <Input id="title" name="title" value={formData.title} onChange={handleInputChange} />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea
//                     id="description"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     rows={3}
//                   />
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Switch
//                     id="isPublished"
//                     checked={formData.isPublished}
//                     onCheckedChange={(checked) => handleSwitchChange("isPublished", checked)}
//                   />
//                   <Label htmlFor="isPublished">Publish</Label>
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button variant="outline" onClick={() => setIsAddingChapter(false)}>
//                   Cancel
//                 </Button>
//                 <Button onClick={handleAddChapter}>Add Chapter</Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {loading ? (
//           <div className="space-y-4">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="flex items-center space-x-4">
//                 <Skeleton className="h-12 w-12 rounded" />
//                 <div className="space-y-2">
//                   <Skeleton className="h-4 w-[250px]" />
//                   <Skeleton className="h-4 w-[200px]" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Order</TableHead>
//                   <TableHead>Title</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Lessons</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {chapters.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={6} className="text-center py-4">
//                       No chapters yet.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   chapters.map((chapter, index) => (
//                     <TableRow key={chapter._id}>
//                       <TableCell>{chapter.order}</TableCell>
//                       <TableCell>{chapter.title}</TableCell>
//                       <TableCell>{chapter.description}</TableCell>
//                       <TableCell>
//                         <Badge variant={chapter.isPublished ? "success" : "secondary"}>
//                           {chapter.isPublished ? "Published" : "Draft"}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>{chapter.lessonsCount}</TableCell>
//                       <TableCell className="text-right">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" className="h-8 w-8 p-0">
//                               <span className="sr-only">Open menu</span>
//                               <MoreVertical className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuItem onClick={() => handleEditClick(chapter)}>
//                               <Pencil className="mr-2 h-4 w-4" />
//                               Edit
//                             </DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => handleManageLessons(chapter._id)}>
//                               <FileText className="mr-2 h-4 w-4" />
//                               Manage Lessons
//                             </DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => handleDeleteChapter(chapter._id)}>
//                               <Trash2 className="mr-2 h-4 w-4" />
//                               Delete
//                             </DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => handleReorderChapters(chapter._id, "up")}>
//                               Reorder Up
//                             </DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => handleReorderChapters(chapter._id, "down")}>
//                               Reorder Down
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         )}
//       </CardContent>
//       <Dialog open={isEditingChapter} onOpenChange={setIsEditingChapter}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit Chapter</DialogTitle>
//             <DialogDescription>Edit the details of the selected chapter.</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="title">Title</Label>
//               <Input id="title" name="title" value={formData.title} onChange={handleInputChange} />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={3}
//               />
//             </div>
//             <div className="flex items-center space-x-2">
//               <Switch
//                 id="isPublished"
//                 checked={formData.isPublished}
//                 onCheckedChange={(checked) => handleSwitchChange("isPublished", checked)}
//               />
//               <Label htmlFor="isPublished">Publish</Label>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsEditingChapter(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleEditChapter}>Update Chapter</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </Card>
//   )
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Layers,
  GripVertical,
  Edit,
  Trash,
  Plus,
  FileText,
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

interface Chapter {
  _id: string;
  title: string;
  description?: string;
  isFree: boolean;
  order: number;
  lessonsCount: number;
}

interface Course {
  _id: string;
  title: string;
}

const chapterFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  isFree: z.boolean().default(false),
});

interface AdminChaptersProps {
  courseId: string;
}

export function AdminChapters({ courseId }: AdminChaptersProps) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  const form = useForm<z.infer<typeof chapterFormSchema>>({
    resolver: zodResolver(chapterFormSchema),
    defaultValues: {
      title: "",
      description: "",
      isFree: false,
    },
  });

  useEffect(() => {
    fetchCourse();
    fetchChapters();
  }, [courseId]);

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

  const fetchChapters = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/chapters`);
      if (!response.ok) throw new Error("Failed to fetch chapters");
      const data = await response.json();
      setChapters(data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
      toast({
        title: "Error",
        description: "Failed to load chapters",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChapter = async (
    values: z.infer<typeof chapterFormSchema>
  ) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/chapters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          order: chapters.length,
        }),
      });

      if (!response.ok) throw new Error("Failed to create chapter");

      const newChapter = await response.json();
      setChapters([...chapters, newChapter]);
      setOpenDialog(false);
      resetForm();

      toast({
        title: "Success",
        description: "Chapter created successfully",
      });
    } catch (error) {
      console.error("Error creating chapter:", error);
      toast({
        title: "Error",
        description: "Failed to create chapter",
        variant: "destructive",
      });
    }
  };

  const handleUpdateChapter = async (
    values: z.infer<typeof chapterFormSchema>
  ) => {
    if (!editingChapter) return;

    try {
      const response = await fetch(
        `/api/courses/chapters/${editingChapter._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) throw new Error("Failed to update chapter");

      const updatedChapter = await response.json();
      setChapters(
        chapters.map((chapter) =>
          chapter._id === updatedChapter._id
            ? { ...chapter, ...updatedChapter }
            : chapter
        )
      );
      setOpenDialog(false);
      resetForm();

      toast({
        title: "Success",
        description: "Chapter updated successfully",
      });
    } catch (error) {
      console.error("Error updating chapter:", error);
      toast({
        title: "Error",
        description: "Failed to update chapter",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this chapter? This will also delete all lessons in this chapter."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/chapters/${chapterId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete chapter");

      setChapters(chapters.filter((chapter) => chapter._id !== chapterId));

      toast({
        title: "Success",
        description: "Chapter deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting chapter:", error);
      toast({
        title: "Error",
        description: "Failed to delete chapter",
        variant: "destructive",
      });
    }
  };

  const handleReorderChapters = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setChapters(updatedItems);

    // Save the new order to the server
    try {
      await fetch(`/api/courses/${courseId}/chapters/order`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chaptersOrder: updatedItems.map((chapter) => ({
            id: chapter._id,
            order: chapter.order,
          })),
        }),
      });
    } catch (error) {
      console.error("Error updating chapter order:", error);
      toast({
        title: "Error",
        description: "Failed to update chapter order",
        variant: "destructive",
      });
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setEditingChapter(null);
    setOpenDialog(true);
  };

  const openEditDialog = (chapter: Chapter) => {
    setEditingChapter(chapter);
    form.reset({
      title: chapter.title,
      description: chapter.description || "",
      isFree: chapter.isFree,
    });
    setOpenDialog(true);
  };

  const resetForm = () => {
    form.reset({
      title: "",
      description: "",
      isFree: false,
    });
    setEditingChapter(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="mt-1 h-4 w-[300px]" />
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
          <h2 className="text-2xl font-bold">Chapters for {course?.title}</h2>
          <p className="text-muted-foreground">
            Manage chapters and their lessons for this course
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/courses`)}
          >
            Back to Courses
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Chapter
          </Button>
        </div>
      </div>

      {chapters.length === 0 ? (
        <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Layers className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">No chapters yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Get started by creating your first chapter
          </p>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Chapter
          </Button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleReorderChapters}>
          <Droppable droppableId="chapters">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {chapters.map((chapter, index) => (
                  <Draggable
                    key={chapter._id}
                    draggableId={chapter._id}
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
                                  Chapter {index + 1}: {chapter.title}
                                  {chapter.isFree && (
                                    <Badge
                                      variant="outline"
                                      className="ml-2 bg-green-50 text-green-700"
                                    >
                                      Free
                                    </Badge>
                                  )}
                                </CardTitle>
                                {chapter.description && (
                                  <CardDescription className="mt-1">
                                    {chapter.description}
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
                                  onClick={() => openEditDialog(chapter)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Chapter
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/admin/courses/${courseId}/chapters/${chapter._id}/lessons`
                                    )
                                  }
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  Manage Lessons
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteChapter(chapter._id)
                                  }
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete Chapter
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {chapter.lessonsCount}{" "}
                                {chapter.lessonsCount === 1
                                  ? "lesson"
                                  : "lessons"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {chapter.isFree ? (
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
                          <div className="flex w-full gap-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => openEditDialog(chapter)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              className="flex-1"
                              onClick={() =>
                                router.push(
                                  `/admin/courses/${courseId}/chapters/${chapter._id}/lessons`
                                )
                              }
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Lessons
                            </Button>
                          </div>
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
              {editingChapter ? "Edit Chapter" : "Create Chapter"}
            </DialogTitle>
            <DialogDescription>
              {editingChapter
                ? "Update the details of this chapter"
                : "Add a new chapter to your course"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                editingChapter ? handleUpdateChapter : handleCreateChapter
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
                    <FormDescription>
                      The title of this chapter.
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
                      <Textarea rows={3} {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>
                      Optional description of what this chapter covers.
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
                      <FormLabel className="text-base">Free Chapter</FormLabel>
                      <FormDescription>
                        Make this chapter available for free preview.
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

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingChapter ? "Update Chapter" : "Create Chapter"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
