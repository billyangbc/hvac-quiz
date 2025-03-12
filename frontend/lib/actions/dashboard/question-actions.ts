"use server";

import { mutateData } from "@/lib/services/mutate-data";
import fetchData from "@/lib/services/fetch-data";
import { revalidatePath } from "next/cache";
import { IApiParameters } from '@/types/strapi/StrapiParameters';

export interface QuestionMutateType {
  category: string;
  content: string;
  incorrect_1: string;
  incorrect_2: string;
  incorrect_3: string;
  correctAnswer: string;
  difficulty: string;
  explanation?: string;
};

export async function getQuestions(query: IApiParameters) {
  try {
    const response = await fetchData("/api/questions", query);
    return response;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}

export async function getQuestion(documentId: string) {
  try {
    const params = {
      populate: "*"
    }
    const response = await fetchData(`/api/questions/${documentId}`, params);
    return response;
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
}

export async function createQuestionFromForm(prevState: any, formData: FormData) {
  const rawFormData = Object.fromEntries(formData);

  const data = {
    category: rawFormData.category as string,
    content: rawFormData.content as string,
    incorrect_1: rawFormData.incorrect_1 as string,
    incorrect_2: rawFormData.incorrect_2 as string,
    incorrect_3: rawFormData.incorrect_3 as string,
    correctAnswer: rawFormData.correctAnswer as string,
    difficulty: rawFormData.difficulty as string,
    explanation: rawFormData.explanation as string
  };

  const result = await createQuestion(data);

  revalidatePath("/dashboard/question");

  return {
    ...prevState,
    ...result
  };
}

export async function createQuestion(data: QuestionMutateType) {
  const payload = {
    data: data
  };

  try {
    const response = await mutateData("POST", "/api/questions", payload);

    if (response?.error) {
      return {
        message: "Question Creation Failed",
        data: payload.data,
        apiErrors: response.error,
      };
    }

    return {
      message: "Question Created Successfully",
      data: null,
      apiErrors: null,
    };

  } catch (error) {
    return {
      message: "Failed to create question",
      data: payload.data,
      apiErrors: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateQuestionFromForm(prevState: any, formData: FormData) {
  const rawFormData = Object.fromEntries(formData);
  const documentId = rawFormData.documentId as string;

  const data = {
    category: rawFormData.category as string,
    content: rawFormData.content as string,
    incorrect_1: rawFormData.incorrect_1 as string,
    incorrect_2: rawFormData.incorrect_2 as string,
    incorrect_3: rawFormData.incorrect_3 as string,
    correctAnswer: rawFormData.correctAnswer as string,
    difficulty: rawFormData.difficulty as string,
    explanation: rawFormData.explanation as string
  };

  const result = await updateQuestion(documentId, data);

  revalidatePath("/dashboard/question");
  return {
    ...prevState,
    ...result,
  };
}

export async function updateQuestion(documentId: string, data: QuestionMutateType) {
  const payload = {
    data: data
  };

  try {
    const response = await mutateData("PUT", `/api/questions/${documentId}`, payload);

    if (response?.error) {
      return {
        message: "Question Update Failed",
        data: payload.data,
        apiErrors: response.error,
      };
    }

    revalidatePath("/dashboard/question");
    return {
      message: "Question Updated Successfully",
      data: null,
      apiErrors: null,
    };

  } catch (error) {
    return {
      message: "Failed to update question",
      data: payload.data,
      apiErrors: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteQuestion(documentId: string) {
  const response = await mutateData(
    "DELETE",
    `/api/questions/${documentId}`
  );

  if (!response) {
    return {
      message: "Ops! Something went wrong. Please try again.",
      data: null,
      apiErrors: null,
    };
  }

  if (response.error) {
    return {
      message: "Question Delete Failed",
      apiErrors: response.error,
    };
  }

  revalidatePath("/dashboard/question");

  return {
    message: "Question Deleted",
    data: response.data,
    apiErrors: null,
  };
}