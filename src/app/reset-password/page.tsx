import Link from "next/link";
import { PageTitle, ResetPasswordForm } from "@/components";

export default async function ResetPasswordPage({ searchParams }: {
  searchParams: Promise<{ token?: string | string[]; error?: string | string[] }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : undefined;

  return (
    <section className="flex flex-col gap-10">
      <PageTitle title="reset password" />
      {token && !params.error ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p role="alert" className="text-center text-red-500">
            Invalid or missing token. Please check your reset password link or request a new one.
          </p>
          <Link href="/forgot-password" className="text-xs underline">request a new reset link</Link>
        </div>
      )}
    </section>
  );
}
