"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Edit,
  Trash,
  Plus,
  MoreHorizontal,
  CheckCircle,
  Save,
  Layers,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuizQuestion {
  _id?: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation?: string;
}

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  course: string;
  chapter?: string;
  lesson?: string;
  passingScore: number;
  questions: QuizQuestion[];
  attemptsCount?: number;
  passedCount?: number;
  isPublished: boolean;
}

interface Course {
  _id: string;
  title: string;
}

interface Chapter {
  _id: string;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  _id: string;
  title: string;
  chapter: string;
}

const quizFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  passingScore: z.coerce.number().min(1).max(100),
  chapter: z.string(),
  lesson: z.string(),
  isPublished: z.boolean().default(false),
});

const questionFormSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters"),
  options: z.array(z.string()).min(2, "At least 2 options are required"),
  correctOption: z.number().min(0),
  explanation: z.string().optional(),
});

interface AdminQuizzesProps {
  courseId: string;
}

export function AdminQuizzes({ courseId }: AdminQuizzesProps) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [openQuizDialog, setOpenQuizDialog] = useState(false);
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [savingQuestions, setSavingQuestions] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const quizForm = useForm<z.infer<typeof quizFormSchema>>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: "",
      description: "",
      passingScore: 70,
      chapter: "none",
      lesson: "none",
      isPublished: false,
    },
  });

  const questionForm = useForm<z.infer<typeof questionFormSchema>>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      question: "",
      options: ["", ""],
      correctOption: 0,
      explanation: "",
    },
  });

  useEffect(() => {
    fetchCourse();
    fetchChapters();
    fetchQuizzes();
  }, [courseId]);

  // Watch for chapter changes to update lessons
  useEffect(() => {
    const subscription = quizForm.watch((value, { name }) => {
      if (name === "chapter") {
        if (value.chapter && value.chapter !== "none") {
          setSelectedChapter(value.chapter);
        } else {
          setSelectedChapter(null);
        }
        // Reset lesson when chapter changes
        quizForm.setValue("lesson", "none");
      }
    });
    return () => subscription.unsubscribe();
  }, [quizForm, quizForm.watch]);

  // Update available lessons when selected chapter changes
  useEffect(() => {
    if (selectedChapter) {
      const chapterLessons =
        chapters.find((c) => c._id === selectedChapter)?.lessons || [];
      setLessons(chapterLessons);
    } else {
      setLessons([]);
    }
  }, [selectedChapter, chapters]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) throw new Error("Failed to fetch course");
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course:", error);
      toast({
        title: "Error",
        description: "Failed to load course details",
        variant: "destructive",
      });
    }
  };

  const fetchChapters = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/chapters`);
      if (!response.ok) throw new Error("Failed to fetch chapters");
      const data = await response.json();
      setChapters(data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
      toast({
        title: "Error",
        description: "Failed to load chapters",
        variant: "destructive",
      });
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/quizzes`);
      if (!response.ok) throw new Error("Failed to fetch quizzes");
      const data = await response.json();

      // Ensure each quiz has a questions array
      const processedQuizzes = data.map((quiz: any) => ({
        ...quiz,
        questions: quiz.questions || [],
      }));

      setQuizzes(processedQuizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      toast({
        title: "Error",
        description: "Failed to load quizzes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (values: z.infer<typeof quizFormSchema>) => {
    try {
      // Process the values to handle "none" values
      const processedValues = {
        ...values,
        chapter: values.chapter === "none" ? undefined : values.chapter,
        lesson: values.lesson === "none" ? undefined : values.lesson,
      };

      const response = await fetch(`/api/courses/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...processedValues,
          course: courseId,
          questions: [],
        }),
      });

      if (!response.ok) throw new Error("Failed to create quiz");

      const newQuiz = await response.json();

      // Ensure the new quiz has a questions array
      const processedQuiz = {
        ...newQuiz,
        questions: newQuiz.questions || [],
      };

      setQuizzes([...quizzes, processedQuiz]);
      setOpenQuizDialog(false);
      resetQuizForm();

      toast({
        title: "Success",
        description: "Quiz created successfully",
      });

      // Set as current quiz to add questions
      setCurrentQuiz(processedQuiz);
      setQuestions([]);
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast({
        title: "Error",
        description: "Failed to create quiz",
        variant: "destructive",
      });
    }
  };

  const handleUpdateQuiz = async (values: z.infer<typeof quizFormSchema>) => {
    if (!editingQuiz) return;

    try {
      // Process the values to handle "none" values
      const processedValues = {
        ...values,
        chapter: values.chapter === "none" ? undefined : values.chapter,
        lesson: values.lesson === "none" ? undefined : values.lesson,
      };

      const response = await fetch(`/api/courses/quizzes/${editingQuiz._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedValues),
      });

      if (!response.ok) throw new Error("Failed to update quiz");

      const updatedQuiz = await response.json();

      // Ensure the updated quiz has a questions array
      const processedQuiz = {
        ...updatedQuiz,
        questions: updatedQuiz.questions || [],
      };

      setQuizzes(
        quizzes.map((quiz) =>
          quiz._id === processedQuiz._id ? processedQuiz : quiz
        )
      );
      setOpenQuizDialog(false);
      resetQuizForm();

      toast({
        title: "Success",
        description: "Quiz updated successfully",
      });
    } catch (error) {
      console.error("Error updating quiz:", error);
      toast({
        title: "Error",
        description: "Failed to update quiz",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/quizzes/${quizId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete quiz");

      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));

      toast({
        title: "Success",
        description: "Quiz deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast({
        title: "Error",
        description: "Failed to delete quiz",
        variant: "destructive",
      });
    }
  };

  const handleAddQuestion = async (
    values: z.infer<typeof questionFormSchema>
  ) => {
    if (!currentQuiz) return;

    try {
      // If editing an existing question
      if (editingQuestionIndex !== null) {
        const updatedQuestions = [...questions];
        updatedQuestions[editingQuestionIndex] = values;
        setQuestions(updatedQuestions);
      } else {
        // Adding a new question
        setQuestions([...questions, values]);
      }

      setOpenQuestionDialog(false);
      resetQuestionForm();

      toast({
        title: "Success",
        description:
          editingQuestionIndex !== null
            ? "Question updated successfully"
            : "Question added successfully",
      });
    } catch (error) {
      console.error("Error adding/updating question:", error);
      toast({
        title: "Error",
        description: "Failed to save question",
        variant: "destructive",
      });
    }
  };

  const saveQuizQuestions = async () => {
    if (!currentQuiz) return;

    try {
      setSavingQuestions(true);
      const response = await fetch(
        `/api/courses/quizzes/${currentQuiz._id}/questions`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ questions }),
        }
      );

      if (!response.ok) throw new Error("Failed to save questions");

      // Update the quizzes state with the updated questions
      setQuizzes(
        quizzes.map((quiz) =>
          quiz._id === currentQuiz._id ? { ...quiz, questions } : quiz
        )
      );

      toast({
        title: "Success",
        description: "Questions saved successfully",
      });
    } catch (error) {
      console.error("Error saving questions:", error);
      toast({
        title: "Error",
        description: "Failed to save questions",
        variant: "destructive",
      });
    } finally {
      setSavingQuestions(false);
    }
  };

  const handleDeleteQuestion = async (index: number) => {
    if (
      !currentQuiz ||
      !confirm("Are you sure you want to delete this question?")
    ) {
      return;
    }

    try {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);

      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting question:", error);
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  const openCreateQuizDialog = () => {
    resetQuizForm();
    setEditingQuiz(null);
    setOpenQuizDialog(true);
  };
  const openEditQuizDialog = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setSelectedChapter(quiz.chapter || null);

    quizForm.reset({
      title: quiz.title,
      description: quiz.description || "",
      passingScore: quiz.passingScore,
      chapter: quiz.chapter || "none",
      lesson: quiz.lesson || "none",
      isPublished: quiz.isPublished,
    });

    setOpenQuizDialog(true);
  };

  const openCreateQuestionDialog = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setQuestions(quiz.questions || []);
    resetQuestionForm();
    setEditingQuestionIndex(null);
    setOpenQuestionDialog(true);
  };

  const openEditQuestionDialog = (quiz: Quiz, questionIndex: number) => {
    setCurrentQuiz(quiz);
    setQuestions(quiz.questions || []);
    setEditingQuestionIndex(questionIndex);

    const question = quiz.questions[questionIndex];
    questionForm.reset({
      question: question.question,
      options: question.options,
      correctOption: question.correctOption,
      explanation: question.explanation || "",
    });

    setOpenQuestionDialog(true);
  };

  const resetQuizForm = () => {
    quizForm.reset({
      title: "",
      description: "",
      passingScore: 70,
      chapter: "none",
      lesson: "none",
      isPublished: false,
    });
    setSelectedChapter(null);
    setEditingQuiz(null);
  };

  const resetQuestionForm = () => {
    questionForm.reset({
      question: "",
      options: ["", ""],
      correctOption: 0,
      explanation: "",
    });
    setEditingQuestionIndex(null);
  };

  const addOption = () => {
    const currentOptions = questionForm.getValues("options");
    questionForm.setValue("options", [...currentOptions, ""]);
  };

  const removeOption = (index: number) => {
    const currentOptions = questionForm.getValues("options");
    if (currentOptions.length <= 2) return; // Minimum 2 options

    // Adjust correctOption if needed
    const correctOption = questionForm.getValues("correctOption");
    if (correctOption === index) {
      questionForm.setValue("correctOption", 0);
    } else if (correctOption > index) {
      questionForm.setValue("correctOption", correctOption - 1);
    }

    questionForm.setValue(
      "options",
      currentOptions.filter((_, i) => i !== index)
    );
  };

  const viewQuizQuestions = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setQuestions(quiz.questions || []);
  };

  const getQuizScope = (quiz: Quiz) => {
    if (quiz.lesson) return "Lesson Quiz";
    if (quiz.chapter) return "Chapter Quiz";
    return "Course Quiz";
  };

  const getQuizScopeBadge = (quiz: Quiz) => {
    if (quiz.lesson) {
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700">
          <BookOpen className="mr-1 h-3 w-3" />
          Lesson Quiz
        </Badge>
      );
    }
    if (quiz.chapter) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          <Layers className="mr-1 h-3 w-3" />
          Chapter Quiz
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700">
        Course Quiz
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="mt-1 h-4 w-[300px]" />
          </div>
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[150px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Quizzes for {course?.title}</h2>
          <p className="text-muted-foreground">
            Manage quizzes and assessments for your course
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/courses`)}
          >
            Back to Courses
          </Button>
          <Button onClick={openCreateQuizDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Create Quiz
          </Button>
        </div>
      </div>

      {currentQuiz ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{currentQuiz.title}</h3>
                {getQuizScopeBadge(currentQuiz)}
              </div>
              <p className="text-muted-foreground">
                Passing score: {currentQuiz.passingScore}% • {questions.length}{" "}
                questions
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentQuiz(null)}>
                Back to Quizzes
              </Button>
              <Button onClick={() => openCreateQuestionDialog(currentQuiz)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
              {questions.length > 0 && (
                <Button onClick={saveQuizQuestions} disabled={savingQuestions}>
                  <Save className="mr-2 h-4 w-4" />
                  {savingQuestions ? "Saving..." : "Save Questions"}
                </Button>
              )}
            </div>
          </div>

          {questions.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No questions yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Get started by adding questions to this quiz
              </p>
              <Button onClick={() => openCreateQuestionDialog(currentQuiz)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Question {index + 1}: {question.question}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            openEditQuestionDialog(currentQuiz, index)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteQuestion(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`flex items-center rounded-md p-2 ${
                            optionIndex === question.correctOption
                              ? "bg-green-50 text-green-700"
                              : ""
                          }`}
                        >
                          <div className="mr-2">
                            {optionIndex === question.correctOption ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border border-muted-foreground" />
                            )}
                          </div>
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                    {question.explanation && (
                      <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">No quizzes yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Get started by creating your first quiz
          </p>
          <Button onClick={openCreateQuizDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Create Quiz
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <Card key={quiz._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{quiz.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => openEditQuizDialog(quiz)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Quiz
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => viewQuizQuestions(quiz)}>
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Manage Questions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteQuiz(quiz._id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Quiz
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quiz.description && (
                    <p className="text-sm text-muted-foreground">
                      {quiz.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center text-sm">
                      <span className="font-medium">Questions:</span>
                      <span className="ml-1">
                        {quiz.questions ? quiz.questions.length : 0}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium">Passing Score:</span>
                      <span className="ml-1">{quiz.passingScore}%</span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getQuizScopeBadge(quiz)}
                    {quiz.isPublished ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700"
                      >
                        Published
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-gray-50 text-gray-700"
                      >
                        Draft
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quiz Form Dialog */}
      <Dialog open={openQuizDialog} onOpenChange={setOpenQuizDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingQuiz ? "Edit Quiz" : "Create Quiz"}
            </DialogTitle>
            <DialogDescription>
              {editingQuiz
                ? "Update the details of your quiz"
                : "Fill in the details to create a new quiz"}
            </DialogDescription>
          </DialogHeader>

          <Form {...quizForm}>
            <form
              onSubmit={quizForm.handleSubmit(
                editingQuiz ? handleUpdateQuiz : handleCreateQuiz
              )}
              className="space-y-4"
            >
              <FormField
                control={quizForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>The title of your quiz</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={quizForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        placeholder="Describe what this quiz is about"
                      />
                    </FormControl>
                    <FormDescription>
                      Optional description of what this quiz covers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={quizForm.control}
                name="chapter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chapter (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a chapter" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">
                          None (Course-level Quiz)
                        </SelectItem>
                        {chapters.map((chapter) => (
                          <SelectItem key={chapter._id} value={chapter._id}>
                            {chapter.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Associate this quiz with a specific chapter
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={quizForm.control}
                name="lesson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson (Optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedChapter || lessons.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              selectedChapter
                                ? "Select a lesson"
                                : "Select a chapter first"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">
                          None (Chapter-level Quiz)
                        </SelectItem>
                        {lessons.map((lesson) => (
                          <SelectItem key={lesson._id} value={lesson._id}>
                            {lesson.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Associate this quiz with a specific lesson
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={quizForm.control}
                name="passingScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passing Score (%)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={100} {...field} />
                    </FormControl>
                    <FormDescription>
                      The minimum percentage required to pass this quiz
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={quizForm.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Published</FormLabel>
                      <FormDescription>
                        Make this quiz available to students
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenQuizDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingQuiz ? "Update Quiz" : "Create Quiz"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Question Form Dialog */}
      <Dialog open={openQuestionDialog} onOpenChange={setOpenQuestionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingQuestionIndex !== null ? "Edit Question" : "Add Question"}
            </DialogTitle>
            <DialogDescription>
              {editingQuestionIndex !== null
                ? "Update the details of this question"
                : "Create a new question for your quiz"}
            </DialogDescription>
          </DialogHeader>

          <Form {...questionForm}>
            <form
              onSubmit={questionForm.handleSubmit(handleAddQuestion)}
              className="space-y-4"
            >
              <FormField
                control={questionForm.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your question" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Options</FormLabel>
                <div className="space-y-2">
                  {questionForm.watch("options").map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FormField
                        control={questionForm.control}
                        name="correctOption"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) =>
                                  field.onChange(Number.parseInt(value))
                                }
                                value={field.value.toString()}
                                className="flex"
                              >
                                <RadioGroupItem value={index.toString()} />
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={questionForm.control}
                        name={`options.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={`Option ${index + 1}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {questionForm.watch("options").length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" onClick={addOption}>
                  Add Option
                </Button>
              </div>

              <FormField
                control={questionForm.control}
                name="explanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Explanation (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        placeholder="Explain why the correct answer is right"
                      />
                    </FormControl>
                    <FormDescription>
                      Provide an explanation that will be shown after answering
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenQuestionDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingQuestionIndex !== null
                    ? "Update Question"
                    : "Add Question"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
