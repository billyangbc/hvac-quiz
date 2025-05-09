"use client";

import { ResultType } from "@/types/quiz/QuizQuestion";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  CheckCircle, 
  ChevronRight, 
  ClipboardList, 
  Flame, 
  XCircle 
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'furnace-1':
      return <Flame className="h-5 w-5 text-orange-500" />;
    case 'heating':
      return <Flame className="h-5 w-5 text-red-500" />;
    default:
      return <BookOpen className="h-5 w-5 text-blue-500" />;
  }
};
// Function to calculate pass status
const getPassStatus = (result: ResultType) => {
  const score = result.score;
  const totalQuestions = result.questions.count;
  const failedQuestions = result.failedQuestions.count;
  const passedQuestions = totalQuestions - failedQuestions;

  // if no score and no faildQuestions, the test is not finished.
  if (score < 1 && failedQuestions < 1) {
    return false;
  }
  // Consider it passed if at least 70% of questions are correct
  const passPercentage = (passedQuestions / totalQuestions) * 100;
  return passPercentage >= 70;
};
const TestStatusCard = ({result}: {result: ResultType}) => {
  const totalQuestions = result.questions.count;
  const scorePercentage = totalQuestions > 0 
    ? (result.score / totalQuestions) * 100 
    : 0;
  const isPassed = getPassStatus(result);
  
  return (
    <Card key={result.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getCategoryIcon(result.category?.slug)}
            <CardTitle className="text-lg font-medium">
              {result.category?.categoryName ?? 'No Category'}
            </CardTitle>
          </div>
          <Badge 
            variant={isPassed ? "default" : "destructive"}
            className={`${isPassed ? 'bg-emerald-500' : 'bg-rose-500'} text-white`}
          >
            {isPassed ? (
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Passed
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Failed
              </span>
            )}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {formatDate(result.createdAt)}
        </p>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm mb-1">
            <span>Score</span>
            <span className="font-medium">{result.score}/{totalQuestions}</span>
          </div>
          
          <Progress 
            value={scorePercentage} 
            className="h-2"
            // Apply color based on score percentage
            style={{
              backgroundColor: '#f1f5f9', // Light gray background
            }}
          >
            <div 
              className="h-full transition-all" 
              style={{
                width: `${scorePercentage}%`,
                backgroundColor: isPassed ? '#10b981' : '#f43f5e',
              }}
            />
          </Progress>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ClipboardList className="h-4 w-4" />
              <span>Questions: {totalQuestions}</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="h-4 w-4 text-rose-500" />
              <span>Failed: {result.failedQuestions.count}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-4">
        <Link href={`/quiz/revise/${result.documentId}`} className="w-full">
          <Button variant="outline" className="w-full flex justify-between items-center">
            <span>Review Failed Questions</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TestStatusCard;