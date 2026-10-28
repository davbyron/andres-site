"use server";

import type { SettingsFileUploadRequest } from "@/types/uploads";
import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { isSessionValid } from "@/utils/isSessionValid";
import {
  prepareSettingsUpload,
  SettingsValidationError,
} from "@/utils/settings/settings-file-upload-helpers";

export async function prepareWebsiteSettingsFileUpload(
  request: SettingsFileUploadRequest,
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!(await isSessionValid(session))) {
    return {
      success: false as const,
      error: "Please sign in with an authorized account to upload files.",
    };
  }

  try {
    const prepareSettingsUploadRes = await prepareSettingsUpload(request, session.user.id);

    return {
      success: true as const,
      ...prepareSettingsUploadRes,
    };
  } catch (error) {
    console.error("Unable to prepare settings upload:", error);

    return {
      success: false as const,
      error:
        error instanceof SettingsValidationError
          ? error.message
          : "Unable to prepare the file upload. Please try again.",
    };
  }
}
