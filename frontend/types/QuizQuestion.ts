import { Category } from "@/types/dashboard/Category";

export type QuizQuestion = {
  documentId: string;
  content: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  difficulty: string;
  category: Category;
};
