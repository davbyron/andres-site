import Link from "next/link";
import type { UnpublishedItemProps } from "@/types";
import { formatAuthors } from "@/utils/formatAuthors";

export function UnpublishedItem({ unpublishedItem }: UnpublishedItemProps) {
  return (
    <li className="grid grid-cols-12 gap-5 lg:gap-10">
      <div className="col-span-2 text-center">{unpublishedItem.year.toString()}</div>
      <div className="col-span-5 lg:col-span-3">{formatAuthors(unpublishedItem.authors)}</div>
      <div className="col-span-5 lg:col-span-7">
        {unpublishedItem.href ? (
          <Link
            href={unpublishedItem.href}
            target="_blank"
            className="text-blue-700 visited:text-purple-700 hover:brightness-200 active:brightness-75"
          >
            {unpublishedItem.title}.
          </Link>
        ) : (
          <span>{unpublishedItem.title}.</span>
        )}
      </div>
    </li>
  );
}
