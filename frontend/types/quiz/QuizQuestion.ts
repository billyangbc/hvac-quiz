import { Category } from "@/types/dashboard/Category";
import { Question } from "@/types/dashboard/Question";

export type QuizQuestion = {
  documentId: string;
  content: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  difficulty: string;
  category: Category;
};

export type Test = {
  testName: string;
  creator: string;
  category: string;
  questions: string[];
  failedQuestions?: string[];
  score?: number;
};

export type QuizRsult = {
  score?: number;
  total?: number;
  failedQuestions?: string[];
  testId: string;
};

export type ResultType = {
  id: number;
  documentId: string;
  createdAt: string;
  testName: string;
  score: number;
  category: {
    categoryName: string;
    slug: string;
  }
  questions: {
    count: number;
  }
  failedQuestions: {
    count: number;
  }
};

export type ReviseTest = {
  id: number;
  documentId: string;
  createdAt: string;
  testName: string;
  score: number;
  failedQuestions: Question[];
};