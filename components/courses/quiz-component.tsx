// "use client";

// import { useState } from "react";
// import { Check, X, HelpCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Progress } from "@/components/ui/progress";
// import { toast } from "@/components/ui/use-toast";

// interface Question {
//   id: string;
//   text: string;
//   options: {
//     id: string;
//     text: string;
//   }[];
//   correctOptionId: string;
//   explanation?: string;
// }

// interface QuizProps {
//   quizId: string;
//   courseId: string;
//   title: string;
//   description?: string;
//   questions: Question[];
//   passingScore: number;
//   onComplete?: (score: number, passed: boolean) => void;
// }

// export function QuizComponent({
//   quizId,
//   courseId,
//   title,
//   description,
//   questions,
//   passingScore,
//   onComplete,
// }: QuizProps) {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState<
//     Record<string, string>
//   >({});
//   const [showResults, setShowResults] = useState(false);
//   const [score, setScore] = useState(0);
//   const [submitting, setSubmitting] = useState(false);

//   const currentQuestion = questions[currentQuestionIndex];

//   const handleOptionSelect = (optionId: string) => {
//     setSelectedOptions({
//       ...selectedOptions,
//       [currentQuestion.id]: optionId,
//     });
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       calculateScore();
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const calculateScore = () => {
//     let correctAnswers = 0;

//     questions.forEach((question) => {
//       if (selectedOptions[question.id] === question.correctOptionId) {
//         correctAnswers++;
//       }
//     });

//     const calculatedScore = Math.round(
//       (correctAnswers / questions.length) * 100
//     );
//     setScore(calculatedScore);
//     setShowResults(true);
//   };

//   const submitQuizResults = async () => {
//     if (submitting) return;

//     setSubmitting(true);

//     try {
//       const response = await fetch("/api/courses/enrollments/quiz", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           courseId,
//           quizId,
//           score,
//         }),
//       });

//       if (!response.ok) throw new Error("Failed to submit quiz results");

//       const data = await response.json();

//       // Call the onComplete callback
//       onComplete?.(score, data.passed);

//       toast({
//         title: data.passed ? "Quiz Passed!" : "Quiz Failed",
//         description: data.passed
//           ? `Congratulations! You scored ${score}% and passed the quiz.`
//           : `You scored ${score}%. You need ${passingScore}% to pass. Try again!`,
//         variant: data.passed ? "default" : "destructive",
//       });
//     } catch (error) {
//       console.error("Error submitting quiz results:", error);
//       toast({
//         title: "Error",
//         description: "Failed to submit quiz results. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const resetQuiz = () => {
//     setCurrentQuestionIndex(0);
//     setSelectedOptions({});
//     setShowResults(false);
//     setScore(0);
//   };

//   const isOptionCorrect = (questionId: string, optionId: string) => {
//     const question = questions.find((q) => q.id === questionId);
//     return question?.correctOptionId === optionId;
//   };

//   const isOptionSelected = (questionId: string, optionId: string) => {
//     return selectedOptions[questionId] === optionId;
//   };

//   const isPassed = score >= passingScore;

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>{title}</CardTitle>
//         {description && <CardDescription>{description}</CardDescription>}
//       </CardHeader>

//       {!showResults ? (
//         <CardContent>
//           <div className="mb-6">
//             <div className="mb-2 flex justify-between text-sm">
//               <span>
//                 Question {currentQuestionIndex + 1} of {questions.length}
//               </span>
//               <span>
//                 {Math.round(
//                   ((currentQuestionIndex + 1) / questions.length) * 100
//                 )}
//                 % Complete
//               </span>
//             </div>
//             <Progress
//               value={((currentQuestionIndex + 1) / questions.length) * 100}
//               className="h-2"
//             />
//           </div>

//           <div className="space-y-4">
//             <h3 className="text-lg font-medium">{currentQuestion.text}</h3>

//             <RadioGroup
//               value={selectedOptions[currentQuestion.id] || ""}
//               onValueChange={handleOptionSelect}
//               className="space-y-3"
//             >
//               {currentQuestion.options.map((option) => (
//                 <div
//                   key={option.id}
//                   className="flex items-start space-x-2 rounded-md border p-3"
//                 >
//                   <RadioGroupItem
//                     value={option.id}
//                     id={option.id}
//                     className="mt-1"
//                   />
//                   <Label htmlFor={option.id} className="flex-1 cursor-pointer">
//                     {option.text}
//                   </Label>
//                 </div>
//               ))}
//             </RadioGroup>
//           </div>
//         </CardContent>
//       ) : (
//         <CardContent>
//           <div className="mb-6 space-y-4 text-center">
//             <div className="flex justify-center">
//               {isPassed ? (
//                 <div className="rounded-full bg-green-100 p-3">
//                   <Check className="h-6 w-6 text-green-600" />
//                 </div>
//               ) : (
//                 <div className="rounded-full bg-red-100 p-3">
//                   <X className="h-6 w-6 text-red-600" />
//                 </div>
//               )}
//             </div>
//             <h3 className="text-xl font-bold">
//               {isPassed ? "Quiz Passed!" : "Quiz Failed"}
//             </h3>
//             <p>
//               You scored {score}%.{" "}
//               {isPassed
//                 ? "Congratulations on passing the quiz!"
//                 : `You need ${passingScore}% to pass. Try again!`}
//             </p>

//             <div className="mt-4">
//               <div className="mb-2 flex justify-between text-sm">
//                 <span>Your Score</span>
//                 <span>{score}%</span>
//               </div>
//               <Progress
//                 value={score}
//                 className={`h-2 ${isPassed ? "bg-green-100" : "bg-red-100"}`}
//                 indicatorClassName={isPassed ? "bg-green-600" : "bg-red-600"}
//               />
//               <div className="mt-1 text-right text-xs text-muted-foreground">
//                 Passing Score: {passingScore}%
//               </div>
//             </div>
//           </div>

//           <div className="mt-8 space-y-6">
//             <h4 className="font-medium">Review Your Answers</h4>
//             {questions.map((question, index) => (
//               <div
//                 key={question.id}
//                 className="space-y-2 rounded-lg border p-4"
//               >
//                 <div className="flex items-start justify-between">
//                   <h5 className="font-medium">Question {index + 1}</h5>
//                   {selectedOptions[question.id] === question.correctOptionId ? (
//                     <div className="flex items-center text-green-600">
//                       <Check className="mr-1 h-4 w-4" />
//                       <span className="text-sm">Correct</span>
//                     </div>
//                   ) : (
//                     <div className="flex items-center text-red-600">
//                       <X className="mr-1 h-4 w-4" />
//                       <span className="text-sm">Incorrect</span>
//                     </div>
//                   )}
//                 </div>
//                 <p>{question.text}</p>

//                 <div className="space-y-2">
//                   {question.options.map((option) => (
//                     <div
//                       key={option.id}
//                       className={`flex items-start space-x-2 rounded-md border p-3 ${
//                         isOptionCorrect(question.id, option.id)
//                           ? "border-green-600 bg-green-50"
//                           : isOptionSelected(question.id, option.id) &&
//                             !isOptionCorrect(question.id, option.id)
//                           ? "border-red-600 bg-red-50"
//                           : ""
//                       }`}
//                     >
//                       <div className="mt-0.5">
//                         {isOptionCorrect(question.id, option.id) ? (
//                           <Check className="h-4 w-4 text-green-600" />
//                         ) : isOptionSelected(question.id, option.id) ? (
//                           <X className="h-4 w-4 text-red-600" />
//                         ) : (
//                           <div className="h-4 w-4" />
//                         )}
//                       </div>
//                       <div className="flex-1">
//                         <p
//                           className={`${
//                             isOptionCorrect(question.id, option.id)
//                               ? "text-green-600"
//                               : isOptionSelected(question.id, option.id) &&
//                                 !isOptionCorrect(question.id, option.id)
//                               ? "text-red-600"
//                               : ""
//                           }`}
//                         >
//                           {option.text}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {question.explanation && (
//                   <div className="mt-2 flex items-start rounded-md bg-blue-50 p-3 text-sm">
//                     <HelpCircle className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
//                     <p>{question.explanation}</p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       )}

//       <CardFooter className="flex justify-between">
//         {!showResults ? (
//           <>
//             <Button
//               variant="outline"
//               onClick={handlePrevious}
//               disabled={currentQuestionIndex === 0}
//             >
//               Previous
//             </Button>
//             <Button
//               onClick={handleNext}
//               disabled={!selectedOptions[currentQuestion.id]}
//             >
//               {currentQuestionIndex < questions.length - 1
//                 ? "Next"
//                 : "Finish Quiz"}
//             </Button>
//           </>
//         ) : (
//           <>
//             <Button variant="outline" onClick={resetQuiz}>
//               Retake Quiz
//             </Button>
//             <Button onClick={submitQuizResults} disabled={submitting}>
//               {submitting ? "Submitting..." : "Submit Results"}
//             </Button>
//           </>
//         )}
//       </CardFooter>
//     </Card>
//   );
// }

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation?: string;
}

interface QuizComponentProps {
  quizId: string;
  courseId: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore: number;
  onComplete?: (score: number, passed: boolean) => void;
}

export function QuizComponent({
  quizId,
  courseId,
  title,
  description,
  questions,
  passingScore,
  onComplete,
}: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasSelectedOption = !!selectedOptions[currentQuestion?.id];
  const isCorrect =
    currentQuestion &&
    selectedOptions[currentQuestion.id] === currentQuestion.correctOptionId;

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    setShowExplanation(false);
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (selectedOptions[question.id] === question.correctOptionId) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const handleSubmitQuiz = async () => {
    try {
      setIsSubmitting(true);
      const calculatedScore = calculateScore();
      setScore(calculatedScore);

      // Submit the quiz results to the server
      const response = await fetch(`/api/courses/enrollments/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId,
          courseId,
          score: calculatedScore,
          answers: selectedOptions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }

      const data = await response.json();
      const passed = data.passed;

      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete(calculatedScore, passed);
      }

      toast({
        title: passed ? "Quiz Passed!" : "Quiz Not Passed",
        description: passed
          ? `Congratulations! You scored ${calculatedScore}%`
          : `You scored ${calculatedScore}%. Required: ${passingScore}%`,
        variant: passed ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-amber-500" />
            <h3 className="mb-2 text-lg font-medium">No Questions Available</h3>
            <p className="text-muted-foreground">
              This quiz doesn't have any questions yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const passed = score >= passingScore;
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
          <CardDescription>
            You scored {score}% on this quiz.{" "}
            {passed ? "Congratulations!" : "Keep practicing!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <span>Your Score</span>
              <span className="font-bold">{score}%</span>
            </div>
            <Progress value={score} className="h-3" />
            <div className="flex items-center justify-between">
              <span>Passing Score</span>
              <span>{passingScore}%</span>
            </div>
            <Progress value={passingScore} className="h-2 bg-muted" />
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-medium">Question Summary</h3>
            <div className="space-y-3">
              {questions.map((question, index) => {
                const isCorrect =
                  selectedOptions[question.id] === question.correctOptionId;
                return (
                  <div key={question.id} className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    ) : (
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">
                        Question {index + 1}: {question.text}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-muted-foreground">
                          Correct answer:{" "}
                          {
                            question.options.find(
                              (opt) => opt.id === question.correctOptionId
                            )?.text
                          }
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>Retake Quiz</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <p className="text-xs text-muted-foreground">
              Passing score: {passingScore}%
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          />
        </div>

        <div className="mb-6">
          <h3 className="mb-4 text-lg font-medium">{currentQuestion.text}</h3>
          <RadioGroup
            value={selectedOptions[currentQuestion.id] || ""}
            onValueChange={handleOptionSelect}
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => (
              <div
                key={option.id}
                className={`flex items-center space-x-2 rounded-md border p-3 ${
                  showExplanation &&
                  option.id === currentQuestion.correctOptionId
                    ? "border-green-200 bg-green-50"
                    : showExplanation &&
                      selectedOptions[currentQuestion.id] === option.id
                    ? "border-red-200 bg-red-50"
                    : ""
                }`}
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <label
                  htmlFor={option.id}
                  className="flex-1 cursor-pointer font-medium"
                >
                  {option.text}
                </label>
                {showExplanation &&
                  option.id === currentQuestion.correctOptionId && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                {showExplanation &&
                  selectedOptions[currentQuestion.id] === option.id &&
                  option.id !== currentQuestion.correctOptionId && (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
              </div>
            ))}
          </RadioGroup>
        </div>

        {showExplanation && currentQuestion.explanation && (
          <div className="mb-6 rounded-md bg-blue-50 p-4 text-blue-800">
            <h4 className="mb-1 font-medium">Explanation:</h4>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
        </div>
        <div className="flex gap-2">
          {!showExplanation && hasSelectedOption && (
            <Button variant="outline" onClick={() => setShowExplanation(true)}>
              Check Answer
            </Button>
          )}
          {(showExplanation || !hasSelectedOption) && (
            <Button onClick={handleNextQuestion} disabled={!hasSelectedOption}>
              {isLastQuestion ? "Finish Quiz" : "Next Question"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {isLastQuestion && showExplanation && (
            <Button onClick={handleSubmitQuiz} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
