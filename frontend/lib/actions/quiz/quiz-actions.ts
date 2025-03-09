"use server";

import { getCurrentUser } from "@/lib/services/auth";
import fetchData from "@/lib/services/fetch-data";

export async function getQuizSettingData() {
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