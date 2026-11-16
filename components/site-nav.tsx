"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/app/[lang]/dictionaries";
import { LanguageSwitcher } from "./language-switcher";

// `path` is the route under /<lang>/ ("" is the home page). `mobileOnly` items appear only in the
// phone menu card, not in the desktop bar.
export type NavItem = { path: string; label: string; mobileOnly?: boolean };

type Props = {
  locale: Locale;
  locales: Locale[];
  items: NavItem[];
  labels: { nav: string; menu: string; close: string };
  languages: Record<Locale, string>;
};

// Inline on md and up. On phones it collapses behind a burger button and opens as a card
// at the top right over a dimmed page; tapping the dimmed area closes it.
export function SiteNav({ locale, locales, items, labels, languages }: Props) {
  // The menu is tied to the page it was opened on, so any navigation (links, browser back)
  // closes it without an effect.
  const pathname = usePathname();
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const close = () => setOpenedAt(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenedAt(null);
    };
    document.addEventListener("keydown", onKeyDown);
    // Close if the window grows to the desktop layout, where the card does not exist.
    const desktop = window.matchMedia("(min-width: 768px)");
    const onChange = () => desktop.matches && setOpenedAt(null);
    desktop.addEventListener("change", onChange);
    // Stop the page scrolling behind the dimmed overlay.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onChange);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Focus moves into the menu when it opens and back to the burger when it closes.
  useEffect(() => {
    if (open) closeRef.current?.focus();
    else if (wasOpen.current) burgerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <button
        ref={burgerRef}
        type="button"
        aria-label={labels.menu}
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpenedAt(open ? null : pathname)}
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
          className="fade-in fixed inset-0 z-10 bg-ink/50 md:hidden"
        />
      )}
      <nav
        id="site-nav"
        aria-label={labels.nav}
        className={`${open ? "menu-in flex" : "hidden"} fixed top-3 right-3 z-20 w-72 max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl bg-white pb-4 shadow-xl md:contents`}
      >
        {/* Mobile card only: tricolour top edge and close button */}
        <div
          aria-hidden="true"
          className="h-1 w-full bg-linear-to-r from-accent via-brand to-highlight md:hidden"
        />
        <button
          ref={closeRef}
          type="button"
          aria-label={labels.close}
          onClick={close}
          className="mt-2 mr-3 self-end rounded p-2 text-brand-deep md:hidden"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <ul className="flex flex-col px-3 md:flex-row md:gap-4 md:px-0">
          {items.map(({ path, label, mobileOnly }) => {
            const home = `/${locale}`;
            const href = path ? `${home}/${path}` : home;
            // Home matches only itself; the others also match nested pages,
            // e.g. /hy/athletes/some-athlete.
            const active = path
              ? pathname === href || pathname.startsWith(`${href}/`)
              : pathname === home || pathname === `${home}/`;
            return (
              <li
                key={path}
                className={`border-b border-brand-deep/10 last:border-b-0 md:border-b-0 ${mobileOnly ? "md:hidden" : ""}`}
              >
                <Link
                  href={`${href}/`}
                  onClick={close}
                  aria-current={active ? "page" : undefined}
                  className={`block py-3 transition-colors max-md:rounded-lg max-md:px-3 md:border-b-2 md:py-1 ${
                    active
                      ? "font-semibold text-brand-deep max-md:bg-brand/10 md:border-accent-deep"
                      : "text-brand hover:text-accent-deep md:border-transparent"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mx-3 flex justify-start border-t border-brand-deep/10 px-3 pt-4 md:contents">
          <LanguageSwitcher
            current={locale}
            locales={locales}
            labels={languages}
            onNavigate={close}
          />
        </div>
      </nav>
    </>
  );
}
