"use client";

import { useMemo } from "react";
import type { Models } from "@/prisma/contract.d";
import type { Shape } from "@prisma/orm-postgres/family-contract/types";
import { defineChart, barY, bandX, whenFocused } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { Chart as TooltipChart } from "@tanstack/charts/react/tooltip";

interface LanguagesChartProps {
  languageLevels: Shape<Models.public_LanguageLevel>[];
  languages: Shape<Models.public_Language, { "+": "level" }>[];
}

export function LanguagesChart(props: LanguagesChartProps) {
  const { languageLevels, languages } = props;

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

  const languagesChart = defineChart(
    {
      marks: [
        // Add background band highlight on hover (placed before barY)
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
            ticks: {
              size: 0,
            },
            tickLabels: {
              rotate: -45,
              thin: false,
              fontSize: 14,
              fontWeight: 400,
              opacity: 100,
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
            tickLabels: {
              fontSize: 14,
              fontWeight: 400,
              opacity: 100,
            }
          },
        },
      },
      focusRing: false,
    }, {
      tooltip: {
        use: tooltip,
        anchor: "pointer",
      }
    }
  );

  return (
    <TooltipChart
      definition={languagesChart}
      height={450}
      ariaLabel="Language proficiency chart"
      renderTooltipBody={({ primaryPoint }) => {
        return (
          <p className="w-fit flex flex-col gap-1">
            <span className="text-gray">{primaryPoint.datum.name}</span>
            <span className="pl-5">level: {primaryPoint.datum.level.name}</span>
          </p>
        )
      }}
    />
  )
}