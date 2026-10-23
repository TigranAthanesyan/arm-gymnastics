import Image from "next/image";
import Link from "next/link";
import { lang } from "next/root-params";
import { getDictionary, hasLocale, locales } from "@/app/[lang]/dictionaries";
import { SiteNav } from "./site-nav";

export async function SiteHeader() {
  const [dict, locale] = await Promise.all([getDictionary(), lang()]);
  if (!hasLocale(locale)) return null;

  return (
    <header className="relative z-20 border-b border-surface bg-white md:sticky md:top-0">
      <div className="flex flex-wrap items-center justify-between gap-x-6 px-4 py-2 md:grid md:grid-cols-[1fr_auto_1fr] md:py-3">
        <Link
          href={`/${locale}/`}
          aria-label={dict.meta.title}
          className="flex items-center gap-3"
        >
          <Image
            src="/images/brand/armenian-gymnastics-federation-logo.png"
            alt=""
            width={48}
            height={48}
          />
          <span className="hidden font-bold text-brand-deep md:inline">
            {dict.meta.title}
          </span>
        </Link>
        <SiteNav
          locale={locale}
          locales={locales}
          labels={{
            nav: dict.nav.label,
            menu: dict.nav.menu,
            about: dict.nav.about,
          }}
          languages={dict.languages}
        />
      </div>
    </header>
  );
}
