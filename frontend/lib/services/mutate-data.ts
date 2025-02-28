import { getUserApiToken } from "@/lib/services/auth";
export async function mutateData(method: string, path: string, payload?: any) {
  const authToken = await getUserApiToken();
  if (!authToken) throw new Error("No auth token found");

  const baseUrl = process.env.STRAPI_BACKEND_URL;
  const url = new URL(path, baseUrl);
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ ...payload }),
    });

    if (method === 'DELETE') {
      return response.ok;
    }

    const data = await response?.json();
    return data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}