import Link from "next/link";
import { lang } from "next/root-params";
import { PageHeader } from "@/components/profile";
import { getAbout } from "@/lib/content";
import { getDictionary, locales } from "../dictionaries";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata() {
  const [{ cover }, dict] = await Promise.all([getAbout(), getDictionary()]);
  return { title: cover.title || dict.nav.about };
}

export default async function About() {
  const [{ cover, sections }, dict, locale] = await Promise.all([
    getAbout(),
    getDictionary(),
    lang(),
  ]);
  return (
    <main className="flex-1">
      <PageHeader title={cover.title || dict.nav.about} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {sections.length === 0 && <p>{dict.about.empty}</p>}
        <ol className="grid gap-4 md:grid-cols-2 md:gap-6">
          {sections.map((section, i) => (
            <li key={section.id}>
              <Link
                href={`/${locale}/about/${section.id}/`}
                className="group relative flex h-full items-center gap-5 overflow-hidden rounded-2xl bg-surface p-6 ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:bg-brand-deep hover:text-white hover:shadow-xl"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1.5 bg-linear-to-b from-highlight to-accent"
                />
                <span
                  aria-hidden="true"
                  className="text-4xl font-bold text-highlight tabular-nums"
                >
                  {i + 1}
                </span>
                <span className="flex-1 text-xl leading-snug font-bold text-brand-deep group-hover:text-white">
                  {section.title}
                </span>
                <span
                  aria-hidden="true"
                  className="text-highlight transition group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
