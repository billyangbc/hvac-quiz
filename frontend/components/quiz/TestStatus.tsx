"use client";

import { ResultType } from "@/types/quiz/QuizQuestion";
import TestStatusCard from "@/components/quiz/TestStatusCard";
import TestStatusBar from "@/components/quiz/TestStatusBar";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Function to prepare data for the line chart
const prepareChartData = (results: ResultType[]) => {
  // Sort results by date (oldest to newest)
  const sortedResults = [...results].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  
  // Transform data for the chart
  return sortedResults.map(result => ({
    time: formatChartDate(result.createdAt),
    score: result.score,
    category: result.category.categoryName,
    categorySlug: result.category.slug,
    // Store original date for tooltip
    originalDate: result.createdAt,
    // Calculate percentage score
    percentage: result.questions.count > 0 
      ? Math.round((result.score / result.questions.count) * 100) 
      : 0
  }));
};

// Function to format date for chart
const formatChartDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const TestStatus = ({
  testResult
}: {
  testResult: ResultType[];
}) => {
  // Prepare data for chart
  const chartData = prepareChartData(testResult);
  
  // Get unique categories
  const uniqueCategories = Array.from(
    new Set(chartData.map(item => item.categorySlug))
  );
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Your Test Results</h1>
      
      {testResult.length > 0 && (
        <>
          <TestStatusBar testResult={testResult} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testResult.map((result) => (
              <TestStatusCard key={result.id} result={result} />
            ))}
          </div>
        </>
      )}
      {testResult.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">No test results yet</h2>
          <p className="text-muted-foreground mb-6">Take a quiz to see your results here</p>
          <Link href="/quiz">
            <Button>Start a Quiz</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default TestStatus;
