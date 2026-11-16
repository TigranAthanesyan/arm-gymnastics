import Link from "next/link";
import { lang } from "next/root-params";
import {
  getAllMedals,
  getAllTitles,
  getAthletes,
} from "@/lib/athletes";
import { MedalTiles, medalDot } from "@/components/medal-tiles";
import { PageHeader } from "@/components/profile";
import { getDictionary, hasLocale, locales } from "../dictionaries";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata() {
  const dict = await getDictionary();
  return { title: dict.nav.medals };
}

export default async function Medals() {
  const [{ athletes, labels }, dict, locale] = await Promise.all([
    getAthletes(),
    getDictionary(),
    lang(),
  ]);
  if (!hasLocale(locale)) return null;

  // Medal and competition labels exist per locale; without them the page has nothing to show.
  if (athletes.length === 0) {
    return (
      <main className="flex-1">
        <PageHeader title={dict.nav.medals} />
        <p className="mx-auto max-w-6xl px-4 py-12">{dict.medals.empty}</p>
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
    <main className="flex-1">
      <PageHeader title={dict.nav.medals}>
        <MedalTiles
          counts={{
            gold: count("gold"),
            silver: count("silver"),
            bronze: count("bronze"),
          }}
          labels={labels.medals}
        />
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 pb-16">
        {titles.length > 0 && (
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {titles.map(({ athlete, title, years }) => (
              <li
                key={`${athlete}-${title}`}
                className="rounded-2xl bg-linear-to-r from-highlight to-accent p-5 font-bold text-white shadow-lg"
              >
                {labels.titles[title]}
                <span className="mt-1 block text-lg">
                  {nameOf.get(athlete)}{" "}
                  <span className="font-normal">({years.join(", ")})</span>
                </span>
              </li>
            ))}
          </ul>
        )}

        {competitions.map((competition) => {
          const rows = medals.filter((m) => m.competition === competition);
          return (
            <section key={competition} className="mt-14">
              <h2 className="mb-5 flex items-baseline gap-3 text-2xl font-bold text-brand-deep md:text-3xl">
                {labels.competitions[competition]}
                <span className="rounded-full bg-surface px-3 py-0.5 text-base font-normal">
                  {rows.length}
                </span>
              </h2>
              <div className="overflow-x-auto rounded-2xl ring-1 ring-black/10">
                <table className="w-full min-w-xl border-collapse text-left">
                  <thead className="bg-brand-deep text-sm text-white">
                    <tr>
                      <th className="px-4 py-3">{dict.athletes.year}</th>
                      <th className="px-4 py-3">{dict.medals.athlete}</th>
                      <th className="px-4 py-3">{dict.athletes.apparatus}</th>
                      <th className="px-4 py-3">{dict.athletes.place}</th>
                      <th className="px-4 py-3">{dict.athletes.medal}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((m, i) => (
                      <tr
                        key={i}
                        className="border-b border-surface last:border-0 even:bg-surface/60"
                      >
                        <td className="px-4 py-3 font-bold text-brand-deep">
                          {m.year}
                        </td>
                        <td className="px-4 py-3">
                          {profiles.has(m.athlete) ? (
                            <Link
                              href={`/${locale}/athletes/${m.athlete}/`}
                              className="font-bold text-brand underline-offset-4 hover:text-accent-deep hover:underline"
                            >
                              {m.athleteName}
                            </Link>
                          ) : (
                            m.athleteName
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {labels.apparatus[m.apparatus]}
                        </td>
                        <td className="px-4 py-3">{m.place}</td>
                        <td className="px-4 py-3">
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
      </div>
    </main>
  );
}
