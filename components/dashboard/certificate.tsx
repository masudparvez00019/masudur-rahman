// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { Award, Download, Search, ExternalLink } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "@/components/ui/use-toast";
// import { useRouter } from "next/navigation";

// interface Certificate {
//   _id: string;
//   courseId: string;
//   userId: string;
//   courseName: string;
//   issueDate: string;
//   certificateUrl: string;
//   certificateId: string;
//   thumbnailUrl: string;
// }

// export function Certificate() {
//   const [certificates, setCertificates] = useState<Certificate[]>([]);
//   const [filteredCertificates, setFilteredCertificates] = useState<
//     Certificate[]
//   >([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     fetchCertificates();
//   }, []);

//   useEffect(() => {
//     filterCertificates();
//   }, [certificates, searchTerm]);

//   const fetchCertificates = async () => {
//     try {
//       const response = await fetch("/api/user/certificates");
//       if (!response.ok) throw new Error("Failed to fetch certificates");
//       const data = await response.json();
//       setCertificates(data);
//       setFilteredCertificates(data);
//     } catch (error) {
//       console.error("Error fetching certificates:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load certificates",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterCertificates = () => {
//     if (!searchTerm) {
//       setFilteredCertificates(certificates);
//       return;
//     }

//     const term = searchTerm.toLowerCase();
//     const filtered = certificates.filter(
//       (certificate) =>
//         certificate.courseName.toLowerCase().includes(term) ||
//         certificate.certificateId.toLowerCase().includes(term)
//     );
//     setFilteredCertificates(filtered);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const downloadCertificate = async (certificate: Certificate) => {
//     try {
//       // Fetch the certificate PDF
//       const response = await fetch(certificate.certificateUrl);
//       const blob = await response.blob();

//       // Create a download link
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `${certificate.courseName.replace(
//         /\s+/g,
//         "_"
//       )}_Certificate.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Error downloading certificate:", error);
//       toast({
//         title: "Error",
//         description: "Failed to download certificate",
//         variant: "destructive",
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="space-y-4">
//         <Skeleton className="h-10 w-full max-w-sm" />
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {[...Array(3)].map((_, i) => (
//             <Skeleton key={i} className="h-[300px] w-full" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-4">
//         <div className="relative flex-1 max-w-sm">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search certificates..."
//             className="pl-8"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {filteredCertificates.length === 0 ? (
//         <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
//           <Award className="mb-4 h-12 w-12 text-muted-foreground" />
//           <h3 className="mb-2 text-lg font-medium">No certificates yet</h3>
//           <p className="mb-4 text-sm text-muted-foreground">
//             {searchTerm
//               ? "No certificates match your search"
//               : "Complete courses to earn certificates"}
//           </p>
//           <Button variant="outline" onClick={() => router.push("/courses")}>
//             Browse Courses
//           </Button>
//         </div>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {filteredCertificates.map((certificate) => (
//             <Card key={certificate._id} className="overflow-hidden">
//               <div className="relative h-48 w-full">
//                 <Image
//                   src={
//                     certificate.thumbnailUrl ||
//                     "/placeholder.svg?height=192&width=384"
//                   }
//                   alt={certificate.courseName}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <CardContent className="p-4">
//                 <h3 className="mb-1 text-lg font-semibold">
//                   {certificate.courseName}
//                 </h3>
//                 <p className="text-sm text-muted-foreground">
//                   Issued on {formatDate(certificate.issueDate)}
//                 </p>
//                 <p className="mt-2 text-xs text-muted-foreground">
//                   Certificate ID: {certificate.certificateId}
//                 </p>
//               </CardContent>
//               <CardFooter className="flex gap-2 p-4 pt-0">
//                 <Button
//                   variant="outline"
//                   className="flex-1"
//                   onClick={() =>
//                     window.open(certificate.certificateUrl, "_blank")
//                   }
//                 >
//                   <ExternalLink className="mr-2 h-4 w-4" />
//                   View
//                 </Button>
//                 <Button
//                   className="flex-1"
//                   onClick={() => downloadCertificate(certificate)}
//                 >
//                   <Download className="mr-2 h-4 w-4" />
//                   Download
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CertificateProps {
  userName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
}

export function Certificate({
  userName,
  courseName,
  completionDate,
  certificateId,
}: CertificateProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const formattedDate = new Date(completionDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const downloadAsPDF = async () => {
    if (!certificateRef.current) return;

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(
        imgData,
        "JPEG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`${courseName.replace(/\s+/g, "_")}_Certificate.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-white/20 p-4">
            <Image
              src="/placeholder.svg?height=64&width=64"
              alt="Certificate"
              width={64}
              height={64}
            />
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="mb-2 text-xl font-bold">{courseName}</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Completed on {formattedDate} • Certificate ID:{" "}
          {certificateId.substring(0, 8)}
        </p>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Course Completion Certificate</DialogTitle>
                <DialogDescription>
                  This certificate verifies that you have successfully completed
                  the course.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 overflow-auto p-1">
                <div
                  ref={certificateRef}
                  className="relative mx-auto aspect-[1.4/1] w-full max-w-3xl overflow-hidden rounded-lg border bg-white p-8"
                >
                  <div className="absolute inset-0 border-[12px] border-blue-100" />
                  <div className="absolute inset-4 border-2 border-blue-500" />

                  <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                    <div className="mb-2 text-xl font-semibold uppercase tracking-wider text-blue-600">
                      Certificate of Completion
                    </div>
                    <div className="mb-6 text-sm text-gray-500">
                      This certifies that
                    </div>
                    <div className="mb-2 text-3xl font-bold">{userName}</div>
                    <div className="mb-6 text-sm text-gray-500">
                      has successfully completed the course
                    </div>
                    <div className="mb-8 text-2xl font-bold text-blue-800">
                      {courseName}
                    </div>
                    <div className="mb-2 text-sm text-gray-500">
                      Completed on
                    </div>
                    <div className="mb-8 text-lg font-medium">
                      {formattedDate}
                    </div>

                    <div className="mt-auto flex w-full justify-between">
                      <div className="text-left">
                        <div className="mb-1 h-px w-40 bg-gray-400" />
                        <div className="text-sm font-medium">
                          Certificate ID
                        </div>
                        <div className="text-xs text-gray-500">
                          {certificateId}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="mb-1 ml-auto h-px w-40 bg-gray-400" />
                        <div className="text-sm font-medium">
                          Instructor Signature
                        </div>
                        <div className="text-xs text-gray-500">
                          Course Instructor
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={downloadAsPDF} disabled={isDownloading}>
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloading ? "Downloading..." : "Download PDF"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={downloadAsPDF} disabled={isDownloading}>
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
