import { PageTitle, ResetPasswordForm } from "@/components";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <section className="flex flex-col gap-10">
      <PageTitle title="forgot password" />
      <ResetPasswordForm />
      <Link href="/sign-in" className="self-center text-xs underline">
        back to sign in
      </Link>
    </section>
  );
}
