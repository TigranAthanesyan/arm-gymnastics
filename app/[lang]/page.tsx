import Image from "next/image";
import Link from "next/link";
import { lang } from "next/root-params";
import { getAllMedals, getAthletes } from "@/lib/athletes";
import { getAbout } from "@/lib/content";
import { getDictionary, hasLocale } from "./dictionaries";

const medalDot: Record<string, string> = {
  gold: "bg-[#d4a017]",
  silver: "bg-[#9aa0a6]",
  bronze: "bg-[#b0703c]",
};

export default async function Home() {
  const [dict, about, { labels }, locale] = await Promise.all([
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
        <div aria-hidden="true" className="absolute inset-0 bg-brand-deep/60" />
        <div className="relative mx-auto w-full max-w-5xl px-4 py-16">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">
              {dict.home.heading}
            </h1>
            {intro && intro.type === "paragraph" && (
              <>
                <p className="mt-4 max-w-3xl leading-relaxed">{intro.text}</p>
                <Link
                  href={`/${locale}/about/${about.sections[0].id}/`}
                  className="mt-3 inline-block font-bold underline hover:text-highlight"
                >
                  {dict.home.readMore}
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="bg-white">
        {medals.length > 0 && (
          <section className="mx-auto w-full max-w-5xl px-4 pt-10">
            <h2 className="mb-4 text-2xl font-bold text-brand-deep">
              {dict.home.medalsHeading}
            </h2>
            <dl className="grid grid-cols-3 gap-3 text-center">
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
          </section>
        )}
        <div className="h-10" />
      </div>

      {/* Transparent gap: the fixed photo shows through again. Put other content here later. */}
      <div aria-hidden="true" className="h-[70svh]" />

      <section className="bg-white">
        <div className="mx-auto w-full max-w-5xl px-4 py-10">
          <h2 className="mb-4 text-2xl font-bold text-brand-deep">
            {dict.home.explore}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {links.map(({ path, label }) => (
              <li key={path}>
                <Link
                  href={`/${locale}/${path}/`}
                  className="block rounded-lg border-l-4 border-accent bg-surface p-5 font-bold text-brand hover:text-accent-deep"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
