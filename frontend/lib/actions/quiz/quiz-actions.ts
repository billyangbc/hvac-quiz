"use server";

import { getCurrentUser } from "@/lib/services/auth";
import fetchData from "@/lib/services/fetch-data";
import { mutateData } from "@/lib/services/mutate-data";
import { QuizQuestion, QuizRsult } from "@/types/quiz/QuizQuestion";
import { Question } from "@/types/dashboard/Question";
import { revalidatePath } from "next/cache";
import { ResultType, ReviseTest } from "@/types/quiz/QuizQuestion";

//TODO: may need to replace this with db data source
const difficultyOptions = [
  { value: "easy", option: "Easy" },
  { value: "medium", option: "Medium" },
  { value: "hard", option: "Hard" },
];

export const getDifficultyOptions = async (): Promise<{value: string, option: string}[]> => {
  return difficultyOptions;
}

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
};

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
    },
    pagination: {
      pageSize: parseInt(limit, 10)
    }
  }
  const response = await fetchData("/api/questions", query);
  const data = response?.data;
  return data?.map((question: Question) => ({
    category: question.category,
    content: question.content,
    correctAnswer: question.correctAnswer,
    incorrectAnswers: [
      question.incorrect_1,
      question.incorrect_2,
      question.incorrect_3,
    ],
    difficulty: question.difficulty,
    documentId: question.documentId,
  }));
};

export const getQuestionMeta = async (category: string) => {
  const query = {
    filters: {
      category: {
        documentId: category
      }
    },
    fields: ["id", "documentId"],
  }
  const response = await fetchData("/api/questions", query);
  const meta = response?.meta;

  return meta;
};

const validateParams = async (difficulty: string, limit: string ) => {
  const validateDifficulty = (difficulty: string) => {
    const validDifficulties = difficultyOptions.map((option) => option.value);
    return validDifficulties.includes(difficulty);
  };

  const validateLimit = (limit: string) => {
    const parsedLimit = parseInt(limit, 10);
    return !isNaN(parsedLimit) && parsedLimit >= 1 && parsedLimit <= 50;
  };
  if ( !validateDifficulty(difficulty) ||
    !validateLimit(limit)
  ) {
    return false;
  }

  return true;
}

const generateTestName = (category: string, difficulty: string, limit: string): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${category}-${difficulty}-${limit}-${year}-${month}-${day}-${hours}${minutes}`;
};

export const createTest = async (category: string, difficulty: string, limit: string) => {
  const paramOk = await validateParams(difficulty, limit);
  if (!paramOk) {
    return false;
  }

  // get questions list under the given category and difficulty
  const responseData = await getQuestions(category, difficulty, limit);
  console.log("questions list for " + `${category}`, responseData);

  const currUser = await getCurrentUser();
  if (responseData.length < 1 || !currUser) {
      return {
        error: "No valid question list",
      };
  }

  // Create a test record with the fetched questions
  const questions = responseData.map((question: QuizQuestion) => {
    return question.documentId;
  });
  const payload = {
    data: {
      testName: generateTestName(responseData[0].category?.slug, difficulty, limit),
      questions: {
        set: questions,
      },
      creator: {
        set: [currUser.id],
      },
      category: {
        set: [category],
      },
      score: 0,
      failedQuestions: {
        set: []
      },
    }
  };

  try {
    const response = await mutateData("POST", "/api/tests", payload);

    if (response?.error) {
      return {
        error: "Test Creation Failed",
        data: payload.data,
        apiErrors: response.error,
      };
    }

    return response?.data;
  } catch (error) {
    return {
      error: "Failed to create test",
      data: payload.data,
      apiErrors: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const saveResult = async (testId: string, failedQuestions: string[], score: number) => {
  const payload = {
    data: {
      ...{},
      failedQuestions: {
        set: [...failedQuestions],
      },
      score: score
    }
  }
 
  try {
    const response = await mutateData(
      "PUT",
      `/api/tests/${testId}`,
      payload
    );
    if (!response) {
      return {
        error: "Failed to save test result",
      };
    }

    if (response.error) {
      return {
        error: "Save test result failed",
        apiErrors: response.error,
      };
    }

    revalidatePath("/dashboard/quiz");

    return {
      message: "Test sult save",
      data: response.data,
      apiErrors: null,
    };
  } catch (error) {
    console.error("Error in save test result:", error);
  }
};

export const getResults = async ():Promise<ResultType[]> => {
  const currUser = await getCurrentUser();
  if (!currUser) {
    return [];
  }
  try {
    const query = {
      filters: {
        creator: {
          id: currUser.id
        }
      },
      fields: ["documentId", "createdAt", "testName", "score"],
      populate: {
        category: {
          fields: ["documentId", "categoryName", "slug"]
        },
        questions: {
          count: true
        },
        failedQuestions: {
          count: true
        }
      }
    }
    const response = await fetchData("/api/tests", query);
    return response?.data;
  } catch (error) {
    console.error("Error fetching enrollment:", error);
    throw error;
  }
};

export const getReviseTest = async (id: string):Promise<ReviseTest> => {
  const currUser = await getCurrentUser();
  try {
    const query = {
      fields: ["documentId", "createdAt", "testName", "score"],
      populate: ["failedQuestions"]
    }
    const response = await fetchData(`/api/tests/${id}`, query);
    return response?.data;
  } catch (error) {
    console.error("Error fetching enrollment:", error);
    throw error;
  }
};