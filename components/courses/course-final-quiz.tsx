"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QuizComponent } from "@/components/courses/quiz-component";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { CheckCircle, AlertCircle, Award } from "lucide-react";

interface CourseFinalQuizProps {
  courseId: string;
  courseSlug: string;
}

export function CourseFinalQuiz({
  courseId,
  courseSlug,
}: CourseFinalQuizProps) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quizAttempted, setQuizAttempted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  useEffect(() => {
    fetchQuiz();
    checkQuizStatus();
  }, [courseId]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/final-quiz`);

      if (!response.ok) {
        if (response.status === 404) {
          // No final quiz for this course
          setQuiz(null);
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch final quiz");
      }

      const data = await response.json();
      setQuiz(data);
    } catch (error) {
      console.error("Error fetching final quiz:", error);
      toast({
        title: "Error",
        description: "Failed to load final quiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkQuizStatus = async () => {
    try {
      const response = await fetch(
        `/api/courses/${courseId}/quiz-status?final=true`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch quiz status");
      }

      const data = await response.json();
      setQuizAttempted(data.attempted);
      setQuizPassed(data.passed);
    } catch (error) {
      console.error("Error fetching quiz status:", error);
    }
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    setQuizAttempted(true);
    setQuizPassed(passed);

    // Refresh the page to update progress
    router.refresh();
  };

  if (loading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[350px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quiz) {
    return null; // No final quiz for this course
  }

  if (quizPassed) {
    return (
      <Card className="mt-8 border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle>Course Completed!</CardTitle>
          </div>
          <CardDescription>
            You've successfully passed the final quiz and completed this course!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="mb-4 rounded-full bg-green-100 p-3">
              <Award className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-green-700">
              Congratulations!
            </h3>
            <p className="text-center text-green-700">
              You've mastered the material and earned your certificate of
              completion.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setQuizPassed(false)}>
            Retake Final Quiz
          </Button>
          <Button asChild>
            <Link href={`/dashboard/certificates`}>
              <Award className="mr-2 h-4 w-4" />
              View Certificate
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (quizAttempted && !quizPassed) {
    return (
      <Card className="mt-8 border-amber-200 bg-amber-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <CardTitle>Final Quiz Attempted</CardTitle>
          </div>
          <CardDescription>
            You've attempted the final quiz but haven't passed yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-amber-700">
            Review the course material and try again. You need to score at least{" "}
            {quiz.passingScore}% to pass and complete the course.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setQuizAttempted(false)}>Try Again</Button>
        </CardFooter>
      </Card>
    );
  }

  // Format questions for the QuizComponent
  const formattedQuestions = quiz.questions.map((q: any) => ({
    id: q._id,
    text: q.question,
    options: q.options.map((opt: string, idx: number) => ({
      id: idx.toString(),
      text: opt,
    })),
    correctOptionId: q.correctOption.toString(),
    explanation: q.explanation,
  }));

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-bold">Final Course Quiz</h2>
      <p className="mb-6 text-muted-foreground">
        Complete this final quiz to demonstrate your mastery of the course
        material and earn your certificate.
      </p>
      <QuizComponent
        quizId={quiz._id}
        courseId={courseId}
        title={quiz.title || "Final Course Assessment"}
        description={
          quiz.description || "Test your knowledge of all course material"
        }
        questions={formattedQuestions}
        passingScore={quiz.passingScore}
        onComplete={handleQuizComplete}
      />
    </div>
  );
}
