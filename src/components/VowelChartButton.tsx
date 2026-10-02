"use client";

import type { VowelChartButtonProps } from "@/types";
import Link from "next/link";

export function VowelChartButton(props: VowelChartButtonProps) {
  const { chartName } = props;

  return (
    <Link
      href={`#${chartName}`}
      className="
        bg-[#ddd] px-4 py-2 flex items-center justify-center
        text-center text-sm
        hover:brightness-110 active:brightness-90
      "
    >
      {chartName}
    </Link>
  );
}