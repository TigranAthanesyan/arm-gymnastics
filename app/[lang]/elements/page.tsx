import Link from "next/link";
import { lang } from "next/root-params";
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
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="text-3xl font-bold text-brand-deep">
        {title || dict.nav.elements}
      </h1>
      {items.length === 0 && <p className="mt-6">{dict.elements.empty}</p>}
      {intro && <p className="mt-4 leading-relaxed">{intro}</p>}
      <ul className="mt-8 space-y-4">
        {items.map((item) => {
          const athleteName = profiles.get(item.athlete);
          return (
            <li
              key={item.id}
              className="border-l-4 border-highlight bg-surface p-4"
            >
              <h2 className="text-xl font-bold text-brand-deep">{item.name}</h2>
              <p className="mt-1 text-sm">
                {[labels.apparatus[item.apparatus], item.year]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className="mt-2 leading-relaxed">{item.text}</p>
              {athleteName && (
                <Link
                  href={`/${locale}/athletes/${item.athlete}/`}
                  className="mt-2 inline-block text-brand underline hover:text-accent-deep"
                >
                  {athleteName} →
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
