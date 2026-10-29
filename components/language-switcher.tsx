"use client";

import Image from "next/image";
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
    <ul className="flex gap-3 md:justify-self-end">
      {locales.map((locale) => (
        <li key={locale}>
          <Link
            href={`/${locale}${rest}`}
            onClick={onNavigate}
            hrefLang={locale}
            lang={locale}
            aria-current={locale === current ? "true" : undefined}
            aria-label={labels[locale]}
            title={labels[locale]}
            className={`block size-8 overflow-hidden rounded-full ring-2 ring-offset-2 transition-opacity ${
              locale === current
                ? "ring-brand-deep"
                : "opacity-50 ring-transparent hover:opacity-100"
            }`}
          >
            <Image
              src={`/images/flags/${locale}.svg`}
              alt=""
              width={32}
              height={32}
              className="size-full object-cover"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
