import Link from "next/link";
import LoggedInClient from '@/components/auth/logged-in-status/LoggedInClient';
import LoggedInServer from '@/components/auth/logged-in-status/LoggedInServer';

export default function Footer() {

  return (
    <footer>
      <div className="flex gap-4 w-full">
      <LoggedInClient />
      <LoggedInServer />
      </div>
    </footer>
  )
}
