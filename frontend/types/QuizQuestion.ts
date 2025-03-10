export type QuizQuestion = {
  id: string;
  documentId: string;
  category: string;
  content: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  difficulty: string;
};

export type StrapiQuestionDefination = {
  id: number;
  documentId: string;
  content: string;
  correctAnswer: string;
  incorrect_1: string;
  incorrect_2: string;
  incorrect_3: string;
  difficulty: 'easy'|'medium'|'hard';
  explanation: string;
  category: {
    id: number;
    documentId: string;
    categoryName: string;
    slug: string;
  }
};