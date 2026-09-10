import { Fragment, ReactNode } from "react";
import Link from "next/link";
import { db } from "@/prisma/db";
import { PageTitle } from "@/components";

/**
 * Formats a list of authors into a string with proper separators and bolds André's name.
 * @param authors List of authors to string together
 * @returns A ReactNode containing the formatted authors
 */
function formatAuthors(authors: readonly string[]): ReactNode {
  return authors.map((author, index) => {
    const name =
      author === "André Batchelder-Schwab"
        ? <b>{author}</b>
        : author;

    const separator = index === 0 ? null : index === authors.length - 1 ? ", & " : ", ";

    return (
      <Fragment key={`${author}-${index}`}>
        {separator}
        {name}
      </Fragment>
    );
  });
}

export default async function ResearchPage() {
  const research = await db.orm.public.Research.orderBy(((r) => r.year.desc())).all();

  return (
    <section className="flex flex-col gap-10">
      <PageTitle title="research" />
      <ol className="px-4 flex flex-col gap-10">
        {research.map((researchItem) => {
          return (
            <li key={researchItem.id} className="grid grid-cols-12 gap-10">
              <div className="col-span-2 text-center">{researchItem.year}</div>
              <div className="col-span-3">{formatAuthors(researchItem.authors)}</div>
              <div className="col-span-7">
                {researchItem.filename ? (
                  <Link href={`/research/${researchItem.filename}`} target="_blank" className="text-blue-700 visited:text-purple-700 hover:brightness-200 active:brightness-75">
                    {researchItem.title}.
                  </Link>
                ) : (
                  <span>
                    {researchItem.title}.
                  </span>
                )}
                <span className="italic"> {researchItem.publication}.</span>
                {researchItem.pageNumbers && <span> {researchItem.pageNumbers}.</span>}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
