'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { revalidateTag } from 'next/cache';
import { mutateData } from "@/lib/services/mutate-data";

type ActionErrorT = {
  error: true;
  message: string;
};
type ActionSuccessT = {
  error: false;
  message: 'Success';
  data: {
    username: string;
  };
};
export type EditUsernameActionT = ActionErrorT | ActionSuccessT;

export default async function editUsernameAction(
  username: string
): Promise<EditUsernameActionT> {
  const session = await getServerSession(authOptions);
  try {
    const payload = {
      username: username
    };
    const strapiResponse = await mutateData("PUT", `/api/user/me`, payload);

    // handle strapi error
    if (strapiResponse?.error) {
      const response: ActionErrorT = {
        error: true,
        message: strapiResponse.error,
      };

      return response;
    }

    // handle strapi success
    // this will cause a screen flicker but only in dev mode!!
    revalidateTag('strapi-users-me');
    return {
      error: false,
      message: 'Success',
      data: {
        username: username as string,
      },
    };
  } catch (error: any) {
    return {
      error: true,
      message: 'message' in error ? error.message : error.statusText,
    };
  }
}
