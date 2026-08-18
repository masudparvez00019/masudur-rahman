"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Award, Download, Calendar, Search } from "lucide-react";
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
import { format } from "date-fns";
import Image from "next/image";

interface Certificate {
  _id: string;
  course: {
    _id: string;
    title: string;
    slug: string;
    featuredImage?: string;
  };
  completedAt: string;
  certificateId: string;
  certificateUrl?: string;
}

export function Certificates() {
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch("/api/user/certificates");
      if (!response.ok) throw new Error("Failed to fetch certificates");
      const data = await response.json();
      setCertificates(data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast({
        title: "Error",
        description: "Failed to load certificates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (certificateId: string) => {
    try {
      const response = await fetch(
        `/api/user/certificates/${certificateId}/download`
      );
      if (!response.ok) throw new Error("Failed to download certificate");

      // Handle the download (this would depend on your implementation)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Certificate downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast({
        title: "Error",
        description: "Failed to download certificate",
        variant: "destructive",
      });
    }
  };

  const filteredCertificates = certificates.filter((certificate) => {
    return (
      searchTerm === "" ||
      certificate.course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      certificate.certificateId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[250px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Certificates</h2>
          <p className="text-muted-foreground">
            Certificates for courses you have completed
          </p>
        </div>
      </div>

      {certificates.length > 0 && (
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search certificates..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {certificates.length === 0 ? (
        <Card>
          <CardContent className="flex h-[300px] flex-col items-center justify-center p-8 text-center">
            <Award className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium">No certificates yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Complete courses to earn certificates
            </p>
            <Button onClick={() => router.push("/courses")}>
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCertificates.map((certificate) => (
            <Card key={certificate._id} className="overflow-hidden">
              <div className="relative h-[140px] w-full bg-muted">
                {certificate.course.featuredImage ? (
                  <Image
                    src={certificate.course.featuredImage || "/placeholder.svg"}
                    alt={certificate.course.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Award className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">
                  {certificate.course.title}
                </CardTitle>
                <CardDescription>
                  Certificate ID: {certificate.certificateId}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Completed on{" "}
                  {format(new Date(certificate.completedAt), "MMMM d, yyyy")}
                </div>
                <Button
                  onClick={() => downloadCertificate(certificate._id)}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Certificate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
