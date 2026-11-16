import { lang } from "next/root-params";
import { PageHeader, ProfileCard } from "@/components/profile";
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
    <main className="flex-1">
      <PageHeader title={dict.nav.athletes} />
      <div className="mx-auto max-w-6xl px-4 pb-16">
        {athletes.length === 0 && (
          <p className="mt-10">{dict.athletes.empty}</p>
        )}
        {categories.map((category, index) => (
          <section key={category} className="mt-12">
            <h2 className="mb-6 flex items-center gap-4 text-2xl font-bold text-brand-deep md:text-3xl">
              {labels.categories[category]}
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-linear-to-r from-brand/40 to-transparent"
              />
            </h2>
            <ul
              className={
                index === 0
                  ? "grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6"
                  : "grid grid-cols-2 gap-4 md:grid-cols-4"
              }
            >
              {athletes
                .filter((a) => a.category === category)
                .map((athlete) => (
                  <li key={athlete.slug}>
                    <ProfileCard
                      featured={index === 0}
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
          </section>
        ))}
      </div>
    </main>
  );
}
