import Image from "next/image";
import { db } from "@/prisma/db";
import { PageTitle, VowelChartButton } from "@/components";

export default async function VowelChartPage() {
  const vowelCharts = await db.orm.public.VowelChart.orderBy(((v) => v.name.asc())).all();
  const serializedVowelCharts = JSON.parse(JSON.stringify(vowelCharts));
  console.log("serializedVowelCharts", serializedVowelCharts);
  
  return (
    <section className="min-h-full flex flex-col gap-10">
      <PageTitle title="vowelchArt" />
      <div className="flex-1 flex gap-5">
        <div className="px-4 flex flex-col gap-5 text-justify">
          <p>
            This project is intended as a visualization of how various languages employ
            the same phonetic space differently. Vowels are plotted with their average
            F1 values rising downward and F2 rising leftward (a standard phonetic vowel
            chart). The data is taken from literature cited in the link below. These are
            not the only correlates which distinguish vowels: other formants (F3 & F4),
            nasality, length, and tone all can be important. However, F1 and F2 are often
            the most important factors when choosing symbols to represent vowel phonemes.
          </p>
          <p>
            (<a href="/vowels_bib.pdf" className="text-blue-700">Works cited</a>)
          </p>
          <div className="flex flex-col gap-2">
            <p>Scroll down or select a language to explore its vowel system:</p>
            <div className="grid grid-cols-6 auto-rows-fr gap-2">
              {serializedVowelCharts.map((chart) => (
                <VowelChartButton key={chart.name} chartName={chart.name} />
              ))}
            </div>
          </div>
        </div>
        <div className="relative aspect-5/7">
          <Image
            src="/images/greek.png"
            alt="test image"
            fill
          />
        </div>
      </div>
      <div className="absolute inset-x-0 top-full py-48 grid grid-cols-4 gap-15">
        {serializedVowelCharts.map((chart) => (
          <div key={chart.name} id={chart.name} className="flex flex-col gap-2">
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
