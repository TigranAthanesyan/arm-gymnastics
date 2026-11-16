import Image from "next/image";
import Link from "next/link";
import { lang } from "next/root-params";
import { MedalTiles } from "@/components/medal-tiles";
import { ProfileCard } from "@/components/profile";
import { getAllMedals, getAthletes } from "@/lib/athletes";
import { getAbout, getImage } from "@/lib/content";
import { getDictionary, hasLocale } from "./dictionaries";

export default async function Home() {
  const [dict, about, { athletes, labels }, locale] = await Promise.all([
    getDictionary(),
    getAbout(),
    getAthletes(),
    lang(),
  ]);
  if (!hasLocale(locale)) return null;

  // The intro is the opening paragraph of the first About section; empty for locales without content.
  const intro = about.sections[0]?.blocks?.find((b) => b.type === "paragraph");
  const medals = getAllMedals(locale);
  const count = (medal: string) =>
    medals.filter((m) => m.medal === medal).length;
  // Featured: the first category in the source (the legends).
  const featuredCategory = athletes[0]?.category;
  const featured = athletes.filter((a) => a.category === featuredCategory);
  const links = [
    { path: "about", label: dict.nav.about },
    { path: "athletes", label: dict.nav.athletes },
    { path: "coaches", label: dict.nav.coaches },
    { path: "elements", label: dict.nav.elements },
    { path: "medals", label: dict.nav.medals },
  ];

  return (
    <main className="flex-1">
      {/* Fixed behind everything: the sections below scroll over it, transparent ones reveal it */}
      <Image
        src="/images/arthur_davtyan_olympic.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="fixed! -z-10 object-cover"
      />

      <section className="relative flex min-h-[calc(100svh-4.5rem)] items-center text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-night/95 via-night/70 to-night/10"
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-12">
          <span
            aria-hidden="true"
            className="rise mb-6 block h-1 w-20 bg-linear-to-r from-accent via-brand to-highlight"
          />
          <h1 className="rise max-w-2xl text-[1.7rem] leading-tight font-bold wrap-break-word sm:text-4xl md:text-5xl">
            {dict.home.heading}
          </h1>
          {intro && intro.type === "paragraph" && (
            <>
              <p className="rise mt-5 line-clamp-4 max-w-xl text-lg leading-relaxed text-white/85">
                {intro.text}
              </p>
              <Link
                href={`/${locale}/about/${about.sections[0].id}/`}
                className="rise mt-6 inline-block rounded-full bg-highlight px-7 py-3 font-bold text-night transition hover:bg-white"
              >
                {dict.home.readMore} →
              </Link>
            </>
          )}
          {medals.length > 0 && (
            <div className="rise mt-10">
              <h2 className="mb-3 text-sm font-bold tracking-wide text-white/70 uppercase">
                {dict.home.medalsHeading}
              </h2>
              <MedalTiles
                counts={{
                  gold: count("gold"),
                  silver: count("silver"),
                  bronze: count("bronze"),
                }}
                labels={labels.medals}
              />
            </div>
          )}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="bg-night/90 text-white backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-3xl font-bold">
                {labels.categories[featuredCategory]}
              </h2>
              <Link
                href={`/${locale}/athletes/`}
                className="font-bold text-highlight hover:text-white"
              >
                {dict.nav.athletes} →
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {featured.map((athlete) => (
                <li key={athlete.slug}>
                  <ProfileCard
                    href={`/${locale}/athletes/${athlete.slug}/`}
                    name={athlete.name}
                    subtitle={athlete.specialty
                      .map((s) => labels.apparatus[s])
                      .join(", ")}
                    portrait={
                      athlete.images[0]
                        ? getImage(athlete.images[0], locale)
                        : null
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-8 text-3xl font-bold text-brand-deep">
            {dict.home.explore}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {links.map(({ path, label }) => (
              <li key={path}>
                <Link
                  href={`/${locale}/${path}/`}
                  className="group relative flex items-center justify-between overflow-hidden rounded-2xl bg-surface p-6 text-xl font-bold text-brand-deep ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:bg-brand-deep hover:text-white hover:shadow-xl"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-accent via-brand to-highlight"
                  />
                  {label}
                  <span
                    aria-hidden="true"
                    className="text-highlight transition group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
