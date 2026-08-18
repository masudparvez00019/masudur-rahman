// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Skeleton } from "@/components/ui/skeleton"
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// interface LearningStats {
//   totalCoursesEnrolled: number
//   completedCourses: number
//   totalLessonsCompleted: number
//   totalQuizzesCompleted: number
//   averageScore: number
//   timeSpentInHours: number
//   learningByCategory: {
//     category: string
//     count: number
//   }[]
//   weeklyActivity: {
//     day: string
//     minutes: number
//   }[]
// }

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

// export function LearningStats() {
//   const [stats, setStats] = useState<LearningStats | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const response = await fetch("/api/courses/stats/user")
//         if (!response.ok) throw new Error("Failed to fetch learning stats")
//         const data = await response.json()
//         setStats(data)
//       } catch (error) {
//         console.error("Error fetching learning stats:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchStats()
//   }, [])

//   if (loading) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Learning Statistics</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <Skeleton className="h-8 w-full" />
//             <Skeleton className="h-64 w-full" />
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   if (!stats) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Learning Statistics</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-center text-muted-foreground py-6">
//             No learning statistics available yet. Start learning to see your progress!
//           </p>
//         </CardContent>
//       </Card>
//     )
//   }

//   const completionRate =
//     stats.totalCoursesEnrolled > 0 ? (stats.completedCourses / stats.totalCoursesEnrolled) * 100 : 0

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Learning Statistics</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="space-y-2">
//             <p className="text-sm font-medium">Courses Enrolled</p>
//             <p className="text-2xl font-bold">{stats.totalCoursesEnrolled}</p>
//           </div>
//           <div className="space-y-2">
//             <p className="text-sm font-medium">Lessons Completed</p>
//             <p className="text-2xl font-bold">{stats.totalLessonsCompleted}</p>
//           </div>
//           <div className="space-y-2">
//             <p className="text-sm font-medium">Time Spent Learning</p>
//             <p className="text-2xl font-bold">{stats.timeSpentInHours} hrs</p>
//           </div>
//         </div>

//         <div className="space-y-2 mb-6">
//           <div className="flex justify-between text-sm">
//             <span>Course Completion Rate</span>
//             <span>{Math.round(completionRate)}%</span>
//           </div>
//           <Progress value={completionRate} className="h-2" />
//         </div>

//         <Tabs defaultValue="activity">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="activity">Weekly Activity</TabsTrigger>
//             <TabsTrigger value="categories">Categories</TabsTrigger>
//           </TabsList>
//           <TabsContent value="activity" className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={stats.weeklyActivity}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="day" />
//                 <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft" }} />
//                 <Tooltip formatter={(value) => [`${value} min`, "Time Spent"]} />
//                 <Bar dataKey="minutes" fill="#8884d8" />
//               </BarChart>
//             </ResponsiveContainer>
//           </TabsContent>
//           <TabsContent value="categories" className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={stats.learningByCategory}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="count"
//                   nameKey="category"
//                 >
//                   {stats.learningByCategory.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value, name, props) => [`${value} courses`, props.payload.category]} />
//               </PieChart>
//             </ResponsiveContainer>
//           </TabsContent>
//         </Tabs>
//       </CardContent>
//     </Card>
//   )
// }

//-----------------------------------------------------------------

// "use client";

// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Skeleton } from "@/components/ui/skeleton";
// import { BarChart, BookOpen, Clock, Award } from "lucide-react";

// interface LearningStats {
//   totalCoursesEnrolled: number;
//   totalCoursesCompleted: number;
//   totalLessonsCompleted: number;
//   totalHoursLearned: number;
//   averageCompletionRate: number;
//   learningStreak: number;
//   lastWeekActivity: {
//     day: string;
//     hoursLearned: number;
//   }[];
// }

// export function LearningStats() {
//   const [stats, setStats] = useState<LearningStats | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchLearningStats = async () => {
//       try {
//         const response = await fetch("/api/courses/stats/user");
//         if (!response.ok) throw new Error("Failed to fetch learning stats");
//         const data = await response.json();
//         setStats(data);
//       } catch (error) {
//         console.error("Error fetching learning stats:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLearningStats();
//   }, []);

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <Skeleton className="h-[200px] w-full" />
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <Skeleton className="h-[100px] w-full" />
//           <Skeleton className="h-[100px] w-full" />
//           <Skeleton className="h-[100px] w-full" />
//           <Skeleton className="h-[100px] w-full" />
//         </div>
//       </div>
//     );
//   }

//   if (!stats) {
//     return (
//       <Card>
//         <CardContent className="flex flex-col items-center justify-center py-10 text-center">
//           <BarChart className="mb-4 h-12 w-12 text-muted-foreground" />
//           <h3 className="text-lg font-medium">No learning data available</h3>
//           <p className="text-sm text-muted-foreground">
//             Start learning to see your statistics here
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Learning Overview</CardTitle>
//           <CardDescription>Your learning activity and progress</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Tabs defaultValue="weekly">
//             <TabsList className="mb-4">
//               <TabsTrigger value="weekly">Weekly Activity</TabsTrigger>
//               <TabsTrigger value="progress">Progress</TabsTrigger>
//             </TabsList>
//             <TabsContent value="weekly">
//               <div className="h-[200px] w-full">
//                 {/* Weekly activity chart would go here */}
//                 <div className="flex h-full items-center justify-center">
//                   <p className="text-muted-foreground">
//                     Weekly activity chart visualization
//                   </p>
//                 </div>
//               </div>
//             </TabsContent>
//             <TabsContent value="progress">
//               <div className="space-y-4">
//                 <div>
//                   <div className="mb-1 flex items-center justify-between">
//                     <span className="text-sm font-medium">
//                       Course Completion Rate
//                     </span>
//                     <span className="text-sm text-muted-foreground">
//                       {stats.averageCompletionRate}%
//                     </span>
//                   </div>
//                   <Progress
//                     value={stats.averageCompletionRate}
//                     className="h-2"
//                   />
//                 </div>
//                 <div>
//                   <div className="mb-1 flex items-center justify-between">
//                     <span className="text-sm font-medium">
//                       Courses Completed
//                     </span>
//                     <span className="text-sm text-muted-foreground">
//                       {stats.totalCoursesCompleted}/{stats.totalCoursesEnrolled}
//                     </span>
//                   </div>
//                   <Progress
//                     value={
//                       (stats.totalCoursesCompleted /
//                         stats.totalCoursesEnrolled) *
//                       100
//                     }
//                     className="h-2"
//                   />
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center p-6">
//             <BookOpen className="mb-2 h-8 w-8 text-primary" />
//             <p className="text-sm text-muted-foreground">Courses Enrolled</p>
//             <h3 className="text-2xl font-bold">{stats.totalCoursesEnrolled}</h3>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="flex flex-col items-center justify-center p-6">
//             <Award className="mb-2 h-8 w-8 text-green-500" />
//             <p className="text-sm text-muted-foreground">Courses Completed</p>
//             <h3 className="text-2xl font-bold">
//               {stats.totalCoursesCompleted}
//             </h3>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="flex flex-col items-center justify-center p-6">
//             <Clock className="mb-2 h-8 w-8 text-blue-500" />
//             <p className="text-sm text-muted-foreground">Hours Learned</p>
//             <h3 className="text-2xl font-bold">{stats.totalHoursLearned}</h3>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="flex flex-col items-center justify-center p-6">
//             <BarChart className="mb-2 h-8 w-8 text-orange-500" />
//             <p className="text-sm text-muted-foreground">Learning Streak</p>
//             <h3 className="text-2xl font-bold">{stats.learningStreak} days</h3>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

//------------------------------------------------------------------

"use client";

import { useState, useEffect } from "react";
import { BookOpen, Clock, Award, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

interface LearningStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLessonsCompleted: number;
  totalTimeSpent: number; // in minutes
  lastActivity?: string;
}

export function LearningStats() {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/user/learning-stats");
      if (!response.ok) throw new Error("Failed to fetch learning stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching learning stats:", error);
      toast({
        title: "Error",
        description: "Failed to load learning statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins} min${mins !== 1 ? "s" : ""}`;
    }

    return `${hours} hr${hours !== 1 ? "s" : ""} ${mins} min${
      mins !== 1 ? "s" : ""
    }`;
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCourses}</div>
          <p className="text-xs text-muted-foreground">
            {stats.completedCourses} completed, {stats.inProgressCourses} in
            progress
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Lessons Completed
          </CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalLessonsCompleted}
          </div>
          <p className="text-xs text-muted-foreground">
            Across all your courses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Time Spent Learning
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatTime(stats.totalTimeSpent)}
          </div>
          <p className="text-xs text-muted-foreground">Total learning time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.lastActivity
              ? new Date(stats.lastActivity).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.lastActivity
              ? new Date(stats.lastActivity).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                })
              : "No activity yet"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
