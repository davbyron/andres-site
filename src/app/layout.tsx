import { Metadata } from 'next';
import Link from "next/link";
import Image from "next/image";
import { Nav } from '@/components';

// Temporal is built into Node.js 26.8.2 and later, but Homebrew leaves it out, so we need to install the package and import it here.
import "temporal-polyfill/full/global";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | André Batchelder-Schwab",
    default: "André Batchelder-Schwab",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth scroll-pt-12">
      <body
        className="
          h-dvh max-w-500 mx-auto px-5 py-10 flex flex-col font-helvetica-neue text-gray bg-white
          lg:px-10 lg:py-10 lg:gap-20
          xl:px-24
        "
      >
        <header className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-24">
          <h1 className="text-4xl lg:text-6xl 2xl:text-[5.25rem] font-normal text-center">André Batchelder&#8209;Schwab</h1>
          <Nav />
          <Link href="/cv.pdf" target="_blank" className="hover:brightness-150 duration-200">
            <Image
              height={50}
              width={50}
              src="/cv.svg"
              alt="CV icon"
              className="h-auto w-10 lg:w-12"
            />
          </Link>
        </header>
        <main className="relative w-full flex">
          <div className="hidden lg:block w-1/3 max-w-150 shrink-0">
            <Image
              src="/myface.jpg"
              alt="A photo of Andre Schwab"
              width={1000}
              height={1000}
              className="w-full h-auto border-6 border-black"
              sizes="(min-width: 1024px) 33vw, 0px"
            />
          </div>
          <div className="flex-1 flex flex-col px-2 lg:px-12 pt-5 pb-12">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
