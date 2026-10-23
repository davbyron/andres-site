import { EmailTemplateProps } from "@/types";
import EmailTemplateBase from "./EmailTemplateBase";
import {
  Button,
  Heading,
  Link,
  Text,
} from "react-email";

export function VerificationEmailTemplate(props: EmailTemplateProps) {
  const { url } = props;

  return (
    <EmailTemplateBase previewText="Confirm your email address to finish setting up your account.">
      <Text className="mb-3 mt-0 text-[11px] font-bold tracking-[1.5px] text-[#777970]">
        ACCOUNT VERIFICATION
      </Text>
      <Heading className="mb-3.5 mt-0 text-[30px] font-semibold leading-[1.2] tracking-[-0.7px] text-[#20211f]">
        You&apos;re almost there.
      </Heading>
      <Text className="mb-6.5 mt-0 text-[15px] leading-[1.7] text-[#62645d]">
        Confirm your email address to finish setting up your account.
      </Text>
      <Button
        href={url}
        className="bg-[#ddd] w-fit p-4 text-gray cursor-pointer"
      >
        Verify your email&nbsp; →
      </Button>
      <Text className="mb-0 mt-7.5 border-t border-[#e6e6e0] pt-5.5 text-[13px] leading-[1.7] text-[#777970]">
        After verification, you can log in and manage site settings at{" "}
        <Link href="https://andreschwab.com/settings" className="font-semibold text-[#20211f] underline">
          andreschwab.com/settings
        </Link>.
      </Text>
      <Text className="mb-0 mt-4.5 text-xs leading-[1.6] text-[#999a93]">
        If you didn&apos;t create an account, you can safely ignore this email.
      </Text>
    </EmailTemplateBase>
  );
}
