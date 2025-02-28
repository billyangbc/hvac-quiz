import { FetchOptionsType } from '@/types/strapi/StrapiFetchOptions';
import { IApiParameters } from '@/types/strapi/StrapiParameters';
import { StrapiErrorT } from '@/types/strapi/StrapiError';
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
    if (!strapiResponse.ok) {
      // check if response in json-able
      const contentType = strapiResponse.headers.get('content-type');
      if (contentType === 'application/json; charset=utf-8') {
        const errorData: StrapiErrorT = await strapiResponse.json();
        throw new Error(
          `${errorData.error.status} ${errorData.error.name}: ${errorData.error.message}`
        );
      } else {
        // If no Strapi error details, throw a generic HTTP error
        throw new Error(
          `HTTP Error: ${strapiResponse.status} - ${strapiResponse.statusText}`
        );
      }
    }

    // success
    const successData = await strapiResponse.json();
    return successData;
  } catch (error) {
    throw error;
  }
}