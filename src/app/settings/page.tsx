import type { Models } from "@/prisma/contract.d";
import type { Shape } from "@prisma/orm-postgres/family-contract/types";
import { headers } from "next/headers";
import { db } from "@/prisma/db";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PageTitle, SettingsForm } from "@/components";
import { s3Client, BUCKET_NAME } from "@/utils";

import { auth } from "@/utils/auth";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const aboutPageText = await db.orm.public.PageText.where({ key: "About Page" }).first();
  //@ts-ignore
  const languageLevels = await db.orm.public.LanguageLevel.include("languages").orderBy((l) => l.id.desc()).all();
  const serializedLanguageLevels: Shape<Models.public_LanguageLevel, { "+": "languages" }>[] = JSON.parse(JSON.stringify(languageLevels));
  const research = await db.orm.public.Research.orderBy((r) => r.date.desc()).all();
  const serializedResearch: Shape<Models.public_Research>[] = JSON.parse(JSON.stringify(research));
  const unpublished = await db.orm.public.Unpublished.orderBy((item) => item.date.desc(),).all();
  const serializedUnpublished: Shape<Models.public_Unpublished>[] = JSON.parse(JSON.stringify(unpublished));
  const vowelCharts = await db.orm.public.VowelChart.orderBy((chart) => chart.name.asc()).all();
  const serializedVowelCharts: Shape<Models.public_VowelChart>[] = JSON.parse(JSON.stringify(vowelCharts));
  const resolvedVowelCharts = await Promise.all(
    serializedVowelCharts.map(async (chart) => ({
      ...chart,
      src: await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: `images/vowel-charts/${chart.filename}`,
        }),
      ),
    })),
  );

  return (
    <section className="flex flex-col gap-10">
      <PageTitle title="settings" />
      <SettingsForm
        email={session?.user.email}
        aboutText={aboutPageText?.value || ""}
        languageLevels={serializedLanguageLevels}
        research={serializedResearch}
        unpublished={serializedUnpublished}
        vowelCharts={resolvedVowelCharts}
      />
    </section>
  );
}
