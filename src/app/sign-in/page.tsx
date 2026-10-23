"use client";

import { SignInInputs } from "@/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/utils/auth-client";

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, }
  } = useForm<SignInInputs>();

  const [error, setError] = useState<string | null>(null);

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
            className="border"
          />
        </label>
        <div className="flex flex-col items-end gap-1">
          <label htmlFor="password" className="flex flex-col gap-1">
            Password
            <input
              {...register("password", { required: true })}
              id="password"
              type="password"
              className="border"
            />
          </label>
          <button
            type="button"
            className="text-xs opacity-75 cursor-pointer hover:brightness-110 active:brightness-90"
          >
            Forgot password?
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-red-500 max-w-80 text-center">{error}</p>}
      <button
        type="submit"
        className="bg-[#ddd] w-fit px-2 py-1 cursor-pointer hover:brightness-110 active:brightness-90"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
