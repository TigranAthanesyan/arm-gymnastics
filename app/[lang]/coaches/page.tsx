import Image from "next/image";
import Link from "next/link";
import { lang } from "next/root-params";
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
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <h1 className="text-3xl font-bold text-brand-deep">{dict.nav.coaches}</h1>
      {coaches.length === 0 && <p className="mt-6">{dict.coaches.empty}</p>}
      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {coaches.map((coach) => {
          const portrait = coach.images[0]
            ? getImage(coach.images[0], locale)
            : null;
          return (
            <li key={coach.slug}>
              <Link
                href={`/${locale}/coaches/${coach.slug}/`}
                className="group block h-full overflow-hidden rounded-lg bg-surface"
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
                    {coach.name}
                  </span>
                  <span className="block text-sm">{coach.role}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
