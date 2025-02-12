'use client';

import { signOut } from 'next-auth/react';

const actionCss = "focus:shadow-outline-blue inline rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium leading-5 text-white shadow transition-colors duration-150 hover:bg-blue-700 focus:outline-none dark:hover:bg-blue-500";
export default function SignOutButton() {
  return (
    <button
      className={actionCss}
      onClick={() => signOut()}
    >
      sign out
    </button>
  );
}
