import { EmailTemplateProps } from "@/types";
import EmailTemplateBase from "./EmailTemplateBase";
import {
  Button,
  Heading,
  Link,
  Text,
} from "react-email";

export function ResetPasswordEmailTemplate(props: EmailTemplateProps) {
  const { url } = props;

  return (
    <EmailTemplateBase previewText="Reset your password to regain access to your account.">
      <Text className="mb-3 mt-0 text-[11px] font-bold tracking-[1.5px] text-[#777970]">
        PASSWORD RESET
      </Text>
      <Heading className="mb-3.5 mt-0 text-[30px] font-semibold leading-[1.2] tracking-[-0.7px] text-[#20211f]">
        Reset your password.
      </Heading>
      <Text className="mb-6.5 mt-0 text-[15px] leading-[1.7] text-[#62645d]">
        Click below to choose a new password for your account.
      </Text>
      <Button
        href={url}
        className="bg-[#ddd] w-fit p-4 text-gray cursor-pointer"
      >
        Reset your password&nbsp; →
      </Button>
      <Text className="mb-0 mt-7.5 border-t border-[#e6e6e0] pt-5.5 text-xs leading-[1.6] text-[#999a93]">
        If you didn&apos;t request a password reset, please notify David Byron (<Link href="mailto:davbyron@icloud.com">davbyron@icloud.com</Link>).
      </Text>
    </EmailTemplateBase>
  );
}
