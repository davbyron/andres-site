import type { Models } from "@/prisma/contract.d";
import type { Shape } from "@prisma/orm-postgres/family-contract/types";
import { db } from "@/prisma/db";
import { PageTitle, LanguagesChart } from "@/components";

export default async function LanguagesPage() {
  const languageLevels = await db.orm.public.LanguageLevel.orderBy(((l) => l.id.asc())).all();
  // Ignore the TypeScript error for the include method on the Language model.
  // TS is saying the type should be "never", but that is not right.
  // Check back in the future when prisma@8.0.0 is stable and may have fixed this issue with the generated types from the contract.
  //@ts-ignore
  const languages = await db.orm.public.Language.include("level").orderBy(((l) => l.name.asc())).all();

  // Need to serialize data before passing to client component because it contains non-serializable data (Temporal objects)
  const serializedLanguageLevels: Shape<Models.public_LanguageLevel>[] = JSON.parse(JSON.stringify(languageLevels));
  const serializedLanguages: Shape<Models.public_Language, { "+": "level" }>[] = JSON.parse(JSON.stringify(languages));

  return (
    <section className="flex flex-col gap-10">
      <PageTitle title="languages" />
      <LanguagesChart languageLevels={serializedLanguageLevels} languages={serializedLanguages} />
    </section>
  )
}