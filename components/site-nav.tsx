"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/app/[lang]/dictionaries";
import { LanguageSwitcher } from "./language-switcher";

type Props = {
  locale: Locale;
  locales: Locale[];
  labels: { nav: string; menu: string; about: string };
  languages: Record<Locale, string>;
};

// Inline on md and up. On phones it collapses behind a burger button and opens as a card
// at the top right over a dimmed page; tapping the dimmed area closes it.
export function SiteNav({ locale, locales, labels, languages }: Props) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={labels.menu}
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((value) => !value)}
        className="-mr-2 rounded p-2 text-brand-deep md:hidden"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      {open && (
        <div
          aria-hidden="true"
          onClick={close}
          className="fixed inset-0 z-10 bg-ink/50 md:hidden"
        />
      )}
      <nav
        id="site-nav"
        aria-label={labels.nav}
        className={`${open ? "flex" : "hidden"} fixed top-3 right-3 z-20 w-64 max-w-[calc(100vw-1.5rem)] flex-col items-end gap-4 rounded-2xl bg-white p-5 opacity-90 shadow-xl backdrop-blur-md md:contents`}
      >
        <ul className="flex flex-col items-end gap-4 md:flex-row">
          <li>
            <Link
              href={`/${locale}/about/`}
              onClick={close}
              className="block py-1 text-brand hover:text-accent-deep"
            >
              {labels.about}
            </Link>
          </li>
        </ul>
        <LanguageSwitcher
          current={locale}
          locales={locales}
          labels={languages}
          onNavigate={close}
        />
      </nav>
    </>
  );
}
