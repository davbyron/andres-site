import Link from "next/link";
import type { ResearchItemProps } from "@/types";
import { formatAuthors } from "@/utils/formatAuthors";

export function ResearchItem(props: ResearchItemProps) {
  const { researchItem } = props;

  return (
    <li className="grid grid-cols-12 gap-5 lg:gap-10">
      <div className="col-span-2 text-center">{researchItem.year.toString()}</div>
      <div className="col-span-5 lg:col-span-3">{formatAuthors(researchItem.authors)}</div>
      <div className="col-span-5 lg:col-span-7">
        {researchItem.href ? (
          <Link
            href={researchItem.href}
            target="_blank"
            className="text-blue-700 visited:text-purple-700 hover:brightness-200 active:brightness-75"
          >
            {researchItem.title}.
          </Link>
        ) : (
          <span>{researchItem.title}.</span>
        )}
        <span className="italic"> {researchItem.publication}.</span>
        {researchItem.pageNumbers && <span> {researchItem.pageNumbers}.</span>}
      </div>
    </li>
  );
}
