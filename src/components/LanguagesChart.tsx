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

  const mobileLanguagesChart = useMemo(
    () =>
      defineChart(
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
                line: { strokeOpacity: 1 },
                ticks: { size: 0 },
                tickLabels: {
                  opacity: 1,
                  fontSize: 12,
                  fontWeight: 400
                },
              },
            },
            x: {
              scale: scaleLinear,
              domain: [0, maxLevel],
              side: "top",
              axis: {
                line: { strokeOpacity: 1 },
                ticks: {
                  padding: 0,
                  values: tickValues,
                  format: (level: number) => levelMap[level] ?? "",
                },
                tickLabels: {
                  opacity: 1,
                  rotate: 45,
                  anchor: "end",
                  thin: false,
                  fontSize: 12,
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
      ),
    [languages, levelMap, maxLevel, tickValues]
  );

  const desktopLanguagesChart = useMemo(
    () =>
      defineChart(
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
                line: { strokeOpacity: 1 },
                ticks: { size: 0 },
                tickLabels: {
                  opacity: 1,
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
                line: { strokeOpacity: 1 },
                ticks: {
                  values: tickValues,
                  format: (level: number) => levelMap[level] ?? "",
                },
                tickLabels: {
                  opacity: 1,
                  fontSize: 14,
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
      ),
    [languages, levelMap, maxLevel, tickValues]
  );

  return (
    <div className="w-full">
      {isMobile ? (
        <TooltipChart
          definition={mobileLanguagesChart}
          height={Math.max(350, languages.length * 40)}
          ariaLabel="Language proficiency chart"
          renderTooltipBody={({ primaryPoint }) => (
            <p className="w-fit flex flex-col gap-1">
              <span className="text-gray">{primaryPoint.datum.name}</span>
              <span className="pl-5">level: {primaryPoint.datum.level.name}</span>
            </p>
          )}
        />
      ) : (
        <TooltipChart
          definition={desktopLanguagesChart}
          height={400}
          ariaLabel="Language proficiency chart"
          renderTooltipBody={({ primaryPoint }) => (
            <p className="w-fit flex flex-col gap-1">
              <span className="text-gray">{primaryPoint.datum.name}</span>
              <span className="pl-5">level: {primaryPoint.datum.level.name}</span>
            </p>
          )}
        />
      )}
    </div>
  );
}
