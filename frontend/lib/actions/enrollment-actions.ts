"use server";

import fetchData from "@/lib/services/fetch-data";
import { mutateData } from "@/lib/services/mutate-data";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import { IApiParameters } from '@/types/strapi/StrapiParameters';

export async function getEnrollments(query: IApiParameters) {
  try {
    const response = await fetchData("/api/enrollments", query);
    return response;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}

export async function getEnrollment(documentId: string) {
  try {
    const params = {
      populate: "*"
    }
    const response = await fetchData("/api/enrollments/" + documentId, {});
    return response?.data;
  } catch (error) {
    console.error("Error fetching enrollment:", error);
    throw error;
  }
}

export async function createEnrollment(
  prevState: any,
  formData: FormData
) {
  const rawFormData = Object.fromEntries(formData);

  const payload = {
    data: {
      name: rawFormData.name,
      description: rawFormData.description,
      slug: await slugify(rawFormData.name as string),
    }
  };

  const response = await mutateData(
    "POST",
    "/api/enrollments",
    payload
  );

  if (!response) {
    return {
      ...prevState,
      message: "Error: Please try again.",
      data: null,
      apiErrors: null,
    };
  }

  if (response.error) {
    return {
      ...prevState,
      message: "Enrollment Creation Failed",
      data: payload.data,
      apiErrors: response.error,
    };
  }

  revalidatePath("/dashboard/enrollment");

  return {
    ...prevState,
    message: "Enrollment Created",
    data: response.data,
    apiErrors: null,
  };
}

export async function updateEnrollment(
  prevState: any,
  formData: FormData
) {
  const rawFormData = Object.fromEntries(formData);
  const enrollmentId = rawFormData.id as string;

  const payload = {
    data: {
      name: rawFormData.name,
      description: rawFormData.description
    }
  };

  const response = await mutateData(
    "PUT",
    `/api/enrollments/${enrollmentId}`,
    payload
  );

  if (!response) {
    return {
      ...prevState,
      message: "Error: Please try again.",
      data: null,
      apiErrors: null,
    };
  }

  if (response.error) {
    return {
      ...prevState,
      message: "Enrollment Update Failed",
      data: payload.data,
      apiErrors: response.error,
    };
  }

  revalidatePath("/dashboard/enrollment");

  return {
    ...prevState,
    message: "Enrollment Updated",
    data: response.data,
    apiErrors: null,
  };
}

export async function deleteEnrollment(enrollmentId: string) {
  const response = await mutateData(
    "DELETE",
    `/api/enrollments/${enrollmentId}`
  );

  if (!response) {
    return {
      message: "Error: Please try again.",
      data: null,
      apiErrors: null,
    };
  }

  if (response.error) {
    return {
      message: "Enrollment Delete Failed",
      apiErrors: response.error,
    };
  }

  revalidatePath("/dashboard/enrollment");

  return {
    message: "Enrollment Deleted",
    data: response.data,
    apiErrors: null,
  };
}

export async function getLearners() {
    const users = await fetchData(`/api/users/`, {"populate": "*"});
    return users;
}
