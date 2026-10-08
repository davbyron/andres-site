"use client";

import type { LanguagesChartProps } from "@/types/props";
import { useMemo } from "react";
import { defineChart, barY, barX, bandX, bandY, whenFocused } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { Chart as TooltipChart } from "@tanstack/charts/react/tooltip";
import { useIsMobile } from "@/hooks";

export function LanguagesChart(props: LanguagesChartProps) {
  const { languageLevels, languages } = props;
  const isMobile = useIsMobile();

  const { levelMap, tickValues, maxLevel } = useMemo(() => {
    const map: Record<number, string> = {};
    const ticks: number[] = [];
    let max = 0;

    languageLevels.forEach((level) => {
      map[level.id] = level.name;
      ticks.push(level.id);
      if (level.id > max) max = level.id;
    });

    return { levelMap: map, tickValues: ticks, maxLevel: max };
  }, [languageLevels]);

  const languagesChart = useMemo(() => {
    if (isMobile) {
      // Mobile-friendly version of chart with languages on the Y axis
      return defineChart(
        {
          marks: [
            whenFocused(
              bandY(languages, {
                y: "name",
                fill: "#eee",
              }),
              { match: "y" }
            ),
            barX(languages, {
              y: "name",
              x: (language) => language.level.id,
              fill: (language) => language.level.color,
              inset: 3,
            }),
          ],
          scales: {
            y: {
              scale: () => scaleBand(),
              nice: false,
              axis: {
                ticks: { size: 0 },
                tickLabels: { fontSize: 13, fontWeight: 400 },
              },
            },
            x: {
              scale: scaleLinear,
              domain: [0, maxLevel],
              side: "top",
              axis: {
                ticks: {
                  values: tickValues,
                  format: (level: number) => levelMap[level] ?? "",
                },
                tickLabels: {
                  rotate: 45,
                  anchor: "end",
                  thin: false,
                  fontSize: 11,
                  fontWeight: 400
                },
              },
            },
          },
          focusRing: false,
        },
        {
          tooltip: { use: tooltip, anchor: "pointer" },
        }
      );
    }

    // Desktop version of chart with languages on the X axis
    return defineChart(
      {
        marks: [
          whenFocused(
            bandX(languages, {
              x: "name",
              fill: "#eee",
            }),
            { match: "x" }
          ),
          barY(languages, {
            x: "name",
            y: (language) => language.level.id,
            fill: (language) => language.level.color,
            inset: 4,
          }),
        ],
        scales: {
          x: {
            scale: () => scaleBand(),
            nice: false,
            axis: {
              ticks: { size: 0 },
              tickLabels: {
                rotate: -45,
                thin: false,
                fontSize: 14,
                fontWeight: 400,
              },
            },
          },
          y: {
            scale: scaleLinear,
            domain: [0, maxLevel],
            axis: {
              ticks: {
                values: tickValues,
                format: (level: number) => levelMap[level] ?? "",
              },
              tickLabels: { fontSize: 14, fontWeight: 400 },
            },
          },
        },
        focusRing: false,
      },
      {
        tooltip: { use: tooltip, anchor: "pointer" },
      }
    );
  }, [isMobile, languages, levelMap, maxLevel, tickValues]);

  return (
    <div className="w-full">
      <TooltipChart
        definition={languagesChart}
        height={isMobile ? Math.max(350, languages.length * 40) : 450}
        ariaLabel="Language proficiency chart"
        renderTooltipBody={({ primaryPoint }) => (
          <p className="w-fit flex flex-col gap-1">
            <span className="text-gray">{primaryPoint.datum.name}</span>
            <span className="pl-5">level: {primaryPoint.datum.level.name}</span>
          </p>
        )}
      />
    </div>
  );
}
