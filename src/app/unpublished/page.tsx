import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "@/prisma/db";
import { PageTitle } from "@/components";
import { UnpublishedItem } from "@/components/UnpublishedItem";
import { s3Client, BUCKET_NAME } from "@/utils";

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
            <UnpublishedItem key={unpublishedItem.id} unpublishedItem={unpublishedItem} />
          )
        })}
      </ol>
    </section>
  )
}
