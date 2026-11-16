import Link from "next/link";
import { lang } from "next/root-params";
import { PageHeader } from "@/components/profile";
import { getAthletes } from "@/lib/athletes";
import { getElements } from "@/lib/elements";
import { getDictionary, locales } from "../dictionaries";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata() {
  const [{ title }, dict] = await Promise.all([getElements(), getDictionary()]);
  return { title: title || dict.nav.elements };
}

export default async function Elements() {
  const [{ title, intro, items }, { athletes, labels }, dict, locale] =
    await Promise.all([getElements(), getAthletes(), getDictionary(), lang()]);

  // Only athletes with a bio have a profile page to link to.
  const profiles = new Map(athletes.map((a) => [a.slug, a.name]));

  return (
    <main className="flex-1">
      <PageHeader title={title || dict.nav.elements} intro={intro || undefined} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {items.length === 0 && <p>{dict.elements.empty}</p>}
        <ul className="grid gap-6 md:grid-cols-2">
          {items.map((item) => {
            const athleteName = profiles.get(item.athlete);
            return (
              <li
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface p-6 ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl md:p-8"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-accent via-brand to-highlight"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-deep px-3 py-1 text-sm text-white">
                    {labels.apparatus[item.apparatus]}
                  </span>
                  {item.year && (
                    <span className="text-2xl font-bold text-highlight">
                      {item.year}
                    </span>
                  )}
                </div>
                <h2 className="mt-4 text-2xl font-bold text-brand-deep">
                  {item.name}
                </h2>
                <p className="mt-3 flex-1 text-lg leading-relaxed">
                  {item.text}
                </p>
                {athleteName && (
                  <Link
                    href={`/${locale}/athletes/${item.athlete}/`}
                    className="mt-5 inline-flex items-center gap-2 self-start rounded-full bg-white px-4 py-2 font-bold text-brand ring-1 ring-black/10 transition hover:bg-brand hover:text-white"
                  >
                    {athleteName} →
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
