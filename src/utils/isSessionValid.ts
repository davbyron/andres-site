import "server-only";

import { headers } from "next/headers";
import { auth } from "./auth";
import { ALLOWED_EMAILS } from "@/constants";

/**
 * Checks for a session whose email is authorized to manage website settings.
 * Callers that also need the user identity can pass their session to avoid
 * fetching it twice; otherwise, the current request's session is retrieved here.
 */
export async function isSessionValid(
  session?: Awaited<ReturnType<typeof auth.api.getSession>>,
): Promise<boolean> {
  const currentSession =
    session === undefined
      ? await auth.api.getSession({ headers: await headers() })
      : session;
  return (
    !!currentSession &&
    ALLOWED_EMAILS.has(currentSession.user.email.trim().toLowerCase())
  );
}
