import { Metadata } from 'next';
import Link from "next/link";
import Image from "next/image";

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
    <html lang="en">
      <body className="h-dvh px-5 py-10 lg:px-10 lg:py-10 xl:px-24 xl:py-10 flex flex-col gap-10 lg:gap-20 font-helvetica-neue text-gray bg-white">
        <header className="flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-24">
          <h1 className="text-4xl lg:text-6xl 2xl:text-[5.25rem] font-normal text-center">André Batchelder&#8209;Schwab</h1>
          <nav>
            <ul className="flex flex-wrap justify-center gap-8">
              <Link href="/" className="group" id="home_button">
                <p className="group-hover:-translate-y-1 group-hover:text-shadow-lg/10 duration-200">home</p>
              </Link>
              <Link href="/languages" className="group" id="langs_button">
                <p className="group-hover:-translate-y-1 group-hover:text-shadow-lg/10 duration-200">languages</p>
              </Link>
              <Link href="/research" className="group" id="research_button">
                <p className="group-hover:-translate-y-1 group-hover:text-shadow-lg/10 duration-200">research</p>
              </Link>
              <Link href="/unpublished" className="group" id="unpubs_button">
                <p className="group-hover:-translate-y-1 group-hover:text-shadow-lg/10 duration-200">unpublished</p>
              </Link>
              <Link href="/vowelchArt" className="group" id="vowels_button">
                <p className="group-hover:-translate-y-1 group-hover:text-shadow-lg/10 duration-200">vowelchArt</p>
              </Link>
            </ul>
          </nav>
          <Link href="/cv.pdf" target="_blank" className="min-w-12 hover:brightness-150 duration-200">
            <Image height={50} width={50} src="/cv.svg"  alt="CV" />
          </Link>
        </header>
        <main className="w-full flex">
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
          <div className="flex-1 flex flex-col px-4 lg:px-12 py-5">
            <div>
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
