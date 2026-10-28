import { createHash } from "node:crypto";
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { BUCKET_NAME, s3Client } from "@/utils/s3";
import { getUserImageKey } from "@/utils/settings/getUserImageKey";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Give each image revision its own icon URL, including same-extension uploads. */
export async function generateImageMetadata() {
  const imageKey = await getUserImageKey();
  const imageMetadata = await s3Client.send(
    new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: imageKey,
    }),
  );
  const imageVersion =
    imageMetadata.ETag ?? imageMetadata.LastModified?.toISOString() ?? "";
  const iconId = createHash("sha256")
    .update(`${imageKey}:${imageVersion}`)
    .digest("hex")
    .slice(0, 16);

  return [
    { id: iconId, size: { width: 64, height: 64 }, contentType: "image/png" },
  ];
}

/** Read the private profile image and render an oriented, square browser icon. */
export default async function Icon() {
  const image = await s3Client.send(
    new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: await getUserImageKey(),
    }),
  );
  if (!image.Body) throw new Error("The user image is empty.");

  const imageBytes = await image.Body.transformToByteArray();
  const iconBytes = await sharp(Buffer.from(imageBytes))
    .rotate()
    .resize(64, 64, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();

  return new Response(new Uint8Array(iconBytes), {
    headers: {
      "Content-Type": "image/png",
      // Revalidate in the browser; Next.js must also generate this route at runtime.
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
