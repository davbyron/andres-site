import "server-only";

import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { BUCKET_NAME, s3Client } from "../s3";

/**
 * Lists shared image keys from newest to oldest, excluding unrelated objects.
 * The save action captures this list before replacing an image so cleanup does
 * not pick up images uploaded after that replacement began.
 */
export async function getUserImageKeys() {
  const { Contents: images = [] } = await s3Client.send(new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: "images/andre-schwab.",
  }));
  const userImages = images
    .filter((image) => /^images\/andre-schwab\.(jpg|jpeg|png|webp|gif|avif)$/.test(image.Key ?? ""))
    .sort((first, second) => (second.LastModified?.getTime() ?? 0) - (first.LastModified?.getTime() ?? 0));
  return userImages.map((image) => image.Key!);
}

/** Selects the newest shared image, including legacy variants awaiting cleanup. */
export async function getUserImageKey() {
  const userImageKeys = await getUserImageKeys();
  return userImageKeys[0] ?? "images/andre-schwab.jpg";
}
