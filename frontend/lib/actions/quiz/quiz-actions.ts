"use server";

import { getCurrentUser } from "@/lib/services/auth";
import fetchData from "@/lib/services/fetch-data";
import { QuizQuestion, StrapiQuestionDefination } from "@/types/QuizQuestion";

//TODO: replace this with db data source
const difficultyOptions = [
  { value: "easy", option: "Easy" },
  { value: "medium", option: "Medium" },
  { value: "hard", option: "Hard" },
];

export const getDifficultyOptions = async (): Promise<{value: string, option: string}[]> => {
  return difficultyOptions;
}

export const validateDifficulty = async (difficulty: string) => {
  const validDifficulties = difficultyOptions.map((option) => option.value);
  return validDifficulties.includes(difficulty);
};

export const getQuizSettingData = async () => {
  const currUser = await getCurrentUser();
  if (currUser) {
    const query = {
      filters: {
        learners: {
          id: currUser.id
        }
      },
      fields: ["documentId", "name"],
      populate: {
        categories: {
          fields: ["documentId", "categoryName", "slug"]
        }
      }
    }
    const response = await fetchData("/api/enrollments", query);
    return response?.data;
  }
}

export const getQuestions = async (category: string, difficulty: string, limit: string): Promise<QuizQuestion[]> => {
    const query = {
      filters: {
        category: {
          documentId: category
        }
      },
      fields: ["id", "documentId", "content", "correctAnswer", "incorrect_1", "incorrect_2", "incorrect_3", "difficulty", "explanation"],
      populate: {
        category: {
          fields: ["documentId", "categoryName", "slug"]
        }
      }
    }
    const response = await fetchData("/api/questions", query);
    const data = response?.data;
    return data?.map((question: StrapiQuestionDefination) => ({
      category: question.category.categoryName,
      content: question.content,
      correctAnswer: question.correctAnswer,
      incorrectAnswers: [
        question.incorrect_1,
        question.incorrect_2,
        question.incorrect_3,
      ],
      difficulty: question.difficulty,
      id: question.id.toString(),
    }));
}
