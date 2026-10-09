import Link from "next/link";
import Image from "next/image";
import { db } from "@/prisma/db";
import { PageTitle, VowelChartButton } from "@/components";

export default async function VowelChartPage() {
  const vowelChartPageText = await db.orm.public.PageText.where({ key: "Vowel Chart Page" }).first();
  const vowelCharts = await db.orm.public.VowelChart.orderBy(((v) => v.name.asc())).all();

  // Get random vowel chart for example image next to description
  const randomVowelChart = vowelCharts[Math.floor(Math.random() * vowelCharts.length)];
  
  return (
    <section className="min-h-full flex flex-col gap-10">
      <PageTitle title="vowelchArt" />
      <div className="flex-1 flex gap-5 z-20">
        <div className="px-4 flex flex-col gap-5 text-justify">
          <div>
            <p>
              {vowelChartPageText.value} (
                <Link
                  href="/vowels_bib.pdf"
                  target="_blank"
                  className="text-blue-700"
                >
                    Works cited
                </Link>
              )
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p>Scroll down or select a language to explore its vowel system:</p>
            <div
              className="
                grid grid-cols-3 auto-rows-fr gap-2
                md:grid-cols-5
                xl:grid-cols-6
                2xl:grid-cols-5
              "
            >
              {vowelCharts.map((chart) => (
                <VowelChartButton key={chart.name} chartName={chart.name} />
              ))}
            </div>
          </div>
        </div>
        <div className="hidden 2xl:flex flex-col gap-2">
          <p className="italic text-xs text-center">Example:</p>
          <div className="relative aspect-5/7 w-full h-full max-h-110">
            <Image
              src={`/images/${randomVowelChart.filename}`}
              alt={`${randomVowelChart.name} vowel chart`}
              fill
            />
          </div>
          <p className="w-full text-center font-bold">{randomVowelChart.name}</p>
        </div>
      </div>

      <div
        className="
          relative pt-64 px-4 grid grid-cols-1 gap-10 z-10
          md:pt-48 md:grid-cols-3
          lg:w-[calc(150%+9rem)] lg:right-[calc(50%+6rem)]
          xl:px-0 xl:grid-cols-4 xl:gap-15
          3xl:pt-120
        "
      >
        {vowelCharts.map((chart) => (
          <div
            key={chart.name}
            id={chart.name}
            className="flex flex-col gap-2"
          >
            <div className="relative aspect-5/7">
              <Image
                src={`/images/${chart.filename}`}
                alt={`${chart.name} vowel chart`}
                fill
              />
            </div>
            <p className="w-full text-center font-bold">{chart.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
