import "@/app/globals.css";
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { cn } from "@/lib/utils";
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/authOptions';

import SessionProvider from '@/components/layout/SessionProvider';
import NavBar from '@/components/header/Navbar';
import Footer from '@/components/footer/Footer';

import { Toaster } from "sonner";
import ModalProvider from "@/components/modals/ModalProvider";
import TailwindIndicator from "@/components/layout/TailwindIndicator";

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Frontend',
};

const bodyCss = cn("px-2 bg-zinc-200", space_grotesk);
const mainCss = cn("flex min-h-[80vh] max-w-[1920px] mx-auto flex-col items-center justify-between py-6 px-4 sm:px-16 lg:px-24 2xl:px-80");
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang='en'>
      <body className={bodyCss} suppressHydrationWarning={true}>
        <SessionProvider session={session}>
          <div className='max-w-6xl mx-auto'>
            <NavBar />
            <ModalProvider />
            <main className={mainCss}>{children}</main>
            <Toaster position="top-center" duration={5000} richColors />
            <Footer/>
          </div>
        </SessionProvider>
        <TailwindIndicator />
      </body>
    </html>
  );
}