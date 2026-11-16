import { lang } from "next/root-params";
import { PageHeader, ProfileCard } from "@/components/profile";
import { getImage } from "@/lib/content";
import { getCoaches } from "@/lib/coaches";
import { getDictionary, locales } from "../dictionaries";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata() {
  const dict = await getDictionary();
  return { title: dict.nav.coaches };
}

export default async function Coaches() {
  const [coaches, dict, locale] = await Promise.all([
    getCoaches(),
    getDictionary(),
    lang(),
  ]);

  return (
    <main className="flex-1">
      <PageHeader title={dict.nav.coaches} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {coaches.length === 0 && <p>{dict.coaches.empty}</p>}
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {coaches.map((coach) => (
            <li key={coach.slug}>
              <ProfileCard
                href={`/${locale}/coaches/${coach.slug}/`}
                name={coach.name}
                subtitle={coach.role}
                portrait={
                  coach.images[0] ? getImage(coach.images[0], locale) : null
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
