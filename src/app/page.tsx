import { db } from "@/prisma/db";
import { PageTitle } from "@/components";

export default async function HomePage() {
  const aboutPageText = await db.orm.public.PageText.where({ key: "About Page" }).first();

  return (
    <section className="flex flex-col gap-10">
      <PageTitle title="about" />
      <p className="px-4 text-justify">
        {aboutPageText.value}
      </p>
    </section>
  );
}
