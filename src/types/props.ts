import type { Models } from "@/prisma/contract.d";
import type { Shape } from "@prisma/orm-postgres/family-contract/types";

export interface LanguagesChartProps {
  languageLevels: Shape<Models.public_LanguageLevel>[];
  languages: Shape<Models.public_Language, { "+": "level" }>[];
}

export interface PageTitleProps {
  title: string;
}

export interface EmailTemplateBaseProps {
  previewText: string;
  children: React.ReactNode;
}

export interface EmailTemplateProps {
  url: string;
}

export interface SettingsFormProps {
  aboutText: string;
  languageLevels: Shape<Models.public_LanguageLevel, { "+": "languages" }>[];
}

export interface VowelChartButtonProps {
  chartName: string;
}
