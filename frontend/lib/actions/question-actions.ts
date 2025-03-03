"use server";

import { mutateData } from "@/lib/services/mutate-data";
import { revalidatePath } from "next/cache";

export async function createQuestionAction(prevState: any, formData: FormData) {
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
