// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Users,
//   Search,
//   Filter,
//   Download,
//   Plus,
//   MoreHorizontal,
//   CheckCircle,
//   XCircle,
//   Clock,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "@/components/ui/use-toast";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";

// interface User {
//   _id: string;
//   name: string;
//   email: string;
// }

// interface Course {
//   _id: string;
//   title: string;
// }

// interface Enrollment {
//   _id: string;
//   userId: string;
//   courseId: string;
//   enrollmentDate: string;
//   completionDate?: string;
//   progress: number;
//   status: "active" | "completed" | "expired";
//   paymentStatus: "free" | "pending" | "completed" | "refunded";
//   user: User;
//   course: Course;
// }

// const enrollmentFormSchema = z.object({
//   userId: z.string().min(1, "User is required"),
//   courseId: z.string().min(1, "Course is required"),
// });

// interface AdminEnrollmentsProps {
//   courseId?: string;
// }

// export function AdminEnrollments({ courseId }: AdminEnrollmentsProps) {
//   const router = useRouter();
//   const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
//   const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>(
//     []
//   );
//   const [users, setUsers] = useState<User[]>([]);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [openDialog, setOpenDialog] = useState(false);
//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//   const [selectedEnrollment, setSelectedEnrollment] =
//     useState<Enrollment | null>(null);

//   const form = useForm<z.infer<typeof enrollmentFormSchema>>({
//     resolver: zodResolver(enrollmentFormSchema),
//     defaultValues: {
//       userId: "",
//       courseId: courseId || "",
//     },
//   });

//   useEffect(() => {
//     fetchEnrollments();
//     fetchUsers();
//     if (!courseId) {
//       fetchCourses();
//     }
//   }, [courseId]);

//   useEffect(() => {
//     filterEnrollments();
//   }, [enrollments, searchTerm, statusFilter]);

//   const fetchEnrollments = async () => {
//     try {
//       const url = courseId
//         ? `/api/courses/${courseId}/enrollments`
//         : "/api/courses/enrollments";
//       const response = await fetch(url);
//       if (!response.ok) throw new Error("Failed to fetch enrollments");
//       const data = await response.json();
//       setEnrollments(data);
//       setFilteredEnrollments(data);
//     } catch (error) {
//       console.error("Error fetching enrollments:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load enrollments",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch("/api/users");
//       if (!response.ok) throw new Error("Failed to fetch users");
//       const data = await response.json();
//       setUsers(data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load users",
//         variant: "destructive",
//       });
//     }
//   };

//   const fetchCourses = async () => {
//     try {
//       const response = await fetch("/api/courses");
//       if (!response.ok) throw new Error("Failed to fetch courses");
//       const data = await response.json();
//       setCourses(data);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load courses",
//         variant: "destructive",
//       });
//     }
//   };

//   const filterEnrollments = () => {
//     let filtered = [...enrollments];

//     // Apply search filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (enrollment) =>
//           enrollment.user.name.toLowerCase().includes(term) ||
//           enrollment.user.email.toLowerCase().includes(term) ||
//           enrollment.course.title.toLowerCase().includes(term)
//       );
//     }

//     // Apply status filter
//     if (statusFilter !== "all") {
//       filtered = filtered.filter(
//         (enrollment) => enrollment.status === statusFilter
//       );
//     }

//     setFilteredEnrollments(filtered);
//   };

//   const handleCreateEnrollment = async (
//     values: z.infer<typeof enrollmentFormSchema>
//   ) => {
//     try {
//       const response = await fetch("/api/courses/enrollments", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(values),
//       });

//       if (!response.ok) throw new Error("Failed to create enrollment");

//       const newEnrollment = await response.json();
//       setEnrollments([...enrollments, newEnrollment]);
//       setOpenDialog(false);
//       form.reset();

//       toast({
//         title: "Success",
//         description: "Enrollment created successfully",
//       });
//     } catch (error) {
//       console.error("Error creating enrollment:", error);
//       toast({
//         title: "Error",
//         description: "Failed to create enrollment",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDeleteEnrollment = async (enrollmentId: string) => {
//     if (
//       !confirm(
//         "Are you sure you want to delete this enrollment? This will remove the student's access to the course."
//       )
//     ) {
//       return;
//     }

//     try {
//       const response = await fetch(`/api/courses/enrollments/${enrollmentId}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) throw new Error("Failed to delete enrollment");

//       setEnrollments(
//         enrollments.filter((enrollment) => enrollment._id !== enrollmentId)
//       );

//       toast({
//         title: "Success",
//         description: "Enrollment deleted successfully",
//       });
//     } catch (error) {
//       console.error("Error deleting enrollment:", error);
//       toast({
//         title: "Error",
//         description: "Failed to delete enrollment",
//         variant: "destructive",
//       });
//     }
//   };

//   const exportToCSV = () => {
//     // Create CSV content
//     const headers = [
//       "Student Name",
//       "Email",
//       "Course",
//       "Enrollment Date",
//       "Progress",
//       "Status",
//       "Payment Status",
//     ];
//     const rows = filteredEnrollments.map((enrollment) => [
//       enrollment.user.name,
//       enrollment.user.email,
//       enrollment.course.title,
//       new Date(enrollment.enrollmentDate).toLocaleDateString(),
//       `${enrollment.progress}%`,
//       enrollment.status,
//       enrollment.paymentStatus,
//     ]);

//     const csvContent = [
//       headers.join(","),
//       ...rows.map((row) => row.join(",")),
//     ].join("\n");

//     // Create and download the file
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", "enrollments.csv");
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "completed":
//         return <CheckCircle className="h-4 w-4 text-green-500" />;
//       case "active":
//         return <Clock className="h-4 w-4 text-blue-500" />;
//       case "expired":
//         return <XCircle className="h-4 w-4 text-red-500" />;
//       default:
//         return null;
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "completed":
//         return (
//           <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
//             Completed
//           </Badge>
//         );
//       case "active":
//         return (
//           <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
//             Active
//           </Badge>
//         );
//       case "expired":
//         return (
//           <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
//             Expired
//           </Badge>
//         );
//       default:
//         return <Badge variant="outline">{status}</Badge>;
//     }
//   };

//   const getPaymentStatusBadge = (status: string) => {
//     switch (status) {
//       case "completed":
//         return (
//           <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
//             Paid
//           </Badge>
//         );
//       case "pending":
//         return (
//           <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
//             Pending
//           </Badge>
//         );
//       case "refunded":
//         return (
//           <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
//             Refunded
//           </Badge>
//         );
//       case "free":
//         return (
//           <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
//             Free
//           </Badge>
//         );
//       default:
//         return <Badge variant="outline">{status}</Badge>;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="space-y-4">
//         <div className="flex justify-between">
//           <div>
//             <Skeleton className="h-8 w-[200px]" />
//             <Skeleton className="mt-1 h-4 w-[300px]" />
//           </div>
//           <Skeleton className="h-10 w-[150px]" />
//         </div>
//         <div className="space-y-4">
//           {[...Array(5)].map((_, i) => (
//             <Skeleton key={i} className="h-16 w-full" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <h2 className="text-2xl font-bold">
//             {courseId ? "Course Enrollments" : "All Enrollments"}
//           </h2>
//           <p className="text-muted-foreground">
//             {courseId
//               ? "Manage student enrollments for this course"
//               : "Manage all student enrollments across courses"}
//           </p>
//         </div>
//         <div className="flex gap-2">
//           {courseId && (
//             <Button
//               variant="outline"
//               onClick={() => router.push("/admin/courses")}
//             >
//               Back to Courses
//             </Button>
//           )}
//           <Button onClick={() => setOpenDialog(true)}>
//             <Plus className="mr-2 h-4 w-4" />
//             Add Enrollment
//           </Button>
//         </div>
//       </div>

//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div className="flex flex-1 items-center gap-2">
//           <div className="relative flex-1">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search by student or course..."
//               className="pl-8"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-[180px]">
//               <div className="flex items-center gap-2">
//                 <Filter className="h-4 w-4" />
//                 <SelectValue placeholder="Filter by status" />
//               </div>
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Statuses</SelectItem>
//               <SelectItem value="active">Active</SelectItem>
//               <SelectItem value="completed">Completed</SelectItem>
//               <SelectItem value="expired">Expired</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         <Button variant="outline" onClick={exportToCSV}>
//           <Download className="mr-2 h-4 w-4" />
//           Export CSV
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Enrollments</CardTitle>
//           <CardDescription>
//             {filteredEnrollments.length}{" "}
//             {filteredEnrollments.length === 1 ? "enrollment" : "enrollments"}{" "}
//             found
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {filteredEnrollments.length === 0 ? (
//             <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
//               <Users className="mb-4 h-12 w-12 text-muted-foreground" />
//               <h3 className="mb-2 text-lg font-medium">No enrollments found</h3>
//               <p className="mb-4 text-sm text-muted-foreground">
//                 {searchTerm || statusFilter !== "all"
//                   ? "Try adjusting your search or filters"
//                   : "Get started by adding a new enrollment"}
//               </p>
//               <Button onClick={() => setOpenDialog(true)}>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Add Enrollment
//               </Button>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="border-b">
//                     <th className="px-4 py-3 text-left font-medium">Student</th>
//                     <th className="px-4 py-3 text-left font-medium">Course</th>
//                     <th className="px-4 py-3 text-left font-medium">
//                       Enrolled
//                     </th>
//                     <th className="px-4 py-3 text-left font-medium">
//                       Progress
//                     </th>
//                     <th className="px-4 py-3 text-left font-medium">Status</th>
//                     <th className="px-4 py-3 text-left font-medium">Payment</th>
//                     <th className="px-4 py-3 text-right font-medium">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredEnrollments.map((enrollment) => (
//                     <tr key={enrollment._id} className="border-b">
//                       <td className="px-4 py-3">
//                         <div>
//                           <div className="font-medium">
//                             {enrollment.user.name}
//                           </div>
//                           <div className="text-sm text-muted-foreground">
//                             {enrollment.user.email}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">{enrollment.course.title}</td>
//                       <td className="px-4 py-3">
//                         {formatDate(enrollment.enrollmentDate)}
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2">
//                           <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
//                             <div
//                               className="h-full bg-blue-500"
//                               style={{ width: `${enrollment.progress}%` }}
//                             />
//                           </div>
//                           <span>{enrollment.progress}%</span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2">
//                           {getStatusIcon(enrollment.status)}
//                           {getStatusBadge(enrollment.status)}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         {getPaymentStatusBadge(enrollment.paymentStatus)}
//                       </td>
//                       <td className="px-4 py-3 text-right">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="icon">
//                               <MoreHorizontal className="h-5 w-5" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem
//                               onClick={() => {
//                                 setSelectedEnrollment(enrollment);
//                                 setOpenDetailsDialog(true);
//                               }}
//                             >
//                               View Details
//                             </DropdownMenuItem>
//                             <DropdownMenuItem
//                               onClick={() =>
//                                 handleDeleteEnrollment(enrollment._id)
//                               }
//                               className="text-red-600 focus:text-red-600"
//                             >
//                               Delete Enrollment
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Add Enrollment Dialog */}
//       <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Add Enrollment</DialogTitle>
//             <DialogDescription>
//               Manually enroll a student in a course
//             </DialogDescription>
//           </DialogHeader>

//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleCreateEnrollment)}
//               className="space-y-4"
//             >
//               <FormField
//                 control={form.control}
//                 name="userId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Student</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                       value={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select a student" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {users.map((user) => (
//                           <SelectItem key={user._id} value={user._id}>
//                             {user.name} ({user.email})
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormDescription>
//                       The student to enroll in the course
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {!courseId && (
//                 <FormField
//                   control={form.control}
//                   name="courseId"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Course</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                         value={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select a course" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {courses.map((course) => (
//                             <SelectItem key={course._id} value={course._id}>
//                               {course.title}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormDescription>
//                         The course to enroll the student in
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               )}

//               <DialogFooter>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setOpenDialog(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit">Add Enrollment</Button>
//               </DialogFooter>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>

//       {/* Enrollment Details Dialog */}
//       <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Enrollment Details</DialogTitle>
//           </DialogHeader>

//           {selectedEnrollment && (
//             <div className="space-y-4">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div>
//                   <h3 className="text-sm font-medium text-muted-foreground">
//                     Student
//                   </h3>
//                   <p className="font-medium">{selectedEnrollment.user.name}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {selectedEnrollment.user.email}
//                   </p>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-medium text-muted-foreground">
//                     Course
//                   </h3>
//                   <p className="font-medium">
//                     {selectedEnrollment.course.title}
//                   </p>
//                 </div>
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div>
//                   <h3 className="text-sm font-medium text-muted-foreground">
//                     Enrollment Date
//                   </h3>
//                   <p>{formatDate(selectedEnrollment.enrollmentDate)}</p>
//                 </div>
//                 {selectedEnrollment.completionDate && (
//                   <div>
//                     <h3 className="text-sm font-medium text-muted-foreground">
//                       Completion Date
//                     </h3>
//                     <p>{formatDate(selectedEnrollment.completionDate)}</p>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <h3 className="text-sm font-medium text-muted-foreground">
//                   Progress
//                 </h3>
//                 <div className="mt-1 flex items-center gap-2">
//                   <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
//                     <div
//                       className="h-full bg-blue-500"
//                       style={{ width: `${selectedEnrollment.progress}%` }}
//                     />
//                   </div>
//                   <span className="min-w-[40px] text-right">
//                     {selectedEnrollment.progress}%
//                   </span>
//                 </div>
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div>
//                   <h3 className="text-sm font-medium text-muted-foreground">
//                     Status
//                   </h3>
//                   <div className="mt-1">
//                     {getStatusBadge(selectedEnrollment.status)}
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-medium text-muted-foreground">
//                     Payment Status
//                   </h3>
//                   <div className="mt-1">
//                     {getPaymentStatusBadge(selectedEnrollment.paymentStatus)}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Enrollment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  course: {
    _id: string;
    title: string;
    slug: string;
  };
  progress: {
    lesson: string;
    completed: boolean;
    watchedSeconds: number;
    lastPosition: number;
    completedAt?: string;
  }[];
  completedAt?: string;
  paymentStatus: "free" | "pending" | "completed" | "failed" | "refunded";
  paymentMethod?: string;
  paymentId?: string;
  transactionId?: string;
  amount?: number;
  createdAt: string;
  updatedAt: string;
}

export function AdminEnrollments() {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [courses, setCourses] = useState<{ _id: string; title: string }[]>([]);

  useEffect(() => {
    fetchEnrollments();
    fetchCourses();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await fetch("/api/admin/enrollments");
      if (!response.ok) throw new Error("Failed to fetch enrollments");
      const data = await response.json();
      setEnrollments(data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      toast({
        title: "Error",
        description: "Failed to load enrollments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses");
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const getCompletionPercentage = (enrollment: Enrollment) => {
    if (enrollment.progress.length === 0) return 0;
    const completedLessons = enrollment.progress.filter(
      (p) => p.completed
    ).length;
    return Math.round((completedLessons / enrollment.progress.length) * 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "free":
        return <Badge variant="outline">Free</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "refunded":
        return <Badge variant="warning">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch =
      searchTerm === "" ||
      enrollment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.course.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      enrollment.paymentStatus === statusFilter ||
      (statusFilter === "completed" && enrollment.completedAt);

    const matchesCourse =
      courseFilter === "all" || enrollment.course._id === courseFilter;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold">Course Enrollments</h2>
          <p className="text-muted-foreground">Manage student enrollments</p>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search enrollments..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pending">Payment Pending</SelectItem>
              <SelectItem value="completed">Payment Completed</SelectItem>
              <SelectItem value="failed">Payment Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="course_completed">Course Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course._id} value={course._id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enrollments</CardTitle>
          <CardDescription>
            Showing {filteredEnrollments.length} of {enrollments.length}{" "}
            enrollments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No enrollments yet</h3>
              <p className="text-sm text-muted-foreground">
                Enrollments will appear here when students register for courses
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Enrollment Date</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnrollments.map((enrollment) => (
                    <TableRow key={enrollment._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {enrollment.user.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {enrollment.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{enrollment.course.title}</TableCell>
                      <TableCell>
                        {format(new Date(enrollment.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="mr-2 w-full max-w-[100px]">
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{
                                  width: `${getCompletionPercentage(
                                    enrollment
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                          <span>{getCompletionPercentage(enrollment)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(enrollment.paymentStatus)}
                      </TableCell>
                      <TableCell>
                        {enrollment.amount
                          ? `$${enrollment.amount.toFixed(2)}`
                          : "Free"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/admin/courses/enrollments/${enrollment._id}`
                            )
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
