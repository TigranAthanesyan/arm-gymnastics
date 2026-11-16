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
    <ul className="flex gap-2 md:justify-self-end">
      {locales.map((locale) => {
        const selected = locale === current;
        return (
          <li key={locale}>
            <Link
              href={`/${locale}${rest}`}
              onClick={onNavigate}
              hrefLang={locale}
              lang={locale}
              aria-current={selected ? "true" : undefined}
              title={labels[locale]}
              className={`flex min-h-10 items-center gap-2 rounded-full border px-3 text-sm transition-colors ${
                selected
                  ? "border-brand-deep bg-brand/10 font-semibold text-brand-deep"
                  : "border-brand-deep/20 text-brand hover:border-brand hover:bg-brand/5 active:bg-brand/10"
              }`}
            >
              <Image
                src={`/images/flags/${locale}.svg`}
                alt=""
                width={20}
                height={20}
                className="size-5 rounded-full object-cover"
              />
              {/* Name hidden between md and xl, where the header has room for flags only */}
              <span className="md:max-xl:sr-only">{labels[locale]}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
