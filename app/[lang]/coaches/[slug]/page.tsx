import Link from "next/link";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { Blocks } from "@/components/blocks";
import { getCoaches } from "@/lib/coaches";
import { defaultLocale, getDictionary, locales } from "../../dictionaries";

// Slugs are language-neutral, so every locale gets the default locale's slugs;
// a locale without content renders the "not available" note instead of 404.
export async function generateStaticParams() {
  const coaches = await getCoaches(defaultLocale);
  return locales.flatMap((lang) => coaches.map(({ slug }) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/coaches/[slug]">) {
  const { slug } = await params;
  const coaches = await getCoaches();
  return { title: coaches.find((c) => c.slug === slug)?.name };
}

export default async function Coach({
  params,
}: PageProps<"/[lang]/coaches/[slug]">) {
  const { slug } = await params;
  const [coaches, dict, locale] = await Promise.all([
    getCoaches(),
    getDictionary(),
    lang(),
  ]);

  const link = "text-brand underline hover:text-accent-deep";
  const back = (
    <Link href={`/${locale}/coaches/`} className={link}>
      ← {dict.coaches.all}
    </Link>
  );

  if (coaches.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        {back}
        <p className="mt-6">{dict.coaches.empty}</p>
      </main>
    );
  }

  const index = coaches.findIndex((c) => c.slug === slug);
  if (index === -1) notFound();
  const coach = coaches[index];
  const previous = coaches[index - 1];
  const next = coaches[index + 1];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10">
      {back}
      <h1 className="mt-4 text-3xl font-bold text-brand-deep">{coach.name}</h1>
      <p className="mt-1 mb-6 text-sm">{coach.role}</p>
      <Blocks blocks={coach.blocks} lang={locale} />
      <div className="min-h-12 flex-1" />
      <nav className="mt-auto flex justify-between gap-4 border-t border-surface pt-4">
        {previous ? (
          <Link href={`/${locale}/coaches/${previous.slug}/`} className={link}>
            ← {dict.coaches.previous}: {previous.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/${locale}/coaches/${next.slug}/`}
            className={`${link} text-right`}
          >
            {dict.coaches.next}: {next.name} →
          </Link>
        )}
      </nav>
    </main>
  );
}
