"use client";

import { ResultType } from "@/types/quiz/QuizQuestion";
import TestStatusCard from "@/components/quiz/TestStatusCard";
import TestStatusBar from "@/components/quiz/TestStatusBar";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import Link from "next/link";

const TestStatus = ({
  testResult
}: {
  testResult: ResultType[];
}) => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Your Test Results</h1>
      
      {testResult?.length > 0 && (
        <>
          <TestStatusBar testResult={testResult} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testResult.map((result) => (
              <TestStatusCard key={result.id} result={result} />
            ))}
          </div>
        </>
      )}
      {(!testResult || testResult?.length === 0) && (
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
