import { Fragment, ReactNode } from "react";
import Link from "next/link";
import { db } from "@/prisma/db";
import { PageTitle } from "@/components";

function formatAuthors(authors: readonly string[]): ReactNode {
  return authors.map((author, index) => {
    const name =
      author === "André Batchelder-Schwab"
        ? <b>{author}</b>
        : author;

    return (
      <Fragment key={`${author}-${index}`}>
        {index === 0 ? null : index === authors.length - 1 ? ", & " : ", "}
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
                {researchItem.url ? (
                  <Link href={researchItem.url} target="_blank" className="text-blue-700 visited:text-purple-700 hover:brightness-200 active:brightness-75">
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
