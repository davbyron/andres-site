import type { NextRequest } from "next/server";
import { ResetPasswordEmailTemplate, VerificationEmailTemplate } from "@/components";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const to = searchParams.get("to");
  const subject = searchParams.get("subject");
  const url = searchParams.get("url");
  const template = searchParams.get("template");

  if (!to || !subject || !url || !template) {
    return Response.json({ error: "All parameters are required" }, { status: 400 });
  }

  if (template !== "verification" && template !== "reset-password") {
    return Response.json({ error: "Invalid template" }, { status: 400 });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "David Byron <david@contact.davidbyron.info>",
      to,
      subject,
      react: template === "verification" ? VerificationEmailTemplate({ url }) : ResetPasswordEmailTemplate({ url }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
