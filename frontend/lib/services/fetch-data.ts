import { FetchOptionsType } from '@/types/strapi/StrapiFetchOptions';
import { IApiParameters } from '@/types/strapi/StrapiParameters';
import { getUserApiToken } from "@/lib/services/auth";
import qs from 'qs';

export default async function fetchData(
  path: string,
  parameters: IApiParameters,
  options?: FetchOptionsType
) {
  const url = new URL(path, process.env.STRAPI_BACKEND_URL);
  url.search = qs.stringify(parameters, { encodeValuesOnly: true });

  let fetchOptions;
  if (options) {
    fetchOptions = options;
  } else {
    const authToken = await getUserApiToken();
    if (authToken) {
      fetchOptions = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        }
      };
    } else {
      fetchOptions = {};
    }
  }
  try {
    const strapiResponse = await fetch(url.href, fetchOptions);
    if (strapiResponse.ok) {
      // success
      const successData = await strapiResponse.json();
      return successData;
    }

    return null;
  } catch (error) {
    throw error;
  }
}