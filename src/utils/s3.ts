import { S3Client } from "@aws-sdk/client-s3";

if (
  !process.env.S3_ENDPOINT ||
  !process.env.S3_ACCESS_KEY_ID ||
  !process.env.S3_SECRET_ACCESS_KEY ||
  !process.env.S3_BUCKET
) {
  throw new Error("Missing required S3 environment variables.");
}

export const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: "auto",
  // Presigned PUTs contain no body while signing; do not sign an empty-body checksum.
  requestChecksumCalculation: "WHEN_REQUIRED",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

export const BUCKET_NAME = process.env.S3_BUCKET!;
