// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   CreditCard,
//   Search,
//   Filter,
//   Download,
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

// interface User {
//   _id: string;
//   name: string;
//   email: string;
// }

// interface Course {
//   _id: string;
//   title: string;
// }

// interface Payment {
//   _id: string;
//   userId: string;
//   courseId: string;
//   amount: number;
//   currency: string;
//   status: "pending" | "completed" | "failed" | "refunded";
//   paymentMethod: string;
//   transactionId: string;
//   createdAt: string;
//   user: User;
//   course: Course;
// }

// export function AdminPayments() {
//   const router = useRouter();
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [pendingRevenue, setPendingRevenue] = useState(0);

//   useEffect(() => {
//     fetchPayments();
//   }, []);

//   useEffect(() => {
//     filterPayments();
//   }, [payments, searchTerm, statusFilter]);

//   const fetchPayments = async () => {
//     try {
//       const response = await fetch("/api/courses/payments");
//       if (!response.ok) throw new Error("Failed to fetch payments");
//       const data = await response.json();
//       setPayments(data);
//       setFilteredPayments(data);

//       // Calculate revenue
//       const completed = data.filter((p: Payment) => p.status === "completed");
//       const pending = data.filter((p: Payment) => p.status === "pending");

//       setTotalRevenue(
//         completed.reduce((sum: number, p: Payment) => sum + p.amount, 0)
//       );

//       setPendingRevenue(
//         pending.reduce((sum: number, p: Payment) => sum + p.amount, 0)
//       );
//     } catch (error) {
//       console.error("Error fetching payments:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load payments",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterPayments = () => {
//     let filtered = [...payments];

//     // Apply search filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (payment) =>
//           payment.user.name.toLowerCase().includes(term) ||
//           payment.user.email.toLowerCase().includes(term) ||
//           payment.course.title.toLowerCase().includes(term) ||
//           payment.transactionId.toLowerCase().includes(term)
//       );
//     }

//     // Apply status filter
//     if (statusFilter !== "all") {
//       filtered = filtered.filter((payment) => payment.status === statusFilter);
//     }

//     setFilteredPayments(filtered);
//   };

//   const handleUpdatePaymentStatus = async (
//     paymentId: string,
//     newStatus: string
//   ) => {
//     try {
//       const response = await fetch(
//         `/api/courses/payments/${paymentId}/status`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );

//       if (!response.ok) throw new Error("Failed to update payment status");

//       // Update the payment in the state
//       const updatedPayments = payments.map((payment) =>
//         payment._id === paymentId ? { ...payment, status: newStatus } : payment
//       );

//       setPayments(updatedPayments);

//       toast({
//         title: "Success",
//         description: "Payment status updated successfully",
//       });
//     } catch (error) {
//       console.error("Error updating payment status:", error);
//       toast({
//         title: "Error",
//         description: "Failed to update payment status",
//         variant: "destructive",
//       });
//     }
//   };

//   const exportToCSV = () => {
//     // Create CSV content
//     const headers = [
//       "Student",
//       "Email",
//       "Course",
//       "Amount",
//       "Currency",
//       "Payment Method",
//       "Transaction ID",
//       "Date",
//       "Status",
//     ];
//     const rows = filteredPayments.map((payment) => [
//       payment.user.name,
//       payment.user.email,
//       payment.course.title,
//       payment.amount.toFixed(2),
//       payment.currency,
//       payment.paymentMethod,
//       payment.transactionId,
//       new Date(payment.createdAt).toLocaleDateString(),
//       payment.status,
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
//     link.setAttribute("download", "payments.csv");
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

//   const formatCurrency = (amount: number, currency: string) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: currency || "USD",
//     }).format(amount);
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "completed":
//         return <CheckCircle className="h-4 w-4 text-green-500" />;
//       case "pending":
//         return <Clock className="h-4 w-4 text-yellow-500" />;
//       case "failed":
//       case "refunded":
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
//       case "pending":
//         return (
//           <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
//             Pending
//           </Badge>
//         );
//       case "failed":
//         return (
//           <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
//             Failed
//           </Badge>
//         );
//       case "refunded":
//         return (
//           <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
//             Refunded
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
//           <h2 className="text-2xl font-bold">Payments</h2>
//           <p className="text-muted-foreground">
//             Manage and track all course payments
//           </p>
//         </div>
//         <Button variant="outline" onClick={exportToCSV}>
//           <Download className="mr-2 h-4 w-4" />
//           Export CSV
//         </Button>
//       </div>

//       <div className="grid gap-4 md:grid-cols-3">
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Total Revenue
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {formatCurrency(totalRevenue, "USD")}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               From {payments.filter((p) => p.status === "completed").length}{" "}
//               successful payments
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Pending Revenue
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {formatCurrency(pendingRevenue, "USD")}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               From {payments.filter((p) => p.status === "pending").length}{" "}
//               pending payments
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Total Transactions
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{payments.length}</div>
//             <p className="text-xs text-muted-foreground">
//               Across {new Set(payments.map((p) => p.courseId)).size} courses
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div className="flex flex-1 items-center gap-2">
//           <div className="relative flex-1">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search by student, course, or transaction ID..."
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
//               <SelectItem value="completed">Completed</SelectItem>
//               <SelectItem value="pending">Pending</SelectItem>
//               <SelectItem value="failed">Failed</SelectItem>
//               <SelectItem value="refunded">Refunded</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Payment History</CardTitle>
//           <CardDescription>
//             {filteredPayments.length}{" "}
//             {filteredPayments.length === 1 ? "payment" : "payments"} found
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {filteredPayments.length === 0 ? (
//             <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
//               <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
//               <h3 className="mb-2 text-lg font-medium">No payments found</h3>
//               <p className="text-sm text-muted-foreground">
//                 {searchTerm || statusFilter !== "all"
//                   ? "Try adjusting your search or filters"
//                   : "No payment records available"}
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="border-b">
//                     <th className="px-4 py-3 text-left font-medium">Student</th>
//                     <th className="px-4 py-3 text-left font-medium">Course</th>
//                     <th className="px-4 py-3 text-left font-medium">Amount</th>
//                     <th className="px-4 py-3 text-left font-medium">Method</th>
//                     <th className="px-4 py-3 text-left font-medium">Date</th>
//                     <th className="px-4 py-3 text-left font-medium">Status</th>
//                     <th className="px-4 py-3 text-right font-medium">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredPayments.map((payment) => (
//                     <tr key={payment._id} className="border-b">
//                       <td className="px-4 py-3">
//                         <div>
//                           <div className="font-medium">{payment.user.name}</div>
//                           <div className="text-sm text-muted-foreground">
//                             {payment.user.email}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">{payment.course.title}</td>
//                       <td className="px-4 py-3">
//                         {formatCurrency(payment.amount, payment.currency)}
//                       </td>
//                       <td className="px-4 py-3 capitalize">
//                         {payment.paymentMethod}
//                       </td>
//                       <td className="px-4 py-3">
//                         {formatDate(payment.createdAt)}
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2">
//                           {getStatusIcon(payment.status)}
//                           {getStatusBadge(payment.status)}
//                         </div>
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
//                                 setSelectedPayment(payment);
//                                 setOpenDetailsDialog(true);
//                               }}
//                             >
//                               View Details
//                             </DropdownMenuItem>
//                             {payment.status === "pending" && (
//                               <DropdownMenuItem
//                                 onClick={() =>
//                                   handleUpdatePaymentStatus(
//                                     payment._id,
//                                     "completed"
//                                   )
//                                 }
//                               >
//                                 Mark as Completed
//                               </DropdownMenuItem>
//                             )}
//                             {payment.status === "completed" && (
//                               <DropdownMenuItem
//                                 onClick={() =>
//                                   handleUpdatePaymentStatus(
//                                     payment._id,
//                                     "refunded"
//                                   )
//                                 }
//                               >
//                                 Mark as Refunded
//                               </DropdownMenuItem>
//                             )}
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

//       {/* Payment Details Dialog */}
//       <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Payment Details</DialogTitle>
//             <DialogDescription>
//               Detailed information about this payment
//             </DialogDescription>
//           </DialogHeader>

//           {selectedPayment && (
//             <div className="space-y-4">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div>
//                   <h3 className="text-sm font-medium text-muted-foreground">
//                     Student
//                   </h3>
//                   <p className="font-medium">{selectedPayment.user.name}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {selectedPayment.user.email}
//                   </p>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-medium text-muted-foreground">
//                     Course
//                   </h3>
//                   <p className="font-medium">{selectedPayment.course.title}</p>
//                 </div>
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div>
//                   <h3 className="text-sm font-medium text-muted-foreground">
//                     Amount
//                   </h3>
//                   <p className="font-medium">
//                     {formatCurrency(
//                       selectedPayment.amount,
//                       selectedPayment.currency
//                     )}
//                   </p>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-medium text-muted-foreground">
//                     Payment Method
//                   </h3>
//                   <p className="capitalize">{selectedPayment.paymentMethod}</p>
//                 </div>
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div>
//                   <h3 className="text-sm font-medium text-muted-foreground">
//                     Transaction ID
//                   </h3>
//                   <p className="font-mono text-sm">
//                     {selectedPayment.transactionId}
//                   </p>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-medium text-muted-foreground">
//                     Date
//                   </h3>
//                   <p>{formatDate(selectedPayment.createdAt)}</p>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-sm font-medium text-muted-foreground">
//                   Status
//                 </h3>
//                 <div className="mt-1">
//                   {getStatusBadge(selectedPayment.status)}
//                 </div>
//               </div>

//               {selectedPayment.status === "pending" && (
//                 <div className="flex justify-end gap-2">
//                   <Button
//                     variant="outline"
//                     onClick={() =>
//                       handleUpdatePaymentStatus(selectedPayment._id, "failed")
//                     }
//                   >
//                     Mark as Failed
//                   </Button>
//                   <Button
//                     onClick={() =>
//                       handleUpdatePaymentStatus(
//                         selectedPayment._id,
//                         "completed"
//                       )
//                     }
//                   >
//                     Mark as Completed
//                   </Button>
//                 </div>
//               )}

//               {selectedPayment.status === "completed" && (
//                 <div className="flex justify-end">
//                   <Button
//                     variant="outline"
//                     onClick={() =>
//                       handleUpdatePaymentStatus(selectedPayment._id, "refunded")
//                     }
//                   >
//                     Mark as Refunded
//                   </Button>
//                 </div>
//               )}
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
import { DollarSign, Search } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface Payment {
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
  paymentMethod: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentId?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export function AdminPayments() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [courses, setCourses] = useState<{ _id: string; title: string }[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");

  useEffect(() => {
    fetchPayments();
    fetchCourses();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/admin/payments");
      if (!response.ok) throw new Error("Failed to fetch payments");
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast({
        title: "Error",
        description: "Failed to load payments",
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

  const getStatusBadge = (status: string) => {
    switch (status) {
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

  const openUpdateDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setNewStatus(payment.status);
    setTransactionId(payment.transactionId || "");
    setOpenDialog(true);
  };

  const handleUpdatePaymentStatus = async () => {
    if (!selectedPayment) return;

    try {
      const response = await fetch(
        `/api/courses/payments/${selectedPayment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            transactionId: transactionId || undefined,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update payment status");

      const updatedPayment = await response.json();

      // Update the payments list
      setPayments(
        payments.map((payment) =>
          payment._id === updatedPayment._id ? updatedPayment : payment
        )
      );

      setOpenDialog(false);
      toast({
        title: "Success",
        description: "Payment status updated successfully",
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      searchTerm === "" ||
      payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.transactionId &&
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;

    const matchesCourse =
      courseFilter === "all" || payment.course._id === courseFilter;

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
          <h2 className="text-2xl font-bold">Payment Transactions</h2>
          <p className="text-muted-foreground">
            Manage course payment transactions
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search payments..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
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
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>
            Showing {filteredPayments.length} of {payments.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <DollarSign className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No payments yet</h3>
              <p className="text-sm text-muted-foreground">
                Payment transactions will appear here when students purchase
                courses
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {payment.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{payment.course.title}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                      <TableCell>
                        {payment.transactionId || (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(payment.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openUpdateDialog(payment)}
                        >
                          Update
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

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
            <DialogDescription>
              Update the status and transaction details for this payment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Transaction ID</label>
              <Input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Enter the transaction ID from the payment provider
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePaymentStatus}>Update Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
