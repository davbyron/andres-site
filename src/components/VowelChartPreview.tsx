"use client";

import type { VowelChartPreviewProps } from "@/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useWatch } from "react-hook-form";

export function VowelChartPreview({ control, index, src }: VowelChartPreviewProps) {
  const chart = useWatch({ control, name: `vowelCharts.${index}` });
  const file = chart?.file?.[0];
  const [preview, setPreview] = useState<{ file: File; url: string }>();

  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview({ file, url });
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const imageSrc = file ? (preview?.file === file ? preview.url : undefined) : src;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-5/7">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`${chart?.name || "Untitled"} vowel chart`}
            fill
            sizes="(min-width: 640px) 144px, 96px"
            unoptimized={Boolean(file)}
          />
        ) : (
          <div className="h-full p-2 flex items-center justify-center text-xs text-center border opacity-75">
            Choose an image to preview
          </div>
        )}
      </div>
      <p className="w-full text-center font-bold wrap-break-word">{chart?.name}</p>
    </div>
  );
}
