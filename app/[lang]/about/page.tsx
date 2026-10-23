import Link from "next/link";
import { lang } from "next/root-params";
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
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="text-3xl font-bold text-brand-deep">
        {cover.title || dict.nav.about}
      </h1>
      {sections.length === 0 && <p className="mt-6">{dict.about.empty}</p>}
      {sections.length > 0 && (
        <h2 className="mt-8 mb-3 text-xl font-bold">{dict.about.sections}</h2>
      )}
      <ol className="list-decimal space-y-2 pl-6">
        {sections.map((section) => (
          <li key={section.id}>
            <Link
              href={`/${locale}/about/${section.id}/`}
              className="text-brand underline hover:text-accent-deep"
            >
              {section.title}
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
