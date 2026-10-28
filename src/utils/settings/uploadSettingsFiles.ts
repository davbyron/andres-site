import type { SettingsFormInputs, SettingsUploadReceipt } from "@/types";
import { prepareWebsiteSettingsFileUpload } from "@/actions/prepareWebsiteSettingsFileUpload";
import { discardWebsiteSettingsFileUploads } from "@/actions/discardWebsiteSettingsFileUploads";
import { MAX_SETTINGS_FILE_SIZE } from "@/constants";

export async function uploadSettingsFiles(
  data: SettingsFormInputs,
  onProgress: (completed: number, total: number) => void,
) {
  const files: { field: string; file: File }[] = [];

  // Add all files from the form data to the list of files to upload

  if (data.userImageFile?.[0]) {
    files.push({ field: "userImageFile", file: data.userImageFile[0] });
  }

  if (data.cvFile?.[0]) {
    files.push({ field: "cvFile", file: data.cvFile[0] });
  }

  if (data.vowelBibliographyFile?.[0]) {
    files.push({
      field: "vowelBibliographyFile",
      file: data.vowelBibliographyFile[0],
    });
  }

  for (const collection of [
    "research",
    "unpublished",
    "vowelCharts",
  ] as const) {
    data[collection].forEach((item, index) => {
      if (item.file?.[0])
        files.push({
          field: `${collection}.${index}.file`,
          file: item.file[0],
        });
    });
  }

  // Validate before starting so a bad file doesn't waste earlier uploads.
  if (files.some(({ file }) => !file.size || file.size > MAX_SETTINGS_FILE_SIZE)) {
    throw new Error("Files must be nonempty and at most 10 MB each.");
  }

  const receipts: SettingsUploadReceipt[] = [];

  try {
    for (const [index, { field, file }] of files.entries()) {
      // Update progress
      onProgress(index, files.length);

      const prepareUploadRes = await prepareWebsiteSettingsFileUpload({
        field,
        name: file.name,
        size: file.size,
        contentType: file.type,
      });

      if (prepareUploadRes.success === false) throw new Error(prepareUploadRes.error);
      receipts.push({ field, token: prepareUploadRes.token });

      // Upload the file to S3 using the provided PUT URL.
      // If this fails, we discard the staging files.
      let response: Response;

      try {
        response = await fetch(prepareUploadRes.url, {
          method: "PUT",
          headers: { "Content-Type": prepareUploadRes.contentType },
          body: file,
        });
      } catch {
        throw new Error(
          `Unable to upload ${file.name}. Check your connection and try again.`,
        );
      }

      if (!response.ok) {
        throw new Error(`Unable to upload ${file.name}. Please try again.`);
      }

      onProgress(index + 1, files.length);
    }
    return receipts;
  } catch (error) {
    // Includes the current ticket because a failed PUT response may still have
    // stored an object. Cleanup never touches files referenced by the database.
    try {
      await discardWebsiteSettingsFileUploads(
        receipts.map((receipt) => receipt.token),
      );
    } catch {
      /* An abandoned staging object can be removed by a bucket lifecycle rule. */
    }
    throw error;
  }
}
