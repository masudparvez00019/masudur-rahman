"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Lesson {
  _id: string;
  title: string;
  duration: string;
  isFree: boolean;
  isCompleted?: boolean;
}

interface Chapter {
  _id: string;
  title: string;
  order: number;
  isFree: boolean;
  lessons: Lesson[];
}

interface ChapterAccordionProps {
  chapters: Chapter[];
  courseId: string;
  courseSlug: string;
  userProgress?: {
    completedLessons: string[];
    currentLesson?: string;
  };
  isEnrolled: boolean;
}

export function ChapterAccordion({
  chapters,
  courseId,
  courseSlug,
  userProgress,
  isEnrolled,
}: ChapterAccordionProps) {
  const pathname = usePathname();
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  // Calculate progress
  const totalLessons = chapters.reduce(
    (acc, chapter) => acc + (chapter.lessons?.length || 0),
    0
  );
  const completedLessons = userProgress?.completedLessons?.length || 0;
  const progressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  // Find the current chapter and lesson based on the pathname
  const currentLessonId = pathname.split("/").pop();
  const currentChapter = chapters.find(
    (chapter) =>
      chapter.lessons &&
      chapter.lessons.some((lesson) => lesson._id === currentLessonId)
  );

  // Debug logging
  console.log("ChapterAccordion - chapters:", chapters);
  console.log("ChapterAccordion - totalLessons:", totalLessons);

  return (
    <div className="space-y-4">
      {isEnrolled && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Your progress: {completedLessons}/{totalLessons} lessons
            </span>
            <span className="text-sm font-medium">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      )}

      <Accordion type="multiple" value={expandedChapters} className="w-full">
        {chapters.map((chapter) => (
          <AccordionItem
            key={chapter._id}
            value={chapter._id}
            className={cn(
              "border rounded-md mb-2",
              currentChapter?._id === chapter._id &&
                "border-primary bg-primary/5"
            )}
          >
            <AccordionTrigger
              onClick={() => toggleChapter(chapter._id)}
              className="px-4 py-3 hover:no-underline"
            >
              <div className="flex flex-1 items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{chapter.title}</span>
                  {chapter.isFree && !isEnrolled && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      Free
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {chapter.lessons?.length || 0}{" "}
                  {(chapter.lessons?.length || 0) === 1 ? "lesson" : "lessons"}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3 pt-0">
              <ul className="space-y-2">
                {chapter.lessons && chapter.lessons.length > 0 ? (
                  chapter.lessons.map((lesson) => {
                    const isCompleted =
                      userProgress?.completedLessons?.includes(lesson._id);
                    const isCurrent =
                      userProgress?.currentLesson === lesson._id;
                    const isLocked =
                      !isEnrolled && !lesson.isFree && !chapter.isFree;

                    return (
                      <li key={lesson._id}>
                        {isLocked ? (
                          <div className="flex items-center justify-between rounded-md border p-3">
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {lesson.title}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {lesson.duration}
                            </span>
                          </div>
                        ) : (
                          <Link
                            href={`/courses/${courseSlug}/learn/${lesson._id}`}
                            className={cn(
                              "flex items-center justify-between rounded-md border p-3 transition-colors",
                              isCurrent && "border-primary bg-primary/5",
                              isCompleted && "border-green-200 bg-green-50"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <PlayCircle className="h-4 w-4 text-primary" />
                              )}
                              <span className="font-medium">
                                {lesson.title}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {lesson.duration}
                            </span>
                          </Link>
                        )}
                      </li>
                    );
                  })
                ) : (
                  <li className="text-sm text-muted-foreground py-2">
                    No lessons available for this chapter.
                  </li>
                )}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {!isEnrolled && (
        <div className="mt-4 rounded-md border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            Enroll in this course to access all lessons and materials.
          </p>
          <Button asChild className="mt-2 w-full">
            <Link href={`/courses/${courseSlug}`}>Enroll Now</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import {
//   ChevronDown,
//   Lock,
//   CheckCircle,
//   PlayCircle,
//   FileText,
// } from "lucide-react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";

// interface Lesson {
//   _id: string;
//   title: string;
//   duration: string;
//   isFree: boolean;
//   isPublished: boolean;
// }

// interface Chapter {
//   _id: string;
//   title: string;
//   description?: string;
//   isFree: boolean;
//   isPublished: boolean;
//   lessons: Lesson[];
// }

// interface ChapterAccordionProps {
//   chapters: Chapter[];
//   courseId: string;
//   courseSlug: string;
//   isEnrolled: boolean;
//   userProgress?: {
//     completedLessons: string[];
//     currentLesson?: string;
//   };
//   showChapterQuizLinks?: boolean;
// }

// export function ChapterAccordion({
//   chapters,
//   courseId,
//   courseSlug,
//   isEnrolled,
//   userProgress,
//   showChapterQuizLinks = false,
// }: ChapterAccordionProps) {
//   // Find the chapter containing the current lesson
//   const currentChapterIndex = userProgress?.currentLesson
//     ? chapters.findIndex((chapter) =>
//         chapter.lessons.some(
//           (lesson) => lesson._id.toString() === userProgress.currentLesson
//         )
//       )
//     : 0;

//   const [openChapter, setOpenChapter] = useState<string>(
//     currentChapterIndex >= 0
//       ? chapters[currentChapterIndex]?._id.toString()
//       : chapters[0]?._id.toString()
//   );

//   return (
//     <Accordion
//       type="single"
//       collapsible
//       value={openChapter}
//       onValueChange={setOpenChapter}
//       className="w-full rounded-md border"
//     >
//       {chapters.map((chapter, index) => {
//         // Calculate chapter progress
//         const chapterLessonsCount = chapter.lessons.length;
//         const completedLessonsInChapter = chapter.lessons.filter((lesson) =>
//           userProgress?.completedLessons.includes(lesson._id.toString())
//         ).length;
//         const chapterProgress =
//           chapterLessonsCount > 0
//             ? (completedLessonsInChapter / chapterLessonsCount) * 100
//             : 0;
//         const isChapterCompleted = chapterProgress === 100;

//         return (
//           <AccordionItem
//             key={chapter._id.toString()}
//             value={chapter._id.toString()}
//             className="border-b"
//           >
//             <AccordionTrigger className="px-4 py-2 hover:no-underline">
//               <div className="flex w-full items-center justify-between text-left">
//                 <div className="flex items-center gap-2">
//                   <span className="font-medium">
//                     {index + 1}. {chapter.title}
//                   </span>
//                   {chapter.isFree && !isEnrolled && (
//                     <Badge
//                       variant="outline"
//                       className="ml-2 bg-green-50 text-green-700"
//                     >
//                       Free
//                     </Badge>
//                   )}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {isEnrolled && (
//                     <div className="mr-2 flex items-center gap-1 text-sm text-muted-foreground">
//                       <span>
//                         {completedLessonsInChapter}/{chapterLessonsCount}
//                       </span>
//                       {isChapterCompleted && (
//                         <CheckCircle className="h-4 w-4 text-green-600" />
//                       )}
//                     </div>
//                   )}
//                   <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
//                 </div>
//               </div>
//             </AccordionTrigger>
//             <AccordionContent className="px-4 pb-2">
//               <div className="flex flex-col gap-1">
//                 {chapter.lessons.map((lesson, lessonIndex) => {
//                   const isCompleted = userProgress?.completedLessons.includes(
//                     lesson._id.toString()
//                   );
//                   const isCurrent =
//                     userProgress?.currentLesson === lesson._id.toString();

//                   return (
//                     <div
//                       key={lesson._id.toString()}
//                       className={cn(
//                         "flex items-center justify-between rounded-md p-2",
//                         isCurrent && "bg-muted",
//                         isCompleted && "bg-green-50"
//                       )}
//                     >
//                       <div className="flex items-center gap-2">
//                         {isCompleted ? (
//                           <CheckCircle className="h-4 w-4 text-green-600" />
//                         ) : (
//                           <PlayCircle className="h-4 w-4 text-muted-foreground" />
//                         )}
//                         <span className="text-sm">
//                           {lessonIndex + 1}. {lesson.title}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-xs text-muted-foreground">
//                           {lesson.duration}
//                         </span>
//                         {isEnrolled || lesson.isFree || chapter.isFree ? (
//                           <Button variant="ghost" size="sm" asChild>
//                             <Link
//                               href={`/courses/${courseSlug}/learn/${lesson._id}`}
//                             >
//                               Watch
//                             </Link>
//                           </Button>
//                         ) : (
//                           <Lock className="h-4 w-4 text-muted-foreground" />
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}

//                 {/* Add chapter quiz link if enabled */}
//                 {showChapterQuizLinks && isEnrolled && (
//                   <div className="mt-2 flex items-center justify-between rounded-md border border-dashed p-2">
//                     <div className="flex items-center gap-2">
//                       <FileText className="h-4 w-4 text-muted-foreground" />
//                       <span className="text-sm font-medium">Chapter Quiz</span>
//                     </div>
//                     <Button variant="outline" size="sm" asChild>
//                       <Link
//                         href={`/courses/${courseSlug}/learn?chapter=${chapter._id}`}
//                       >
//                         Take Quiz
//                       </Link>
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </AccordionContent>
//           </AccordionItem>
//         );
//       })}
//     </Accordion>
//   );
// }
