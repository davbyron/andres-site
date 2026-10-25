"use client";

import { SignInInputs } from "@/types";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { authClient } from "@/utils/auth-client";
import { ALLOWED_EMAILS } from "@/constants";

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isSubmitting, }
  } = useForm<SignInInputs>();

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function resendVerificationCode() {
    const email = getValues("email");
    if (!email) {
      setError("Please enter your email to resend the verification code.");
      return;
    }

    if (!ALLOWED_EMAILS.has(email)) {
      setError("This email address is not authorized.");
      return;
    }

    await authClient.sendVerificationEmail({ email });
    setError("Verification email resent. Please check your inbox.");
  }

  async function onSubmit(data: SignInInputs) {
    const { data: _, error: signInError } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/settings",
    });

    if (signInError) {
      setError(`Error: ${signInError.message}.`);
    } else {
      setError(null);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="py-10 flex flex-col items-center gap-8 border"
    >
      <p>Sign in to alter site settings:</p>
      <div className="flex flex-col gap-4">
        <label htmlFor="email" className="flex flex-col gap-1">
          Email
          <input
            {...register("email", { required: true })}
            id="email"
            type="email"
            className="border p-1"
          />
        </label>
        <div className="flex flex-col items-end gap-1">
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <div className="relative">
              <input
                {...register("password", { required: true })}
                id="password"
                type={showPassword ? "text" : "password"}
                className="border p-1 pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword((show) => !show)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-controls="password"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-75 cursor-pointer hover:brightness-110 active:brightness-90"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <Link
            href="/reset-password"
            className="text-xs opacity-75 cursor-pointer hover:brightness-110 active:brightness-90"
          >
            Forgot password?
          </Link>
        </div>
      </div>
      {error && <p className="text-sm text-red-500 max-w-80 text-center">{error}</p>}
      {error && error === "Error: Email not verified." && (
        <button
          type="button"
          onClick={resendVerificationCode}
          className="bg-[#ddd] w-fit px-2 py-1 cursor-pointer hover:brightness-110 active:brightness-90"
        >
          Resend Verification Code
        </button>
      )}
      <button
        type="submit"
        className="bg-[#ddd] w-fit px-2 py-1 cursor-pointer hover:brightness-110 active:brightness-90"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
