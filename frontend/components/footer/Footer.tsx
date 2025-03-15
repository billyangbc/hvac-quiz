import Link from "next/link";

import LoggedInClient from '@/components/auth/logged-in-status/LoggedInClient';
import LoggedInServer from '@/components/auth/logged-in-status/LoggedInServer';

export default function Footer() {
  return (
    <footer>
      { process.env.NODE_ENV !== "production" &&  
        <div className="flex gap-4 w-full">
        <LoggedInClient />
        <LoggedInServer />
        </div>
      }
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/">ENZE Pro Online Course</Link>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `} Powered by {` `}</div>
          <Link href="https://www.hvacprobooster.com">hvacprobooster.com</Link>
        </div>
        <div className="mb-8 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>
          <div>{` | `}</div>
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}