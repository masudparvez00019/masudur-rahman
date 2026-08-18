// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
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
// import { CheckCircle, AlertCircle } from "lucide-react";

// interface LessonQuizProps {
//   courseId: string;
//   lessonId: string;
// }

// export function LessonQuiz({ courseId, lessonId }: LessonQuizProps) {
//   const router = useRouter();
//   const [quiz, setQuiz] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [quizAttempted, setQuizAttempted] = useState(false);
//   const [quizPassed, setQuizPassed] = useState(false);

//   useEffect(() => {
//     fetchQuiz();
//     checkQuizStatus();
//   }, [courseId, lessonId]);

//   const fetchQuiz = async () => {
//     try {
//       const response = await fetch(`/api/courses/lessons/${lessonId}/quiz`);

//       if (!response.ok) {
//         if (response.status === 404) {
//           // No quiz for this lesson
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
//         `/api/courses/${courseId}/quiz-status?lessonId=${lessonId}`
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
//     return null; // No quiz for this lesson
//   }

//   if (quizPassed) {
//     return (
//       <Card className="mt-8 border-green-200 bg-green-50">
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <CheckCircle className="h-5 w-5 text-green-600" />
//             <CardTitle>Quiz Completed</CardTitle>
//           </div>
//           <CardDescription>
//             You've successfully passed this quiz!
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <p className="text-green-700">
//             Great job! You can now continue to the next lesson or review this
//             material again.
//           </p>
//         </CardContent>
//         <CardFooter>
//           <Button variant="outline" onClick={() => setQuizPassed(false)}>
//             Retake Quiz
//           </Button>
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
//             <CardTitle>Quiz Attempted</CardTitle>
//           </div>
//           <CardDescription>
//             You've attempted this quiz but haven't passed yet.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <p className="text-amber-700">
//             Review the lesson material and try again. You need to score at least{" "}
//             {quiz.passingScore}% to pass.
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
//       <h2 className="mb-4 text-2xl font-bold">Lesson Quiz</h2>
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
import { FileQuestion, CheckCircle, AlertCircle } from "lucide-react";

interface LessonQuizProps {
  courseId: string;
  lessonId: string;
}

export function LessonQuiz({ courseId, lessonId }: LessonQuizProps) {
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
        // First check if there's a quiz for this lesson
        const quizResponse = await fetch(
          `/api/courses/lessons/${lessonId}/quiz`
        );

        if (!quizResponse.ok) {
          if (quizResponse.status === 404) {
            // No quiz for this lesson
            setQuiz(null);
            return;
          }
          throw new Error("Failed to fetch quiz");
        }

        const quizData = await quizResponse.json();
        setQuiz(quizData);

        // Then check if the user has already taken this quiz
        const statusResponse = await fetch(
          `/api/courses/${courseId}/quiz-status?lessonId=${lessonId}`
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
  }, [courseId, lessonId]);

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
    return null; // Don't show anything while loading
  }

  if (error) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!quiz) {
    return null; // No quiz for this lesson
  }

  if (showQuiz) {
    return (
      <div className="mt-8">
        <QuizComponent
          quizId={quiz._id}
          courseId={courseId}
          title={quiz.title || "Lesson Quiz"}
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
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileQuestion className="mr-2 h-5 w-5 text-blue-500" />
          Lesson Quiz
        </CardTitle>
        <CardDescription>Test your knowledge of this lesson</CardDescription>
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
            Complete this quiz to test your understanding of the lesson
            material.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={() => setShowQuiz(true)}>
          {quizStatus?.attempted ? "Retake Quiz" : "Start Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
}
