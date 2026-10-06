"use client";

import type { VowelChartButtonProps } from "@/types";

export function VowelChartButton(props: VowelChartButtonProps) {
  const { chartName } = props;

  function scrollToVowelChart() {
    const chartElement = document.getElementById(chartName);
    if (!chartElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          setTimeout(() => {
            chartElement.animate(
              [
                { transform: "rotate(0) scale(1)" },
                { transform: "rotate(5deg) scale(1.1)" },
                { transform: "rotate(-5deg) scale(1.1)" },
                { transform: "rotate(5deg) scale(1.1)" },
                { transform: "rotate(-5deg) scale(1.1)" },
                { transform: "rotate(5deg) scale(1.1)" },
                { transform: "rotate(-5deg) scale(1.1)" },
                { transform: "rotate(0) scale(1)" },
              ],
              { duration: 750, iterations: 1 }
            );
          }, 300);

          observer.disconnect();
        }
      },
      {
        threshold: 0.85,
      }
    );

    observer.observe(chartElement);
    chartElement.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToVowelChart}
      className="
        bg-[#ddd] px-4 py-2 flex items-center justify-center
        text-center text-sm cursor-pointer
        hover:brightness-110 active:brightness-90
      "
    >
      {chartName}
    </button>
  );
}