import Image from "next/image";
import Link from "next/link";
import { lang } from "next/root-params";
import { getDictionary, hasLocale, locales } from "@/app/[lang]/dictionaries";
import type { Dictionary } from "@/app/[lang]/dictionaries/en";
import { SiteNav, type NavItem } from "./site-nav";

// Add a page to the menu here: `path` is the route under /<lang>/, `label` comes from dict.nav.
const navItems = (dict: Dictionary): NavItem[] => [
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
    <header className="relative z-20 bg-header shadow-md md:sticky md:top-0">
      <div className="flex flex-wrap items-center justify-between gap-x-6 px-4 py-2 md:grid md:grid-cols-[1fr_auto_1fr] md:py-3">
        <Link
          href={`/${locale}/`}
          aria-label={dict.meta.title}
          className="justify-self-start"
        >
          <Image
            src="/images/brand/federation-logo-square.jpg"
            alt=""
            width={56}
            height={56}
            className="mix-blend-multiply"
          />
        </Link>
        <SiteNav
          locale={locale}
          locales={locales}
          items={navItems(dict)}
          labels={{ nav: dict.nav.label, menu: dict.nav.menu }}
          languages={dict.languages}
        />
      </div>
    </header>
  );
}
