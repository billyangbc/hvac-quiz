export type QuizQuestion = {
  category: string;
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  difficulty: string;
  type: string;
  tags: string[];
  id: string;
  regions?: [];
  isNiche?: boolean;
}
  