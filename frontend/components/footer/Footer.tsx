import Link from "next/link";
import LoggedInClient from '@/components/loggedIn/LoggedInClient';
import LoggedInServer from '@/components/loggedIn/LoggedInServer';

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
