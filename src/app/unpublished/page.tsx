import Link from "next/link";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "@/prisma/db";
import { PageTitle } from "@/components";
import { formatAuthors, s3Client, BUCKET_NAME } from "@/utils";

export default async function UnpublishedPage() {
  const unpublished = await db.orm.public.Unpublished.orderBy(((r) => r.year.desc())).all();

  // Get signed URLs for each unpublished item's document if it has a filename
  const resolvedUnpublished = await Promise.all(
    unpublished.map(async (unpublishedItem) => {
      if (unpublishedItem.filename) {
        const getObjectCommand = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: `unpublished/${unpublishedItem.filename}`,
        });
        const signedUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 3600 });
        return { ...unpublishedItem, href: signedUrl };
      }
      return { ...unpublishedItem, href: undefined };
    })
  );

  return (
    <section className="flex flex-col gap-10">
      <PageTitle title="unpublished" />
      <ol className="px-4 flex flex-col gap-8 lg:gap-10">
        {resolvedUnpublished.map((unpublishedItem) => {
          return (
            <li key={unpublishedItem.id} className="grid grid-cols-12 gap-5 lg:gap-10">
              <div className="col-span-2 text-center">{unpublishedItem.year}</div>
              <div className="col-span-5 lg:col-span-3">{formatAuthors(unpublishedItem.authors)}</div>
              <div className="col-span-5 lg:col-span-7">
                {unpublishedItem.filename ? (
                  <Link
                    href={unpublishedItem.href}
                    target="_blank"
                    className="text-blue-700 visited:text-purple-700 hover:brightness-200 active:brightness-75"
                  >
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
