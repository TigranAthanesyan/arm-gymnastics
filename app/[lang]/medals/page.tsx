import Link from "next/link";
import { lang } from "next/root-params";
import {
  getAllMedals,
  getAllTitles,
  getAthletes,
} from "@/lib/athletes";
import { getDictionary, hasLocale, locales } from "../dictionaries";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata() {
  const dict = await getDictionary();
  return { title: dict.nav.medals };
}

const medalDot: Record<string, string> = {
  gold: "bg-[#d4a017]",
  silver: "bg-[#9aa0a6]",
  bronze: "bg-[#b0703c]",
};

export default async function Medals() {
  const [{ athletes, labels }, dict, locale] = await Promise.all([
    getAthletes(),
    getDictionary(),
    lang(),
  ]);
  if (!hasLocale(locale)) return null;

  const heading = (
    <h1 className="text-3xl font-bold text-brand-deep">{dict.nav.medals}</h1>
  );
  // Medal and competition labels exist per locale; without them the page has nothing to show.
  if (athletes.length === 0) {
    return (
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        {heading}
        <p className="mt-6">{dict.medals.empty}</p>
      </main>
    );
  }

  const medals = getAllMedals(locale);
  const titles = getAllTitles();
  const profiles = new Set(athletes.map((a) => a.slug));
  const nameOf = new Map(medals.map((m) => [m.athlete, m.athleteName]));
  const count = (medal: string) => medals.filter((m) => m.medal === medal).length;
  // Competitions in the order of labels.json (Olympics first).
  const competitions = Object.keys(labels.competitions).filter((c) =>
    medals.some((m) => m.competition === c),
  );

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      {heading}

      <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
        {["gold", "silver", "bronze"].map((medal) => (
          <div key={medal} className="rounded-lg bg-surface p-4">
            <dt className="flex items-center justify-center gap-2 text-sm">
              <span
                aria-hidden="true"
                className={`size-3 rounded-full ${medalDot[medal]}`}
              />
              {labels.medals[medal]}
            </dt>
            <dd className="text-3xl font-bold text-brand-deep">
              {count(medal)}
            </dd>
          </div>
        ))}
      </dl>

      {titles.length > 0 && (
        <ul className="mt-6 space-y-1">
          {titles.map(({ athlete, title, years }) => (
            <li key={`${athlete}-${title}`} className="font-bold">
              {labels.titles[title]}: {nameOf.get(athlete)} ({years.join(", ")})
            </li>
          ))}
        </ul>
      )}

      {competitions.map((competition) => {
        const rows = medals.filter((m) => m.competition === competition);
        return (
          <section key={competition} className="mt-10">
            <h2 className="mb-3 text-2xl font-bold text-brand-deep">
              {labels.competitions[competition]}{" "}
              <span className="text-base font-normal">({rows.length})</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-xl border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-brand">
                    <th className="py-2 pr-3">{dict.athletes.year}</th>
                    <th className="py-2 pr-3">{dict.medals.athlete}</th>
                    <th className="py-2 pr-3">{dict.athletes.apparatus}</th>
                    <th className="py-2 pr-3">{dict.athletes.place}</th>
                    <th className="py-2">{dict.athletes.medal}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((m, i) => (
                    <tr key={i} className="border-b border-surface">
                      <td className="py-2 pr-3">{m.year}</td>
                      <td className="py-2 pr-3">
                        {profiles.has(m.athlete) ? (
                          <Link
                            href={`/${locale}/athletes/${m.athlete}/`}
                            className="text-brand underline hover:text-accent-deep"
                          >
                            {m.athleteName}
                          </Link>
                        ) : (
                          m.athleteName
                        )}
                      </td>
                      <td className="py-2 pr-3">
                        {labels.apparatus[m.apparatus]}
                      </td>
                      <td className="py-2 pr-3">{m.place}</td>
                      <td className="py-2">
                        <span className="inline-flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className={`size-3 rounded-full ${medalDot[m.medal]}`}
                          />
                          {labels.medals[m.medal]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </main>
  );
}
