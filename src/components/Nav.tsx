"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "home", id: "home_button" },
  { href: "/languages", label: "languages", id: "langs_button" },
  { href: "/research", label: "research", id: "research_button" },
  { href: "/unpublished", label: "unpublished", id: "unpubs_button" },
  { href: "/vowelchart", label: "vowelchArt", id: "vowels_button" },
];

export function Nav() {
  const pathname = usePathname();

  // These state and effect hooks are to ensure that the navigation links are disabled while a route change is pending.
  // This avoids undesirable UI/UX where the user clicks a nav link, it goes from its "active" state back to its "hover"
  // state, but then quickly switches to its "inactive" state, creating a stuttering effect.
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  useEffect(() => {
    // Reset the pending state once navigation completes and pathname changes
    setPendingHref(null);
  }, [pathname]);

  return (
    <nav>
      <ul className="px-8 lg:px-0 flex flex-wrap justify-center gap-x-8 gap-y-4">
        {NAV_ITEMS.map(({ href, label, id }) => {
          const isCurrentRoute =
            href === "/" ? pathname === "/" : pathname.includes(href.slice(1));

          const isDisabled = isCurrentRoute || pendingHref === href;

          return (
            <Link
              key={href}
              href={href}
              id={id}
              onClick={() => setPendingHref(href)}
              className={`group ${
                isDisabled ? "pointer-events-none underline underline-offset-8" : ""
              }`}
            >
              <p className="group-hover:-translate-y-1 group-hover:text-shadow-lg/10 group-active:translate-y-0 group-active:text-shadow-xs/10 duration-200">
                {label}
              </p>
            </Link>
          );
        })}
      </ul>
    </nav>
  );
}