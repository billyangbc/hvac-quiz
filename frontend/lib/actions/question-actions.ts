"use server";

import { mutateData } from "@/lib/services/mutate-data";
import fetchData from "@/lib/services/fetch-data";
import { revalidatePath } from "next/cache";
import { IApiParameters } from '@/types/strapi/StrapiParameters';

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

export async function createQuestion(prevState: any, formData: FormData) {
  const rawFormData = Object.fromEntries(formData);

  const payload = {
    data: {
      category: rawFormData.category,
      content: rawFormData.content,
      incorrect_1: rawFormData.incorrect_1,
      incorrect_2: rawFormData.incorrect_2,
      incorrect_3: rawFormData.incorrect_3,
      correctAnswer: rawFormData.correctAnswer,
      difficulty: rawFormData.difficulty,
      explanation: rawFormData.explanation
    }
  };

  try {
    const response = await mutateData("POST", "/api/questions", payload);

    if (response?.error) {
      return {
        ...prevState,
        message: "Question Creation Failed",
        data: payload.data,
        apiErrors: response.error,
      };
    }

    revalidatePath("/dashboard/question");
    return {
      ...prevState,
      message: "Question Created Successfully",
      data: null,
      apiErrors: null,
    };

  } catch (error) {
    return {
      ...prevState,
      message: "Failed to create question",
      data: payload.data,
      apiErrors: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateQuestion(prevState: any, formData: FormData) {
  const rawFormData = Object.fromEntries(formData);
  const documentId = rawFormData.documentId as string;

  const payload = {
    data: {
      category: rawFormData.category,
      content: rawFormData.content,
      incorrect_1: rawFormData.incorrect_1,
      incorrect_2: rawFormData.incorrect_2,
      incorrect_3: rawFormData.incorrect_3,
      correctAnswer: rawFormData.correctAnswer,
      difficulty: rawFormData.difficulty,
      explanation: rawFormData.explanation
    }
  };

  try {
    const response = await mutateData("PUT", `/api/questions/${documentId}`, payload);

    if (response?.error) {
      return {
        ...prevState,
        message: "Question Update Failed",
        data: payload.data,
        apiErrors: response.error,
      };
    }

    revalidatePath("/dashboard/question");
    return {
      ...prevState,
      message: "Question Updated Successfully",
      data: null,
      apiErrors: null,
    };

  } catch (error) {
    return {
      ...prevState,
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