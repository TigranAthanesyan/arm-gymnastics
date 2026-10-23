"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/app/[lang]/dictionaries";

// Keeps the current page and swaps only the locale prefix (/hy/about/ -> /en/about/).
export function LanguageSwitcher({
  current,
  locales,
  labels,
  onNavigate,
}: {
  current: Locale;
  locales: Locale[];
  labels: Record<Locale, string>;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/[^/]+/, "") || "/";

  return (
    <ul className="flex gap-4 md:justify-self-end">
      {locales.map((locale) => (
        <li key={locale}>
          <Link
            href={`/${locale}${rest}`}
            onClick={onNavigate}
            hrefLang={locale}
            lang={locale}
            aria-current={locale === current ? "true" : undefined}
            className={
              locale === current
                ? "font-bold text-brand-deep"
                : "text-brand underline hover:text-accent-deep"
            }
          >
            {labels[locale]}
          </Link>
        </li>
      ))}
    </ul>
  );
}
