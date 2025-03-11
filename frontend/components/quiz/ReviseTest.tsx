"use client";

import { Question } from "@/types/dashboard/Question";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, XCircle, HelpCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ReviseTestProps {
  failedQuestions: Question[];
}

const ReviseTest = ({ failedQuestions }: ReviseTestProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const router = useRouter();

  // Update progress when current question changes
  useEffect(() => {
    setProgressValue(((currentIndex + 1) / failedQuestions.length) * 100);
  }, [currentIndex, failedQuestions.length]);

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  // Handle navigation
  const handleNext = () => {
    if (currentIndex < failedQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleBackToQuiz = () => {
    router.push("/quiz");
  };

  // If no failed questions, show a message
  if (!failedQuestions || failedQuestions.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No questions to revise</h2>
            <p className="text-muted-foreground mb-6">There are no failed questions to review</p>
            <Button onClick={handleBackToQuiz}>Back to Quiz</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = failedQuestions[currentIndex];
  
  // Get all answers for the current question
  const allAnswers = [
    { text: currentQuestion.correctAnswer, isCorrect: true },
    { text: currentQuestion.incorrect_1, isCorrect: false },
    { text: currentQuestion.incorrect_2, isCorrect: false },
    { text: currentQuestion.incorrect_3, isCorrect: false },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBackToQuiz}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quiz
        </Button>
        <Badge variant="outline" className="text-sm">
          Question {currentIndex + 1} of {failedQuestions.length}
        </Badge>
      </div>

      <Progress value={progressValue} className="mb-6" />

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <Badge className={`${getDifficultyColor(currentQuestion.difficulty)}`}>
              {currentQuestion.difficulty}
            </Badge>
            <span className="text-sm text-muted-foreground">
              ID: {currentQuestion.documentId}
            </span>
          </div>
          <CardTitle className="text-xl mt-2">
            {currentQuestion.content}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allAnswers.map((answer, index) => (
              <div 
                key={index}
                className={`flex items-center p-3 rounded-md border ${
                  answer.isCorrect 
                    ? "border-green-200 bg-green-50" 
                    : "border-red-200 bg-red-50"
                }`}
              >
                {answer.isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                )}
                <span className={answer.isCorrect ? "font-medium" : ""}>
                  {answer.text}
                </span>
              </div>
            ))}

            {currentQuestion.explanation && (
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="explanation">
                  <AccordionTrigger className="text-blue-600">
                    View Explanation
                  </AccordionTrigger>
                  <AccordionContent className="bg-blue-50 p-3 rounded-md">
                    {currentQuestion.explanation}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          onClick={handlePrevious} 
          disabled={currentIndex === 0}
          variant="outline"
        >
          Previous
        </Button>
        {currentIndex < failedQuestions.length - 1 ? (
          <Button onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button onClick={handleBackToQuiz}>
            Finish Review
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReviseTest;
