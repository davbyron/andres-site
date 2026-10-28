"use client";

import { useWatch } from "react-hook-form";
import type { UnpublishedItemPreviewProps } from "@/types/props";
import { UnpublishedItem } from "./UnpublishedItem";

export function UnpublishedItemPreview({ control, index }: UnpublishedItemPreviewProps) {
  const item = useWatch({ control, name: `unpublished.${index}` });

  if (!item) return null;

  return (
    <div className="flex flex-col gap-10 pb-7">
      <p>preview</p>
      <ol>
        <UnpublishedItem unpublishedItem={{ ...item, href: "" }} />
      </ol>
    </div>
  );
}
