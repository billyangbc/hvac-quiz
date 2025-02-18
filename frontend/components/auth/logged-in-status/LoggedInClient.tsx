'use client';

import { useSession } from 'next-auth/react';

export default function LoggedInClient() {
  const { data: session } = useSession();
  // console.log('useSession', session);
  // hide in production
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div
      className={`p-4 basis-2/4 rounded-md text-center ${
        session ? 'bg-green-200' : 'bg-red-200'
      }`}
    >
      Client:{' '}
      {session ? `logged in as ${session.user?.name}.` : 'not logged in.'}
    </div>
  );
}
