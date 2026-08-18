// "use client";

// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Skeleton } from "@/components/ui/skeleton";
// import { CreditCard, Download, Search } from "lucide-react";

// interface Payment {
//   _id: string;
//   courseId: string;
//   amount: number;
//   currency: string;
//   status: "pending" | "completed" | "failed" | "refunded";
//   paymentMethod: string;
//   transactionId: string;
//   createdAt: string;
//   course: {
//     title: string;
//   };
// }

// interface PaymentHistoryProps {
//   userId: string;
// }

// export function PaymentHistory({ userId }: PaymentHistoryProps) {
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     fetchPayments();
//   }, [userId]);

//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = payments.filter(
//         (payment) =>
//           payment.course.title
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           payment.transactionId
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           payment.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredPayments(filtered);
//     } else {
//       setFilteredPayments(payments);
//     }
//   }, [searchTerm, payments]);

//   const fetchPayments = async () => {
//     try {
//       const response = await fetch(`/api/courses/payments/user/${userId}`);
//       if (!response.ok) throw new Error("Failed to fetch payments");
//       const data = await response.json();
//       setPayments(data);
//       setFilteredPayments(data);
//     } catch (error) {
//       console.error("Error fetching payments:", error);
//     } finally {
//       setLoading(false);
//     }
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

//   const exportToCSV = () => {
//     // Create CSV content
//     const headers = [
//       "Course",
//       "Amount",
//       "Payment Method",
//       "Transaction ID",
//       "Date",
//       "Status",
//     ];
//     const rows = filteredPayments.map((payment) => [
//       payment.course.title,
//       formatCurrency(payment.amount, payment.currency),
//       payment.paymentMethod,
//       payment.transactionId,
//       formatDate(payment.createdAt),
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
//     link.setAttribute("download", "payment_history.csv");
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading) {
//     return <Skeleton className="h-[400px] w-full" />;
//   }

//   return (
//     <Card>
//       <CardHeader className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
//         <div>
//           <CardTitle>Payment History</CardTitle>
//           <CardDescription>
//             {filteredPayments.length}{" "}
//             {filteredPayments.length === 1 ? "transaction" : "transactions"}{" "}
//             found
//           </CardDescription>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="relative w-full md:w-auto">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search transactions..."
//               className="pl-8 md:w-[200px]"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <Button variant="outline" size="sm" onClick={exportToCSV}>
//             <Download className="mr-2 h-4 w-4" />
//             Export
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {filteredPayments.length === 0 ? (
//           <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
//             <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
//             <h3 className="mb-2 text-lg font-medium">No payment history</h3>
//             <p className="text-sm text-muted-foreground">
//               {searchTerm
//                 ? "No transactions match your search"
//                 : "You haven't made any payments yet"}
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="border-b">
//                   <th className="px-4 py-3 text-left font-medium">Course</th>
//                   <th className="px-4 py-3 text-left font-medium">Amount</th>
//                   <th className="px-4 py-3 text-left font-medium">
//                     Payment Method
//                   </th>
//                   <th className="px-4 py-3 text-left font-medium">
//                     Transaction ID
//                   </th>
//                   <th className="px-4 py-3 text-left font-medium">Date</th>
//                   <th className="px-4 py-3 text-left font-medium">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredPayments.map((payment) => (
//                   <tr key={payment._id} className="border-b">
//                     <td className="px-4 py-3">{payment.course.title}</td>
//                     <td className="px-4 py-3">
//                       {formatCurrency(payment.amount, payment.currency)}
//                     </td>
//                     <td className="px-4 py-3 capitalize">
//                       {payment.paymentMethod}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className="font-mono text-sm">
//                         {payment.transactionId}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       {formatDate(payment.createdAt)}
//                     </td>
//                     <td className="px-4 py-3">
//                       {getStatusBadge(payment.status)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { DollarSign, Search } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Payment {
  _id: string;
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
}

export function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/user/payments");
      if (!response.ok) throw new Error("Failed to fetch payments");
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast({
        title: "Error",
        description: "Failed to load payment history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const filteredPayments = payments.filter((payment) => {
    return (
      searchTerm === "" ||
      payment.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.transactionId &&
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Payment History</h2>
        <p className="text-muted-foreground">
          Your course payment transactions
        </p>
      </div>

      {payments.length > 0 && (
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
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
      )}

      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>Your course payment history</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <DollarSign className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No payment history</h3>
              <p className="text-sm text-muted-foreground">
                Your payment transactions will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment._id}>
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
