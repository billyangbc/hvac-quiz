export type Question = {
  id?: string;
  documentId: string;
  content: string;
  correctAnswer: string;
  difficulty: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    documentId: string;
    categoryName: string;
    slug: string;
  };
  incorrect_1?: string;
  incorrect_2?: string;
  incorrect_3?: string;
  explanation?: string;
};