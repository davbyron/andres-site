import { EmailTemplateBaseProps } from "@/types";
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
  Tailwind,
  pixelBasedPreset,
} from "react-email";

export default function EmailTemplateBase(props: EmailTemplateBaseProps) {
  const { previewText, children } = props;

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind config={{
        presets: [pixelBasedPreset],
        theme: {
          extend: {
            colors: {
              gray: "#707070",
            },
            fonts: {
              "helvetica-neue": ["Helvetica Neue", "sans-serif"],
            },
          }
        }
      }}>
        <Body className="px-4 py-10 font-[Helvetica,sans-serif] text-gray">
          <Container className="mx-auto max-w-130 border border-[#e6e6e0] bg-white p-10">
            <Text className="mb-10.5 mt-0 text-3xl font-normal text-gray">
              André Batchelder-Schwab
            </Text>
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
