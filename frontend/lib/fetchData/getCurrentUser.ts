import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth';
import { StrapiCurrentUserT } from '@/types/strapi/StrapiCurrentUserT';
import fetcher from './fetcher';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  const token = session!.strapiToken!
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { tags: ['strapi-users-me'] },
  };
  const user: StrapiCurrentUserT = await fetcher('/users/me', {}, options);
  return user;
}
