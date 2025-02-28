import Link from 'next/link';
import NavbarUser from './NavbarUser';
import { LuSquareCheck, LuChartColumn, LuLayoutDashboard } from "react-icons/lu";
import Image from "next/image";
import { isAdmin } from '@/lib/services/auth';

async function getNavItems () {
  const navItems = [
    {
      name: "Quiz",
      icon: LuSquareCheck,
      link: "/quiz",
    },
    {
      name: "My Stats",
      icon: LuChartColumn,
      link: "/stats",
    },
  ];
  const hasDashboard = await isAdmin();
  if (hasDashboard) {
    navItems.unshift(
      {
        name: "Dashboard",
        icon: LuLayoutDashboard,
        link: "/dashboard",
      },
    );
  }

  return navItems;
}
export default async function NavBar() {
  const navItems = await getNavItems();
  return (
    <header className="min-h-[8vh] px-[2rem] bg-white shadow-lg flex items-center">
      <nav className="flex-1 flex items-center justify-between">
        <Link href='/' className='flex items-center gap-2'>
          <Image
            src={"/logo.webp"}
            alt="ENZE Pro"
            priority
            width={100}
            height={50}
            className="object-cover object-center mx-auto"
          />
          <h1 className="text-2xl font-bold text-primary/90">Online Course</h1>
        </Link>
        <ul className="flex items-center gap-4">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.link}
                className={`py-1 px-6 flex items-center gap-2 text-lg leading-none text-primary/90 rounded-lg`}
              >
                <item.icon className="size-5" />
                <span className={`font-bold uppercase text-primary/90`} >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <NavbarUser />
        </div>
      </nav>
    </header>
  );
}

