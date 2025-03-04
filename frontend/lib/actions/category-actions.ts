"use server";

import fetchData from "@/lib/services/fetch-data";
import { mutateData } from "@/lib/services/mutate-data";
import { revalidatePath } from "next/cache";

export async function getCategories(params: {
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
}) {
  const query = {
    sort: params.sort,
    filters: {
      $or: [
        { categoryName: { $containsi: params.search} },
        { description: { $containsi: params.search} },
      ]
    },
    pagination: {
      pageSize: params.pageSize,
      page: params.page
    }
  }
  const response = await fetchData("/api/categories", query);
  return response;
}

export async function getCategory(documentId: string) {
  const response = await fetchData("/api/categories/" + documentId, {});
  return response?.data;
}

export async function createCategory(
  prevState: any,
  formData: FormData
) {
  const rawFormData = Object.fromEntries(formData);

  // request payload data
  const payload = {
    data: {
      categoryName: rawFormData.categoryName,
      description: rawFormData.description
    }
  };

  const response = await mutateData(
    "POST",
    "/api/categories",
    payload
  );

  if (!response) {
    return {
      ...prevState,
      message: "Ops! Something went wrong. Please try again.",
      data: null,
      apiErrors: null,
    };
  }

  if (response.error) {
    return {
      ...prevState,
      message: "Category Creation Failed",
      data: payload.data,
      apiErrors: response.error,
    };
  }

  revalidatePath("/dashboard/category");

  return {
    ...prevState,
    message: "Category Created",
    data: response.data,
    apiErrors: null,
  };
}

export async function updateCategory(
  prevState: any,
  formData: FormData
) {
  const rawFormData = Object.fromEntries(formData);
  const categoryId = rawFormData.id as string;

  const payload = {
    data: {
      categoryName: rawFormData.categoryName,
      description: rawFormData.description
    }
  };

  const response = await mutateData(
    "PUT",
    `/api/categories/${categoryId}`,
    payload
  );

  if (!response) {
    return {
      ...prevState,
      message: "Ops! Something went wrong. Please try again.",
      data: null,
      apiErrors: null,
    };
  }

  if (response.error) {
    return {
      ...prevState,
      message: "Category Update Failed",
      data: payload.data,
      apiErrors: response.error,
    };
  }

  revalidatePath("/dashboard/category");

  return {
    ...prevState,
    message: "Category Updated",
    data: response.data,
    apiErrors: null,
  };
}

export async function deleteCategory(categoryId: string) {
  const response = await mutateData(
    "DELETE",
    `/api/categories/${categoryId}`
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
      message: "Category Delete Failed",
      apiErrors: response.error,
    };
  }

  revalidatePath("/dashboard/category");

  return {
    message: "Category Deleted",
    data: response.data,
    apiErrors: null,
  };
}