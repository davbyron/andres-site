import { PageTitle } from "@/components";

export default function HomePage() {
  return (
    <section className="flex flex-col gap-10">
      <PageTitle title="about" />
      <p className="px-4 text-justify">
        I am a postdoctoral researcher at Uppsala University in language documentation.
        I wrote my PhD dissertation at Boston University on African whistled languages,
        specifically Kinande, isiXhosa, and TshiVenda. My academic interests include
        sociolinguistics, phonetics, phonology, migration studies, and understudied
        languages and language varieties. My biggest current projects are documenting
        the whistled modality of Asante Twi, helping design learning materials for
        a high school Northern Pomo class, and exploring microcomparative variation in
        affectionate kinship constructions across Bantu languages which seem
        to rely on inalienable syntactic structures.
      </p>
    </section>
  );
}
