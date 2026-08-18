// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { QuizComponent } from "@/components/courses/quiz-component";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "@/components/ui/use-toast";
// import { CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

// interface ChapterQuizProps {
//   courseId: string;
//   courseSlug: string;
//   chapterId: string;
//   nextChapterId?: string;
// }

// export function ChapterQuiz({
//   courseId,
//   courseSlug,
//   chapterId,
//   nextChapterId,
// }: ChapterQuizProps) {
//   const router = useRouter();
//   const [quiz, setQuiz] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [quizAttempted, setQuizAttempted] = useState(false);
//   const [quizPassed, setQuizPassed] = useState(false);

//   useEffect(() => {
//     fetchQuiz();
//     checkQuizStatus();
//   }, [courseId, chapterId]);

//   const fetchQuiz = async () => {
//     try {
//       const response = await fetch(`/api/courses/chapters/${chapterId}/quiz`);

//       if (!response.ok) {
//         if (response.status === 404) {
//           // No quiz for this chapter
//           setQuiz(null);
//           setLoading(false);
//           return;
//         }
//         throw new Error("Failed to fetch quiz");
//       }

//       const data = await response.json();
//       setQuiz(data);
//     } catch (error) {
//       console.error("Error fetching quiz:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load quiz",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkQuizStatus = async () => {
//     try {
//       const response = await fetch(
//         `/api/courses/${courseId}/quiz-status?chapterId=${chapterId}`
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch quiz status");
//       }

//       const data = await response.json();
//       setQuizAttempted(data.attempted);
//       setQuizPassed(data.passed);
//     } catch (error) {
//       console.error("Error fetching quiz status:", error);
//     }
//   };

//   const handleQuizComplete = (score: number, passed: boolean) => {
//     setQuizAttempted(true);
//     setQuizPassed(passed);

//     // Refresh the page to update progress
//     router.refresh();
//   };

//   if (loading) {
//     return (
//       <Card className="mt-8">
//         <CardHeader>
//           <Skeleton className="h-8 w-[250px]" />
//           <Skeleton className="h-4 w-[350px]" />
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <Skeleton className="h-24 w-full" />
//             <Skeleton className="h-24 w-full" />
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (!quiz) {
//     return null; // No quiz for this chapter
//   }

//   if (quizPassed) {
//     return (
//       <Card className="mt-8 border-green-200 bg-green-50">
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <CheckCircle className="h-5 w-5 text-green-600" />
//             <CardTitle>Chapter Quiz Completed</CardTitle>
//           </div>
//           <CardDescription>
//             You've successfully passed this chapter quiz!
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <p className="text-green-700">
//             Congratulations! You've completed this chapter and can now move on
//             to the next one.
//           </p>
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <Button variant="outline" onClick={() => setQuizPassed(false)}>
//             Retake Quiz
//           </Button>
//           {nextChapterId && (
//             <Button asChild>
//               <Link
//                 href={`/courses/${courseSlug}/learn?chapter=${nextChapterId}`}
//               >
//                 Next Chapter
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//           )}
//         </CardFooter>
//       </Card>
//     );
//   }

//   if (quizAttempted && !quizPassed) {
//     return (
//       <Card className="mt-8 border-amber-200 bg-amber-50">
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <AlertCircle className="h-5 w-5 text-amber-600" />
//             <CardTitle>Chapter Quiz Attempted</CardTitle>
//           </div>
//           <CardDescription>
//             You've attempted this chapter quiz but haven't passed yet.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <p className="text-amber-700">
//             Review the chapter material and try again. You need to score at
//             least {quiz.passingScore}% to pass.
//           </p>
//         </CardContent>
//         <CardFooter>
//           <Button onClick={() => setQuizAttempted(false)}>Try Again</Button>
//         </CardFooter>
//       </Card>
//     );
//   }

//   // Format questions for the QuizComponent
//   const formattedQuestions = quiz.questions.map((q: any) => ({
//     id: q._id,
//     text: q.question,
//     options: q.options.map((opt: string, idx: number) => ({
//       id: idx.toString(),
//       text: opt,
//     })),
//     correctOptionId: q.correctOption.toString(),
//     explanation: q.explanation,
//   }));

//   return (
//     <div className="mt-8">
//       <h2 className="mb-4 text-2xl font-bold">Chapter Quiz</h2>
//       <p className="mb-6 text-muted-foreground">
//         Complete this quiz to test your understanding of the chapter material.
//       </p>
//       <QuizComponent
//         quizId={quiz._id}
//         courseId={courseId}
//         title={quiz.title}
//         description={quiz.description}
//         questions={formattedQuestions}
//         passingScore={quiz.passingScore}
//         onComplete={handleQuizComplete}
//       />
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QuizComponent } from "./quiz-component";
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
  FileQuestion,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface ChapterQuizProps {
  courseId: string;
  courseSlug: string;
  chapterId: string;
  nextChapterId?: string;
}

export function ChapterQuiz({
  courseId,
  courseSlug,
  chapterId,
  nextChapterId,
}: ChapterQuizProps) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [quizStatus, setQuizStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        // First check if there's a quiz for this chapter
        const quizResponse = await fetch(
          `/api/courses/chapters/${chapterId}/quiz`
        );

        if (!quizResponse.ok) {
          if (quizResponse.status === 404) {
            // No quiz for this chapter
            setQuiz(null);
            return;
          }
          throw new Error("Failed to fetch quiz");
        }

        const quizData = await quizResponse.json();
        setQuiz(quizData);

        // Then check if the user has already taken this quiz
        const statusResponse = await fetch(
          `/api/courses/${courseId}/quiz-status?chapterId=${chapterId}`
        );

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setQuizStatus(statusData);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setError("Failed to load quiz data");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [courseId, chapterId]);

  const handleQuizComplete = (score: number, passed: boolean) => {
    setQuizStatus({
      attempted: true,
      passed,
      score,
    });

    // Refresh the page data to update progress
    router.refresh();
  };

  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto my-8">
        <CardHeader>
          <CardTitle>Loading Chapter Quiz...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-3xl mx-auto my-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href={`/courses/${courseSlug}/learn`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!quiz) {
    return (
      <Card className="w-full max-w-3xl mx-auto my-8">
        <CardHeader>
          <CardTitle>No Quiz Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>There is no quiz available for this chapter.</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href={`/courses/${courseSlug}/learn`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (showQuiz) {
    return (
      <div className="w-full max-w-3xl mx-auto my-8">
        <QuizComponent
          quizId={quiz._id}
          courseId={courseId}
          title={quiz.title || "Chapter Quiz"}
          description={quiz.description}
          questions={quiz.questions.map((q: any) => ({
            id: q._id,
            text: q.question,
            options: q.options.map((opt: string, i: number) => ({
              id: i.toString(),
              text: opt,
            })),
            correctOptionId: q.correctOption.toString(),
            explanation: q.explanation,
          }))}
          passingScore={quiz.passingScore}
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileQuestion className="mr-2 h-5 w-5 text-blue-500" />
          Chapter Quiz
        </CardTitle>
        <CardDescription>Test your knowledge of this chapter</CardDescription>
      </CardHeader>
      <CardContent>
        {quizStatus?.attempted ? (
          <div className="flex items-center space-x-2">
            {quizStatus.passed ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p>
                  You've passed this quiz with a score of {quizStatus.score}%
                </p>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <p>
                  You've attempted this quiz but didn't pass. Your score:{" "}
                  {quizStatus.score}%
                </p>
              </>
            )}
          </div>
        ) : (
          <p>
            Complete this quiz to test your understanding of the chapter
            material.
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/courses/${courseSlug}/learn`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => setShowQuiz(true)}>
            {quizStatus?.attempted ? "Retake Quiz" : "Start Quiz"}
          </Button>
          {quizStatus?.passed && nextChapterId && (
            <Button variant="secondary" asChild>
              <Link
                href={`/courses/${courseSlug}/learn?chapter=${nextChapterId}`}
              >
                Next Chapter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
