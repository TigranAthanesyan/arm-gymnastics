import Image from "next/image";
import Link from "next/link";
import { lang } from "next/root-params";
import { getAthletes } from "@/lib/athletes";
import { getImage } from "@/lib/content";
import { getDictionary, locales } from "../dictionaries";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata() {
  const dict = await getDictionary();
  return { title: dict.nav.athletes };
}

export default async function Athletes() {
  const [{ athletes, labels }, dict, locale] = await Promise.all([
    getAthletes(),
    getDictionary(),
    lang(),
  ]);

  // Group in the order categories first appear in the source (legends, then independent Armenia).
  const categories = [...new Set(athletes.map((a) => a.category))];

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <h1 className="text-3xl font-bold text-brand-deep">
        {dict.nav.athletes}
      </h1>
      {athletes.length === 0 && <p className="mt-6">{dict.athletes.empty}</p>}
      {categories.map((category) => (
        <section key={category} className="mt-10">
          <h2 className="mb-4 text-2xl font-bold">
            {labels.categories[category]}
          </h2>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {athletes
              .filter((a) => a.category === category)
              .map((athlete) => {
                const portrait = athlete.images[0]
                  ? getImage(athlete.images[0], locale)
                  : null;
                return (
                  <li key={athlete.slug}>
                    <Link
                      href={`/${locale}/athletes/${athlete.slug}/`}
                      className="group block overflow-hidden rounded-lg bg-surface"
                    >
                      {portrait && (
                        <Image
                          src={portrait.src}
                          width={portrait.width}
                          height={portrait.height}
                          alt={portrait.alt}
                          className="aspect-3/4 w-full object-cover object-top"
                        />
                      )}
                      <span className="block p-3">
                        <span className="block font-bold text-brand group-hover:text-accent-deep">
                          {athlete.name}
                        </span>
                        <span className="block text-sm">
                          {athlete.specialty
                            .map((s) => labels.apparatus[s])
                            .join(", ")}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </main>
  );
}
