import Image from "next/image";
import Link from "next/link";
import { lang } from "next/root-params";
import { getDictionary, hasLocale, locales } from "@/app/[lang]/dictionaries";
import type { Dictionary } from "@/app/[lang]/dictionaries/en";
import { HeaderShell } from "./header-shell";
import { SiteNav, type NavItem } from "./site-nav";

// Add a page to the menu here: `path` is the route under /<lang>/, `label` comes from dict.nav.
const navItems = (dict: Dictionary): NavItem[] => [
  { path: "", label: dict.nav.home, mobileOnly: true },
  { path: "about", label: dict.nav.about },
  { path: "athletes", label: dict.nav.athletes },
  { path: "coaches", label: dict.nav.coaches },
  { path: "elements", label: dict.nav.elements },
  { path: "medals", label: dict.nav.medals },
];

export async function SiteHeader() {
  const [dict, locale] = await Promise.all([getDictionary(), lang()]);
  if (!hasLocale(locale)) return null;

  return (
    <HeaderShell>
      <div className="flex flex-wrap items-center justify-between gap-x-3 px-4 md:gap-x-6 py-2 md:grid md:grid-cols-[1fr_auto_1fr] md:py-3">
        <Link
          href={`/${locale}/`}
          aria-label={dict.meta.title}
          className="flex min-w-0 flex-1 items-center gap-3 justify-self-start md:flex-none"
        >
          <Image
            src="/images/brand/federation-logo-square.jpg"
            alt=""
            width={56}
            height={56}
            className="shrink-0 mix-blend-multiply"
          />
          {/* Wordmark: hidden on md only, where the centred menu leaves no room for it */}
          <span
            aria-hidden="true"
            className="text-xs leading-tight font-semibold text-brand-deep md:max-lg:hidden md:max-w-48 lg:text-sm"
          >
            {dict.meta.title}
          </span>
        </Link>
        <SiteNav
          locale={locale}
          locales={locales}
          items={navItems(dict)}
          labels={{ nav: dict.nav.label, menu: dict.nav.menu, close: dict.nav.close }}
          languages={dict.languages}
        />
      </div>
      {/* Tricolour edge, echoing the accent line in the page heroes */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[3px] bg-linear-to-r from-accent via-brand to-highlight"
      />
    </HeaderShell>
  );
}
