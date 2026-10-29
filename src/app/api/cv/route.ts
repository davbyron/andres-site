import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { BUCKET_NAME, s3Client } from "@/utils/s3";

export const dynamic = "force-dynamic";

/** Sign the CV when opened so links in long-lived tabs never contain expired URLs. */
export async function GET() {
  const signedUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({ Bucket: BUCKET_NAME, Key: "cv.pdf" }),
    { expiresIn: 3600 },
  );

  // Cache neither the redirect nor its temporary destination in browsers or CDNs.
  return NextResponse.redirect(signedUrl, {
    status: 307,
    headers: { "Cache-Control": "private, no-store, max-age=0" },
  });
}
