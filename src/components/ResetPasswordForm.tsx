"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import type { ResetPasswordFormProps, ResetPasswordInputs } from "@/types";
import { authClient } from "@/utils/auth-client";

export function ResetPasswordForm(props: ResetPasswordFormProps) {
  const {
    token,
    email,
    submitLabel,
    className = "py-5 flex flex-col items-center gap-8",
  } = props;

  const id = useId();
  const pathname = usePathname();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [complete, setComplete] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm<ResetPasswordInputs>({ defaultValues: { email: email ?? "" } });

  async function onSubmit(data: ResetPasswordInputs) {
    clearErrors("root");

    try {
      const result = token
        ? await authClient.resetPassword({ token, newPassword: data.password })
        : await authClient.requestPasswordReset({
          email: email || data.email,
          redirectTo: "/reset-password",
        });

      if (result.error) {
        setError("root", { message: result.error.message || "Unable to reset your password. Please try again." });
        return;
      }
      setComplete(true);
    } catch {
      setError("root", { message: "Unable to connect. Please try again." });
    }
  }

  if (complete) {
    return (
      <div className={className}>
        <p role="status" className="max-w-80 text-center">
          {pathname === "/settings"
            ? "Please check your email for a link to reset your password."
            : token
              ? "Your password has been updated. Sign in with your new password."
              : "If an account exists for this email, you'll receive a link to reset your password."}
        </p>
        {token && <Link href="/sign-in" className="text-xs underline">back to sign in</Link>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <p>{token ? "Please set a new password:" : "Receive an email with a link to reset your password."}</p>
      {token ? (
        <>
          <div className="flex flex-col gap-2">
            <p>Requirements:</p>
            <ul className="list-disc list-inside text-sm">
              <li>Between 8 and 128 characters</li>
              <li>Contains at least one uppercase letter</li>
              <li>Contains at least one lowercase letter</li>
              <li>Contains at least one number</li>
            </ul>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor={`${id}-password`}>New Password</label>
            <div className="relative">
              <input
                {...register("password", {
                  required: "Enter a new password.",
                  minLength: { value: 8, message: "Password must be at least 8 characters long." },
                  maxLength: { value: 128, message: "Password must be no more than 128 characters long." },
                  validate: (value) => (
                    /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value)
                  ) || "Password must contain an uppercase letter, a lowercase letter, and a number.",
                })}
                id={`${id}-password`}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="border p-1 pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword((show) => !show)}
                aria-label={showPassword ? "Hide new password" : "Show new password"}
                aria-controls={`${id}-password`}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-75 cursor-pointer hover:brightness-110 active:brightness-90"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p role="alert" className="max-w-[30ch] text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor={`${id}-confirmPassword`}>Confirm New Password</label>
            <div className="relative">
              <input
                {...register("confirmPassword", {
                  required: "Confirm your new password.",
                  validate: (value) => value === getValues("password") || "Passwords do not match.",
                })}
                id={`${id}-confirmPassword`}
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                className="border p-1 pr-14"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((show) => !show)}
                aria-label={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"}
                aria-controls={`${id}-confirmPassword`}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-75 cursor-pointer hover:brightness-110 active:brightness-90"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && <p role="alert" className="max-w-[30ch] text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>
        </>
      ) : email ? (
        <p className="text-sm">Reset link will be sent to {email}.</p>
      ) : (
        <label htmlFor={`${id}-email`} className="flex flex-col gap-1">
          Email
          <input
            {...register("email", { required: "Enter your email address." })}
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            className="border p-1"
          />
          {errors.email && <span role="alert" className="text-red-500 text-sm">{errors.email.message}</span>}
        </label>
      )}
      {errors.root && <p role="alert" className="max-w-80 text-red-500 text-sm">{errors.root.message}</p>}
      {token && errors.root && (
        <Link href="/forgot-password" className="text-xs underline">request a new reset link</Link>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#ddd] w-fit px-2 py-1 cursor-pointer hover:brightness-110 active:brightness-90 disabled:opacity-50 disabled:cursor-wait"
      >
        {isSubmitting ? "Submitting..." : (submitLabel || (token ? "Reset Password" : "Send Reset Link"))}
      </button>
    </form>
  );
}
