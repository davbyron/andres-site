import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "@/prisma/db";
import { PageTitle } from "@/components";
import { s3Client, BUCKET_NAME } from "@/utils";
import { ResearchItem } from "@/components/ResearchItem";

export default async function ResearchPage() {
  const research = await db.orm.public.Research.orderBy(((r) => r.year.desc())).all();

  // Get signed URLs for each research item's document if it has a filename
  const resolvedResearch = await Promise.all(
    research.map(async (researchItem) => {
      if (researchItem.filename) {
        const getObjectCommand = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: `research/${researchItem.filename}`,
        });
        const signedUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 3600 });
        return { ...researchItem, href: signedUrl };
      }
      return { ...researchItem, href: undefined };
    })
  );

  return (
    <section className="flex flex-col gap-10">
      <PageTitle title="research" />
      <ol className="px-4 flex flex-col gap-8 lg:gap-10">
        {resolvedResearch.map((researchItem) => {
          return (
            <ResearchItem key={researchItem.id} researchItem={researchItem} />
          )
        })}
      </ol>
    </section>
  )
}
