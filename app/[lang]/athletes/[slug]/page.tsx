import Link from "next/link";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { Blocks } from "@/components/blocks";
import { medalDot } from "@/components/medal-tiles";
import { ProfileHero, ProfileNav } from "@/components/profile";
import { getImage } from "@/lib/content";
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

  const portraitId = athlete.images[0];
  const portrait = portraitId ? getImage(portraitId, locale) : null;
  const blocks = athlete.blocks.filter(
    (b) => !(b.type === "image" && b.ref === portraitId),
  );
  const lifespan =
    athlete.born && athlete.died
      ? `${year(athlete.born)}–${year(athlete.died)}`
      : athlete.born
        ? `${dict.athletes.born} ${year(athlete.born)}`
        : athlete.died
          ? `† ${year(athlete.died)}`
          : null;
  const count = (medal: string) =>
    medals.filter((m) => m.medal === medal).length;
  const hasAchievements = medals.length > 0 || titles.length > 0;

  return (
    <main className="flex-1">
      <ProfileHero
        backHref={`/${locale}/athletes/`}
        backLabel={dict.athletes.all}
        name={athlete.name}
        chips={[
          ...(lifespan ? [lifespan] : []),
          ...athlete.specialty.map((s) => labels.apparatus[s]),
        ]}
        portrait={portrait}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div
          className={
            hasAchievements
              ? "grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14"
              : "mx-auto max-w-3xl"
          }
        >
          <article>
            <Blocks blocks={blocks} lang={locale} lede />
          </article>

          {hasAchievements && (
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl bg-night p-6 text-white shadow-xl">
                <h2 className="text-lg font-bold">
                  {dict.athletes.achievements}
                </h2>
                {medals.length > 0 && (
                  <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {["gold", "silver", "bronze"].map((medal) => (
                      <div
                        key={medal}
                        className="rounded-xl bg-white/10 px-1 py-3"
                      >
                        <dd className="text-3xl font-bold">{count(medal)}</dd>
                        <dt className="mt-1 flex items-center justify-center gap-1.5 text-xs text-white/80">
                          <span
                            aria-hidden="true"
                            className={`size-2.5 rounded-full ${medalDot[medal]}`}
                          />
                          {labels.medals[medal]}
                        </dt>
                      </div>
                    ))}
                  </dl>
                )}
                {titles.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {titles.map(({ title, years }) => (
                      <li
                        key={title}
                        className="rounded-xl bg-linear-to-r from-highlight/90 to-accent/90 px-4 py-3 text-sm leading-snug font-bold"
                      >
                        {labels.titles[title]}
                        <span className="block font-normal text-white/90">
                          {years.join(", ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          )}
        </div>

        {medals.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-3xl font-bold text-brand-deep">
              {dict.athletes.achievements}
            </h2>
            <div className="overflow-x-auto rounded-2xl ring-1 ring-black/10">
              <table className="w-full min-w-xl border-collapse text-left">
                <thead className="bg-brand-deep text-sm text-white">
                  <tr>
                    <th className="px-4 py-3">{dict.athletes.year}</th>
                    <th className="px-4 py-3">{dict.athletes.competition}</th>
                    <th className="px-4 py-3">{dict.athletes.place}</th>
                    <th className="px-4 py-3">{dict.athletes.apparatus}</th>
                    <th className="px-4 py-3">{dict.athletes.medal}</th>
                  </tr>
                </thead>
                <tbody>
                  {medals.map((m, i) => (
                    <tr
                      key={i}
                      className="border-b border-surface last:border-0 even:bg-surface/60"
                    >
                      <td className="px-4 py-3 font-bold text-brand-deep">
                        {m.year}
                      </td>
                      <td className="px-4 py-3">
                        {labels.competitions[m.competition]}
                      </td>
                      <td className="px-4 py-3">{m.place}</td>
                      <td className="px-4 py-3">
                        {labels.apparatus[m.apparatus]}
                      </td>
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
        )}

        <ProfileNav
          previous={
            previous && {
              href: `/${locale}/athletes/${previous.slug}/`,
              name: previous.name,
              image: previous.images[0] ? getImage(previous.images[0], locale) : null,
            }
          }
          next={
            next && {
              href: `/${locale}/athletes/${next.slug}/`,
              name: next.name,
              image: next.images[0] ? getImage(next.images[0], locale) : null,
            }
          }
          previousLabel={dict.athletes.previous}
          nextLabel={dict.athletes.next}
        />
      </div>
    </main>
  );
}
