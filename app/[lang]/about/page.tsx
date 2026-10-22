import Link from "next/link";
import { lang } from "next/root-params";
import { aboutLocales, getAbout } from "@/lib/content";
import { getDictionary } from "../dictionaries";

export function generateStaticParams() {
  return aboutLocales.map((lang) => ({ lang }));
}

export async function generateMetadata() {
  const { cover } = await getAbout();
  return { title: cover.title };
}

export default async function About() {
  const [{ cover, sections }, dict, locale] = await Promise.all([
    getAbout(),
    getDictionary(),
    lang(),
  ]);
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-brand-deep">{cover.title}</h1>
      <h2 className="mt-8 mb-3 text-xl font-bold">{dict.about.sections}</h2>
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
