import { Fragment, ReactNode, createElement } from "react";

/**
 * Formats a list of authors into a string with proper separators and bolds André's name.
 * @param authors List of authors to string together
 * @returns A ReactNode containing the formatted authors
 */
export function formatAuthors(authors: readonly string[]): ReactNode {
  return authors.map((author, index) => {
    const name =
      author === "André Batchelder-Schwab"
        ? createElement("b", null, author)
        : author;

    const separator = index === 0 ? null : index === authors.length - 1 ? ", & " : ", ";

    return createElement(
      Fragment,
      { key: `${author}-${index}` },
      separator,
      name,
    );
  });
}
