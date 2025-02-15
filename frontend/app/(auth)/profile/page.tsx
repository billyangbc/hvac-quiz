import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import Profile from '@/components/auth/profile/Profile';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className='bg-zinc-100 rounded-sm px-4 py-8 mb-8'>
        <h2 className='font-bold text-lg mb-4'>Not allowed</h2>
        <p>
          You need to be{' '}
          <Link href='/signin' className='underline'>
            signed in
          </Link>{' '}
          to view this page.
        </p>
      </div>
    );
  }
  if (session.provider === 'google') {
    return (
      <div className='bg-zinc-100 rounded-sm px-4 py-8 mb-8'>
        <h2 className='font-bold text-lg mb-4'>Profile</h2>
        <p>You are logged in to this website with your google profile.</p>
      </div>
    );
  }
  return <Profile />;
}
