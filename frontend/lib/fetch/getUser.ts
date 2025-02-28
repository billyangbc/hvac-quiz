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

export async function getUserRole(userId?: string) {
  let requestUserId = typeof userId === 'undefined' ? null : userId;
  if (!requestUserId) {
    const session = await getServerSession(authOptions);
    const sectionUserId = session?.user.strapiUserId;
    if (sectionUserId) {
      requestUserId = `${sectionUserId}`; 
    }
  }

  const options = {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    }
  };

  if (requestUserId) {
    const user = await fetcher(`/users/${requestUserId}`, {"populate": "*"}, options);
    return user?.role.name;
  }

  return null;
}

export async function isAdmin() {
  const role = await getUserRole();

  return role === `${process.env.ADMIN_ROLE_NAME}`;
}

export async function getApiToken() {
  const session = await getServerSession(authOptions);
  const token = session!.strapiToken!

  return token;
}