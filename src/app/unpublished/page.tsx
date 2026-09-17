import Link from "next/link";
import { db } from "@/prisma/db";
import { PageTitle } from "@/components";
import { formatAuthors } from "@/utils";

export default async function UnpublishedPage() {
  const unpublished = await db.orm.public.Unpublished.orderBy(((r) => r.year.desc())).all();

  return (
    <section className="flex flex-col gap-10">
      <PageTitle title="unpublished" />
      <ol className="px-4 flex flex-col gap-10">
        {unpublished.map((unpublishedItem) => {
          return (
            <li key={unpublishedItem.id} className="grid grid-cols-12 gap-10">
              <div className="col-span-2 text-center">{unpublishedItem.year}</div>
              <div className="col-span-3">{formatAuthors(unpublishedItem.authors)}</div>
              <div className="col-span-7">
                {unpublishedItem.filename ? (
                  <Link href={`/research/${unpublishedItem.filename}`} target="_blank" className="text-blue-700 visited:text-purple-700 hover:brightness-200 active:brightness-75">
                    {unpublishedItem.title}.
                  </Link>
                ) : (
                  <span>
                    {unpublishedItem.title}.
                  </span>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
