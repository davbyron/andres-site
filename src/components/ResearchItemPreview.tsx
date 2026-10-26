"use client";

import { useWatch } from "react-hook-form";
import type { ResearchItemPreviewProps } from "@/types/props";
import { ResearchItem } from "./ResearchItem";

export function ResearchItemPreview({ control, index }: ResearchItemPreviewProps) {
  const item = useWatch({ control, name: `research.${index}` });

  if (!item) return null;

  return (
    <div className="flex flex-col gap-10 pb-7">
      <p>preview</p>
      <ResearchItem researchItem={{ ...item, href: "" }} />
    </div>
  );
}
