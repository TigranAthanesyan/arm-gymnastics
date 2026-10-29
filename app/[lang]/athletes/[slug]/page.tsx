import Link from "next/link";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { Blocks } from "@/components/blocks";
import { getAthletes, getMedals, getTitles } from "@/lib/athletes";
import { defaultLocale, getDictionary, locales } from "../../dictionaries";

// Slugs are language-neutral, so every locale gets the default locale's slugs;
// a locale without content renders the "not available" note instead of 404.
export async function generateStaticParams() {
  const { athletes } = await getAthletes(defaultLocale);
  return locales.flatMap((lang) =>
    athletes.map(({ slug }) => ({ lang, slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/athletes/[slug]">) {
  const { slug } = await params;
  const { athletes } = await getAthletes();
  return { title: athletes.find((a) => a.slug === slug)?.name };
}

const year = (date: string) => date.slice(0, 4);

export default async function Athlete({
  params,
}: PageProps<"/[lang]/athletes/[slug]">) {
  const { slug } = await params;
  const [{ athletes, labels }, dict, locale] = await Promise.all([
    getAthletes(),
    getDictionary(),
    lang(),
  ]);

  const link = "text-brand underline hover:text-accent-deep";
  const back = (
    <Link href={`/${locale}/athletes/`} className={link}>
      ← {dict.athletes.all}
    </Link>
  );

  if (athletes.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        {back}
        <p className="mt-6">{dict.athletes.empty}</p>
      </main>
    );
  }

  const index = athletes.findIndex((a) => a.slug === slug);
  if (index === -1) notFound();
  const athlete = athletes[index];
  const previous = athletes[index - 1];
  const next = athletes[index + 1];
  const medals = getMedals(slug, locale);
  const titles = getTitles(slug);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10">
      {back}
      <h1 className="mt-4 text-3xl font-bold text-brand-deep">
        {athlete.name}
      </h1>
      <p className="mt-1 mb-6 text-sm">
        {[
          athlete.born && athlete.died
            ? `${year(athlete.born)}–${year(athlete.died)}`
            : athlete.born
              ? `${dict.athletes.born} ${year(athlete.born)}`
              : athlete.died
                ? `† ${year(athlete.died)}`
                : null,
          athlete.specialty.map((s) => labels.apparatus[s]).join(", "),
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>
      <Blocks blocks={athlete.blocks} lang={locale} />

      {(medals.length > 0 || titles.length > 0) && (
        <section className="mt-10">
          <h2 className="mb-3 text-2xl font-bold text-brand-deep">
            {dict.athletes.achievements}
          </h2>
          {titles.length > 0 && (
            <ul className="mb-4 space-y-1">
              {titles.map(({ title, years }) => (
                <li key={title} className="font-bold">
                  {labels.titles[title]}: {years.join(", ")}
                </li>
              ))}
            </ul>
          )}
          {medals.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-xl border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-brand">
                    <th className="py-2 pr-3">{dict.athletes.year}</th>
                    <th className="py-2 pr-3">{dict.athletes.competition}</th>
                    <th className="py-2 pr-3">{dict.athletes.place}</th>
                    <th className="py-2 pr-3">{dict.athletes.apparatus}</th>
                    <th className="py-2">{dict.athletes.medal}</th>
                  </tr>
                </thead>
                <tbody>
                  {medals.map((m, i) => (
                    <tr key={i} className="border-b border-surface">
                      <td className="py-2 pr-3">{m.year}</td>
                      <td className="py-2 pr-3">
                        {labels.competitions[m.competition]}
                      </td>
                      <td className="py-2 pr-3">{m.place}</td>
                      <td className="py-2 pr-3">
                        {labels.apparatus[m.apparatus]}
                      </td>
                      <td className="py-2">{labels.medals[m.medal]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <div className="min-h-12 flex-1" />
      <nav className="mt-auto flex justify-between gap-4 border-t border-surface pt-4">
        {previous ? (
          <Link href={`/${locale}/athletes/${previous.slug}/`} className={link}>
            ← {dict.athletes.previous}: {previous.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/${locale}/athletes/${next.slug}/`}
            className={`${link} text-right`}
          >
            {dict.athletes.next}: {next.name} →
          </Link>
        )}
      </nav>
    </main>
  );
}
