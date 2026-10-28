import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { ALLOWED_EMAILS } from "@/constants";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
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
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const urlBase = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const params = new URLSearchParams({
        to: user.email,
        subject: "Reset your password",
        template: "reset-password",
        url,
      });

      const response = await fetch(`${urlBase}/api/send?${params.toString()}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Unable to send password reset email.");
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: false,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60, // 1 hour
    sendVerificationEmail: async ({ user, url }) => {
      // Update callback URL to be /settings after verification
      const urlObj = new URL(url);
      urlObj.searchParams.set("callbackURL", "/settings");
      const urlWithPasswordCallback = urlObj.toString();

      const urlBase = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const params = new URLSearchParams({
        to: user.email,
        subject: "Verify your email",
        template: "verification",
        url: urlWithPasswordCallback,
      });

      try {
        await fetch(`${urlBase}/api/send?${params.toString()}`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Error sending verification email:", error);
      }
    },
  },
  advanced: {
    database: {
      joins: true,
    }
  }
});
