import { db } from "@/prisma/db";
import { PageTitle, LanguagesChart } from "@/components";

export default async function LanguagesPage() {
  const languageLevels = await db.orm.public.LanguageLevel.orderBy(((l) => l.id.asc())).all();
  const languages = await db.orm.public.Language.include("level").orderBy(((l) => l.name.asc())).all();

  // Need to serialize data before passing to client component because it contains non-serializable data (Temporal objects)
  const serializedLanguageLevels = JSON.parse(JSON.stringify(languageLevels));
  const serializedLanguages = JSON.parse(JSON.stringify(languages));

  return (
    <section className="flex flex-col gap-10">
      <PageTitle title="languages" />
      <LanguagesChart languageLevels={serializedLanguageLevels} languages={serializedLanguages} />
    </section>
  )
}