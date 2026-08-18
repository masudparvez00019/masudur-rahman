// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Clock, BookOpen } from "lucide-react"

// interface EnrolledCourse {
//   _id: string
//   course: {
//     _id: string
//     title: string
//     slug: string
//     thumbnail: string
//     description: string
//     level: string
//     duration: number
//     lessonsCount: number
//   }
//   progress: number
//   lastAccessedAt: string
//   completedLessons: string[]
// }

// export function EnrolledCourses() {
//   const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchEnrolledCourses = async () => {
//       try {
//         const response = await fetch("/api/courses/enrollments/user")
//         if (!response.ok) throw new Error("Failed to fetch enrolled courses")
//         const data = await response.json()
//         setEnrolledCourses(data)
//       } catch (error) {
//         console.error("Error fetching enrolled courses:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchEnrolledCourses()
//   }, [])

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {[...Array(3)].map((_, i) => (
//           <Card key={i} className="overflow-hidden">
//             <Skeleton className="h-48 w-full" />
//             <CardHeader>
//               <Skeleton className="h-6 w-3/4" />
//             </CardHeader>
//             <CardContent>
//               <Skeleton className="h-4 w-full mb-2" />
//               <Skeleton className="h-4 w-2/3" />
//             </CardContent>
//             <CardFooter>
//               <Skeleton className="h-10 w-full" />
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     )
//   }

//   if (enrolledCourses.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <h3 className="text-xl font-semibold mb-4">You haven't enrolled in any courses yet</h3>
//         <p className="text-muted-foreground mb-6">Explore our courses and start learning today!</p>
//         <Button asChild>
//           <Link href="/courses">Browse Courses</Link>
//         </Button>
//       </div>
//     )
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {enrolledCourses.map((enrollment) => (
//         <Card key={enrollment._id} className="overflow-hidden flex flex-col">
//           <div className="relative h-48">
//             <Image
//               src={enrollment.course.thumbnail || "/placeholder.svg?height=192&width=384"}
//               alt={enrollment.course.title}
//               fill
//               className="object-cover"
//             />
//             <Badge className="absolute top-2 right-2">{enrollment.course.level}</Badge>
//           </div>
//           <CardHeader>
//             <CardTitle className="line-clamp-1">{enrollment.course.title}</CardTitle>
//           </CardHeader>
//           <CardContent className="flex-grow">
//             <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{enrollment.course.description}</p>
//             <div className="space-y-4">
//               <div>
//                 <div className="flex justify-between text-sm mb-1">
//                   <span>Progress</span>
//                   <span>{Math.round(enrollment.progress)}%</span>
//                 </div>
//                 <Progress value={enrollment.progress} className="h-2" />
//               </div>
//               <div className="flex justify-between text-sm text-muted-foreground">
//                 <div className="flex items-center">
//                   <Clock className="mr-1 h-4 w-4" />
//                   <span>{enrollment.course.duration} hrs</span>
//                 </div>
//                 <div className="flex items-center">
//                   <BookOpen className="mr-1 h-4 w-4" />
//                   <span>{enrollment.course.lessonsCount} lessons</span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button asChild className="w-full">
//               <Link href={`/courses/${enrollment.course._id}/learn`}>
//                 {enrollment.progress > 0 ? "Continue Learning" : "Start Learning"}
//               </Link>
//             </Button>
//           </CardFooter>
//         </Card>
//       ))}
//     </div>
//   )
// }


// --------------------------------------------------------
// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Clock, BookOpen } from "lucide-react";

// interface EnrolledCourse {
//   _id: string;
//   course: {
//     _id: string;
//     title: string;
//     slug: string;
//     thumbnail: string;
//     description: string;
//     level: string;
//     duration: number;
//     lessonsCount: number;
//   };
//   progress: number;
//   lastAccessedAt: string;
//   completedLessons: string[];
// }

// export function EnrolledCourses() {
//   const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchEnrolledCourses = async () => {
//       try {
//         const response = await fetch("/api/courses/enrollments/user");
//         if (!response.ok) throw new Error("Failed to fetch enrolled courses");
//         const data = await response.json();
//         setEnrolledCourses(data);
//       } catch (error) {
//         console.error("Error fetching enrolled courses:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEnrolledCourses();
//   }, []);

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {[...Array(3)].map((_, i) => (
//           <Card key={i} className="overflow-hidden">
//             <Skeleton className="h-48 w-full" />
//             <CardHeader>
//               <Skeleton className="h-6 w-3/4" />
//             </CardHeader>
//             <CardContent>
//               <Skeleton className="h-4 w-full mb-2" />
//               <Skeleton className="h-4 w-2/3" />
//             </CardContent>
//             <CardFooter>
//               <Skeleton className="h-10 w-full" />
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     );
//   }

//   if (enrolledCourses.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <h3 className="text-xl font-semibold mb-4">
//           You haven't enrolled in any courses yet
//         </h3>
//         <p className="text-muted-foreground mb-6">
//           Explore our courses and start learning today!
//         </p>
//         <Button asChild>
//           <Link href="/courses">Browse Courses</Link>
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {enrolledCourses.map((enrollment) => (
//         <Card key={enrollment._id} className="overflow-hidden flex flex-col">
//           <div className="relative h-48">
//             <Image
//               src={
//                 enrollment.course.thumbnail ||
//                 "/placeholder.svg?height=192&width=384"
//               }
//               alt={enrollment.course.title}
//               fill
//               className="object-cover"
//             />
//             <Badge className="absolute top-2 right-2">
//               {enrollment.course.level}
//             </Badge>
//           </div>
//           <CardHeader>
//             <CardTitle className="line-clamp-1">
//               {enrollment.course.title}
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="flex-grow">
//             <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
//               {enrollment.course.description}
//             </p>
//             <div className="space-y-4">
//               <div>
//                 <div className="flex justify-between text-sm mb-1">
//                   <span>Progress</span>
//                   <span>{Math.round(enrollment.progress)}%</span>
//                 </div>
//                 <Progress value={enrollment.progress} className="h-2" />
//               </div>
//               <div className="flex justify-between text-sm text-muted-foreground">
//                 <div className="flex items-center">
//                   <Clock className="mr-1 h-4 w-4" />
//                   <span>{enrollment.course.duration} hrs</span>
//                 </div>
//                 <div className="flex items-center">
//                   <BookOpen className="mr-1 h-4 w-4" />
//                   <span>{enrollment.course.lessonsCount} lessons</span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button asChild className="w-full">
//               <Link href={`/courses/${enrollment.course._id}/learn`}>
//                 {enrollment.progress > 0
//                   ? "Continue Learning"
//                   : "Start Learning"}
//               </Link>
//             </Button>
//           </CardFooter>
//         </Card>
//       ))}
//     </div>
//   );
// }


//---------------------------------------------------------

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Search, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import Image from "next/image";

interface Enrollment {
  _id: string;
  course: {
    _id: string;
    title: string;
    slug: string;
    featuredImage?: string;
  };
  progress: {
    lesson: string;
    completed: boolean;
    watchedSeconds: number;
    lastPosition: number;
    completedAt?: string;
  }[];
  completedAt?: string;
  createdAt: string;
}

export function EnrolledCourses() {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await fetch("/api/courses/enrollments");
      if (!response.ok) throw new Error("Failed to fetch enrollments");
      const data = await response.json();
      setEnrollments(data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      toast({
        title: "Error",
        description: "Failed to load enrolled courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCompletionPercentage = (enrollment: Enrollment) => {
    if (enrollment.progress.length === 0) return 0;
    const completedLessons = enrollment.progress.filter(
      (p) => p.completed
    ).length;
    return Math.round((completedLessons / enrollment.progress.length) * 100);
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    return (
      searchTerm === "" ||
      enrollment.course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
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
      <div>
        <h2 className="text-2xl font-bold">My Courses</h2>
        <p className="text-muted-foreground">Courses you're enrolled in</p>
      </div>

      {enrollments.length > 0 && (
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="flex h-[300px] flex-col items-center justify-center p-8 text-center">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium">No enrolled courses</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              You haven't enrolled in any courses yet
            </p>
            <Button onClick={() => router.push("/courses")}>
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEnrollments.map((enrollment) => (
            <Card key={enrollment._id} className="overflow-hidden">
              <div className="relative h-[140px] w-full bg-muted">
                {enrollment.course.featuredImage ? (
                  <Image
                    src={enrollment.course.featuredImage || "/placeholder.svg"}
                    alt={enrollment.course.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {enrollment.completedAt && (
                  <div className="absolute right-2 top-2 rounded-full bg-green-100 p-1">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">
                  {enrollment.course.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{getCompletionPercentage(enrollment)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${getCompletionPercentage(enrollment)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  {enrollment.completedAt ? (
                    <span>
                      Completed on{" "}
                      {format(new Date(enrollment.completedAt), "MMM d, yyyy")}
                    </span>
                  ) : (
                    <span>
                      Enrolled on{" "}
                      {format(new Date(enrollment.createdAt), "MMM d, yyyy")}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() =>
                    router.push(`/courses/${enrollment.course.slug}/learn`)
                  }
                >
                  {enrollment.completedAt
                    ? "Review Course"
                    : "Continue Learning"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
