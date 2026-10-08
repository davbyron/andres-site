import Link from "next/link";
import Image from "next/image";
import { db } from "@/prisma/db";
import { PageTitle, VowelChartButton } from "@/components";

export default async function VowelChartPage() {
  const vowelCharts = await db.orm.public.VowelChart.orderBy(((v) => v.name.asc())).all();
  const serializedVowelCharts = JSON.parse(JSON.stringify(vowelCharts));

  // Get random vowel chart for example image next to description
  const randomVowelChart = serializedVowelCharts[Math.floor(Math.random() * serializedVowelCharts.length)];
  
  return (
    <section className="min-h-full flex flex-col gap-10">
      <PageTitle title="vowelchArt" />
      <div className="flex-1 flex gap-5 z-20">
        <div className="px-4 flex flex-col gap-5 text-justify">
          <div>
            <p>
              This project is intended as a visualization of how various languages employ
              the same phonetic space differently. Vowels are plotted with their average
              F1 values rising downward and F2 rising leftward (a standard phonetic vowel
              chart). The data is taken from literature cited in the link below. These are
              not the only correlates which distinguish vowels: other formants (F3 & F4),
              nasality, length, and tone all can be important. However, F1 and F2 are often
              the most important factors when choosing symbols to represent vowel
              phonemes. (
                <Link
                  href="/vowels_bib.pdf"
                  target="_blank"
                  className="text-blue-700">Works cited
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
              {serializedVowelCharts.map((chart) => (
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
          absolute inset-x-0 top-full py-64 px-6 grid grid-cols-1 gap-10 z-10
          md:py-48 md:grid-cols-3
          xl:px-0 xl:grid-cols-4 xl:gap-15
          3xl:py-120
        "
      >
        {serializedVowelCharts.map((chart) => (
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
