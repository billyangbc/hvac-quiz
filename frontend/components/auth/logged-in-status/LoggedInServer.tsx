import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth';

export default async function LoggedInServer() {
  // hide in production
  if (process.env.NODE_ENV === "production") return null;

  const session = await getServerSession(authOptions);
  // console.log('getServerSession', session);
  return (
    <div
      className={`p-4 basis-2/4 rounded-md text-center ${
        session ? 'bg-green-200' : 'bg-red-200'
      }`}
    >
      Server:{' '}
      {session ? `logged in as ${session.user?.name}.` : 'not logged in.'}
    </div>
  );
}
