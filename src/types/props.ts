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
  research: Shape<Models.public_Research>[];
  unpublished: Shape<Models.public_Unpublished>[];
}

export interface ResearchItemProps {
  researchItem: Pick<Shape<Models.public_Research>, "year" | "authors" | "title" | "publication" | "pageNumbers"> & {
    href?: string;
  };
}

export interface ResearchItemPreviewProps {
  control: Control<SettingsFormInputs>;
  index: number;
}

export interface UnpublishedItemProps {
  unpublishedItem: Pick<Shape<Models.public_Unpublished>, "year" | "authors" | "title"> & {
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
