import type { Models } from "@/prisma/contract.d";
import type { Shape } from "@prisma/orm-postgres/family-contract/types";
import type { Control } from "react-hook-form";
import type { SettingsFormInputs } from "./inputs";

export interface LanguagesChartProps {
  languageLevels: Shape<Models.public_LanguageLevel>[];
  languages: Shape<Models.public_Language, { "+": "level" }>[];
}

export interface PageTitleProps {
  title: string;
}

export interface ResetPasswordFormProps {
  token?: string;
  email?: string;
  submitLabel?: string;
  className?: string;
}

export interface EmailTemplateBaseProps {
  previewText: string;
  children: React.ReactNode;
}

export interface EmailTemplateProps {
  url: string;
}

export interface SettingsFormProps {
  email?: string;
  aboutText: string;
  languageLevels: Shape<Models.public_LanguageLevel, { "+": "languages" }>[];
  research: SettingsFormInputs["research"];
  unpublished: SettingsFormInputs["unpublished"];
  vowelCharts: (Shape<Models.public_VowelChart> & { src: string })[];
}

export interface ResearchItemProps {
  researchItem: Pick<
    Shape<Models.public_Research>,
    "authors" | "title" | "publication" | "pageNumbers"
  > & {
    date: string;
    href?: string;
  };
}

export interface ResearchItemPreviewProps {
  control: Control<SettingsFormInputs>;
  index: number;
}

export interface UnpublishedItemProps {
  unpublishedItem: Pick<
    Shape<Models.public_Unpublished>,
    "authors" | "title"
  > & {
    date: string;
    href?: string;
  };
}

export interface UnpublishedItemPreviewProps {
  control: Control<SettingsFormInputs>;
  index: number;
}

export interface VowelChartButtonProps {
  chartName: string;
}

export interface VowelChartPreviewProps {
  control: Control<SettingsFormInputs>;
  index: number;
  src?: string;
}
