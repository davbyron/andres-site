import "server-only";

import type {
  SettingsUploadTokenPayload,
  SettingsFileUploadRequest,
} from "@/types";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BUCKET_NAME, s3Client } from "../s3";
import { MAX_SETTINGS_FILE_SIZE } from "@/constants";

import { SettingsValidationError } from "./settings-validation-helpers";

// Keep the shared error available to the other upload actions.
export { SettingsValidationError } from "./settings-validation-helpers";

const STAGING_UPLOAD_PREFIX = "settings-uploads/";

/**
 * Maps a supported form field to its final bucket key or directory prefix.
 * Rejects unknown fields so callers cannot choose arbitrary upload destinations.
 */
export function settingsUploadDestination(fieldPath: string) {
  if (fieldPath === "cvFile") return "cv.pdf";
  if (fieldPath === "vowelBibliographyFile") return "vowels_bib.pdf";
  if (/^research\.\d+\.file$/.test(fieldPath)) return "research/";
  if (/^unpublished\.\d+\.file$/.test(fieldPath)) return "unpublished/";
  if (/^vowelCharts\.\d+\.file$/.test(fieldPath)) return "images/vowel-charts/";

  throw new SettingsValidationError("Invalid upload field.");
}

/**
 * Signs an encoded upload token payload with the server's secret to detect edits.
 * The prefix distinguishes upload signatures from other uses of the same secret.
 */
function createUploadSignature(encodedTokenPayload: string) {
  const signingSecret = process.env.BETTER_AUTH_SECRET;
  if (!signingSecret) throw new Error("Missing BETTER_AUTH_SECRET.");
  return createHmac("sha256", signingSecret)
    .update(`settings-upload:${encodedTokenPayload}`)
    .digest();
}

/**
 * Creates a unique filename and replaces characters outside the allowed set,
 * including path separators, so the original name cannot introduce directories.
 */
export function createUniqueFilename(originalFilename: string) {
  return `${randomUUID()}-${originalFilename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
}

/**
 * Validates file metadata and prepares a direct upload to a temporary bucket key.
 * Returns a 15-minute PUT URL bound to the file's size and content type, plus a
 * signed token valid for one hour that ties the upload to its user and form field.
 */
export async function prepareSettingsUpload(
  uploadRequest: SettingsFileUploadRequest,
  authenticatedUserId: string,
) {
  settingsUploadDestination(uploadRequest?.field);

  if (
    typeof uploadRequest.name !== "string" ||
    !uploadRequest.name ||
    uploadRequest.name.length > 255 ||
    !Number.isSafeInteger(uploadRequest.size) ||
    uploadRequest.size <= 0 ||
    uploadRequest.size > MAX_SETTINGS_FILE_SIZE ||
    typeof uploadRequest.contentType !== "string" ||
    uploadRequest.contentType.length > 255
  ) {
    throw new SettingsValidationError(
      "Choose a nonempty file of at most 10 MB.",
    );
  }

  if (
    ["cvFile", "vowelBibliographyFile"].includes(uploadRequest.field) &&
    !/\.pdf$/i.test(uploadRequest.name)
  ) {
    throw new SettingsValidationError(
      "The CV and bibliography must be PDF files.",
    );
  }

  if (
    uploadRequest.field.startsWith("vowelCharts.") &&
    ![
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
      "image/avif",
    ].includes(uploadRequest.contentType)
  ) {
    throw new SettingsValidationError(
      "Vowel charts must be PNG, JPEG, WebP, GIF, or AVIF images.",
    );
  }

  const uniqueFilename = createUniqueFilename(uploadRequest.name);
  const uploadTokenPayload: SettingsUploadTokenPayload = {
    field: uploadRequest.field,
    name: uploadRequest.name,
    size: uploadRequest.size,
    contentType: uploadRequest.contentType || "application/octet-stream",
    userId: authenticatedUserId,
    filename: uniqueFilename,
    key: `${STAGING_UPLOAD_PREFIX}${uniqueFilename}`,
    expiresAt: Date.now() + 60 * 60 * 1000,
  };
  const encodedTokenPayload = Buffer.from(
    JSON.stringify(uploadTokenPayload),
  ).toString("base64url");
  const signedUploadToken = `${encodedTokenPayload}.${createUploadSignature(encodedTokenPayload).toString("base64url")}`;

  const presignedUploadUrl = await getSignedUrl(
    s3Client,
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uploadTokenPayload.key,
      ContentType: uploadTokenPayload.contentType,
      // Bind the browser's automatically generated Content-Length to this file.
      ContentLength: uploadTokenPayload.size,
    }),
    {
      expiresIn: 15 * 60,
      signableHeaders: new Set(["content-type", "content-length"]),
    },
  );

  return {
    url: presignedUploadUrl,
    token: signedUploadToken,
    contentType: uploadTokenPayload.contentType,
  };
}

/**
 * Verifies an upload token's signature, owner, expiration, staging key, and form field
 * before returning its metadata. This does not check whether the file was uploaded.
 */
export function readSettingsUpload(
  signedUploadToken: string,
  authenticatedUserId: string,
): SettingsUploadTokenPayload {
  try {
    const [encodedTokenPayload, encodedTokenSignature, unexpectedTokenSegment] =
      signedUploadToken.split(".");
    const expectedSignature = createUploadSignature(encodedTokenPayload);
    const receivedSignature = Buffer.from(encodedTokenSignature, "base64url");

    if (
      unexpectedTokenSegment ||
      expectedSignature.length !== receivedSignature.length ||
      !timingSafeEqual(expectedSignature, receivedSignature)
    ) {
      throw new Error();
    }

    const uploadTokenPayload: SettingsUploadTokenPayload = JSON.parse(
      Buffer.from(encodedTokenPayload, "base64url").toString(),
    );

    if (
      uploadTokenPayload.userId !== authenticatedUserId ||
      uploadTokenPayload.expiresAt < Date.now() ||
      uploadTokenPayload.key !==
        STAGING_UPLOAD_PREFIX + uploadTokenPayload.filename
    ) {
      throw new Error();
    }

    settingsUploadDestination(uploadTokenPayload.field);

    return uploadTokenPayload;
  } catch {
    throw new SettingsValidationError(
      "An upload has expired or is invalid. Please save again to retry.",
    );
  }
}

/**
 * Checks that the staged object exists and its size and content type match the
 * token payload. Returns its ETag so a later copy can require the same object version.
 */
export async function verifySettingsUpload(
  uploadTokenPayload: SettingsUploadTokenPayload,
) {
  const uploadedObjectMetadata = await s3Client.send(
    new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: uploadTokenPayload.key }),
  );
  if (
    !uploadedObjectMetadata.ETag ||
    uploadedObjectMetadata.ContentLength !== uploadTokenPayload.size ||
    uploadedObjectMetadata.ContentType !== uploadTokenPayload.contentType
  ) {
    throw new SettingsValidationError(
      "An uploaded file did not match the selected file. Please save again.",
    );
  }
  return uploadedObjectMetadata.ETag;
}

/**
 * Copies a staged upload to the destination entirely within the bucket.
 * Requires the verified ETag so the copy fails if the source changed after checking.
 */
export async function copySettingsUpload(
  uploadTokenPayload: SettingsUploadTokenPayload,
  destinationKey: string,
  verifiedSourceETag: string,
) {
  await s3Client.send(
    new CopyObjectCommand({
      Bucket: BUCKET_NAME,
      Key: destinationKey,
      CopySource: `${BUCKET_NAME}/${uploadTokenPayload.key.split("/").map(encodeURIComponent).join("/")}`,
      CopySourceIfMatch: verifiedSourceETag,
    }),
  );
}

/**
 * Deletes each distinct bucket key and logs individual failures without throwing,
 * so a cleanup failure does not turn a committed save into an apparent failure.
 */
export async function deleteSettingsFiles(bucketKeys: string[]) {
  const deletionResults = await Promise.allSettled(
    [...new Set(bucketKeys)].map((bucketKey) =>
      s3Client.send(
        new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: bucketKey }),
      ),
    ),
  );
  for (const deletionResult of deletionResults) {
    if (deletionResult.status === "rejected")
      console.error("Settings file cleanup failed:", deletionResult.reason);
  }
}

/**
 * Uses a verified replacement upload when present, otherwise keeps the database
 * filename. Submitted filename strings alone cannot replace an existing file.
 */
export function resolveSettingsFilename(
  uploadedFilenames: ReadonlyMap<string, string>,
  fieldPath: string,
  existingRecord?: { filename: string | null },
) {
  return uploadedFilenames.get(fieldPath) ?? existingRecord?.filename ?? "";
}

/**
 * Collects a replaced or deleted file's bucket key for cleanup after commit.
 * This only queues the key; retained references are checked before deletion.
 */
export function rememberObsoleteSettingsFile(
  obsoleteKeys: string[],
  directoryPrefix: string,
  previousFilename: string | null,
  nextFilename?: string,
) {
  if (previousFilename && previousFilename !== nextFilename) {
    obsoleteKeys.push(directoryPrefix + previousFilename);
  }
}
