import { Category } from "@/types/dashboard/Category";

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
