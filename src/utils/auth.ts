import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { db } from "@/prisma/db";
import { ALLOWED_EMAILS } from "@/constants";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  hooks: {
    // Restrict sign-up and sign-in to specific email addresses
    before: createAuthMiddleware(async (ctx) => {
      // Only inspect credentials on email sign-in/up routes
      if (ctx.path !== "/sign-up/email" && ctx.path !== "/sign-in/email") {
        return;
      }

      const body = ctx.body;
      const email = (typeof body === "object" && body !== null && "email" in body)
        ? String(body.email).trim().toLowerCase()
        : undefined;

      if (!email || !ALLOWED_EMAILS.has(email)) {
        throw new APIError("FORBIDDEN", {
          message: "This email address is not authorized.",
        });
      }
    }),
  },
  plugins: [
    nextCookies()
  ],
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  }
});
