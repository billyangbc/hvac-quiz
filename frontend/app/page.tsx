import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { isAdmin } from '@/lib/fetch/getUser';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div>Hello world!</div>;
  }
  const hasDashboard = await isAdmin();
  if (hasDashboard) {
    redirect('/dashboard');
  } else {
    redirect('/quiz');
  }
}
