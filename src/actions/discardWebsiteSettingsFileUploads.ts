"use server";

import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { isSessionValid } from "@/utils/isSessionValid";
import { deleteSettingsFiles, readSettingsUpload } from "@/utils/settings/settings-file-upload-helpers";

export async function discardWebsiteSettingsFileUploads(tokens: string[]) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!(await isSessionValid(session)) || !Array.isArray(tokens)) return;

  // Only staging keys from authentic, user-bound tickets can be deleted here.
  const keys = tokens.flatMap((token) => {
    try {
      return [readSettingsUpload(token, session.user.id).key];
    } catch {
      return [];
    }
  });

  await deleteSettingsFiles(keys);
}
