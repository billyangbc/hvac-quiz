"use server";

import fetchData from "@/lib/services/fetch-data";
import { mutateData } from "@/lib/services/mutate-data";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

export interface CategoryMutateType {
  categoryName: string;
  description: string;
  slug?: string;
}

export async function getCategories(params?: {
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
}) {
  const query = {
    sort: params?.sort,
    filters: {
      $or: [
        { categoryName: { $containsi: params?.search} },
        { description: { $containsi: params?.search} },
      ]
    },
    pagination: {
      pageSize: params?.pageSize,
      page: params?.page
    }
  }
  const response = await fetchData("/api/categories", query);
  return response;
}

export async function getCategory(documentId: string) {
  if (documentId) {
    const response = await fetchData("/api/categories/" + documentId, {});
    return response?.data;
  }
  return null;
}

export async function getCategoryBySlug(slug: string) {
  if (slug) {
    const query = {
      filters: {
        slug: { $eq: slug },
      }
    }
    const response = await fetchData("/api/categories", query);
    return response?.data;
  }

  return [];
}

export async function createCategoryFromForm(
  prevState: any,
  formData: FormData
) {
  const rawFormData = Object.fromEntries(formData);

  // request payload data
  const data = {
    categoryName: rawFormData.categoryName as string,
    description: rawFormData.description as string,
    slug: await slugify(rawFormData.categoryName as string),
  };

  const result = await createCategory(data);

  revalidatePath("/dashboard/category");
  return {
    ...prevState,
    ...result
  }
}

export async function createCategory(data: CategoryMutateType) {
  // request payload data
  const payload = {
    data: data
  };

  const response = await mutateData(
    "POST",
    "/api/categories",
    payload
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
      message: "Category Creation Failed",
      data: payload.data,
      apiErrors: response.error,
    };
  }

  return {
    message: "Category Created",
    data: response.data,
    apiErrors: null,
  };
}

export async function updateCategoryFromForm(
  prevState: any,
  formData: FormData
) {
  const rawFormData = Object.fromEntries(formData);
  const categoryId = rawFormData.id as string;

  const data = {
    categoryName: rawFormData.categoryName as string,
    description: rawFormData.description as string
  };

  const result = updateCategory(categoryId, data);

  revalidatePath("/dashboard/category");
  return {
    ...prevState,
    ...result
  }
}

export async function updateCategory(categoryId: string, data: CategoryMutateType) {
  const payload = {
    data: data
  };

  const response = await mutateData(
    "PUT",
    `/api/categories/${categoryId}`,
    payload
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
      message: "Category Update Failed",
      data: payload.data,
      apiErrors: response.error,
    };
  }

  revalidatePath("/dashboard/category");

  return {
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