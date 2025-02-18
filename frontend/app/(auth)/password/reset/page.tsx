import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth';
import ResetPassword from '@/components/auth/password/ResetPassword';
import { redirect } from 'next/navigation';

type paramsType = Promise<{
    code?: string;
}>;

export default async function page( props: { searchParams: paramsType }) {
  const { code } = await props.searchParams;
  // if the user is logged in, redirect to profile where password change is possible
  const session = await getServerSession(authOptions);
  if (session) redirect('/profile');
  return <ResetPassword code={code} />;
}
