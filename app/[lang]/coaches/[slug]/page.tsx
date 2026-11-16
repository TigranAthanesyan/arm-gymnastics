import Link from "next/link";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { Blocks } from "@/components/blocks";
import { ProfileHero, ProfileNav } from "@/components/profile";
import { getImage } from "@/lib/content";
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

  const portraitId = coach.images[0];
  const portrait = portraitId ? getImage(portraitId, locale) : null;
  const blocks = coach.blocks.filter(
    (b) => !(b.type === "image" && b.ref === portraitId),
  );

  return (
    <main className="flex-1">
      <ProfileHero
        backHref={`/${locale}/coaches/`}
        backLabel={dict.coaches.all}
        name={coach.name}
        chips={[coach.role]}
        portrait={portrait}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <Blocks blocks={blocks} lang={locale} lede />
        <ProfileNav
          previous={
            previous && {
              href: `/${locale}/coaches/${previous.slug}/`,
              name: previous.name,
              image: previous.images[0] ? getImage(previous.images[0], locale) : null,
            }
          }
          next={
            next && {
              href: `/${locale}/coaches/${next.slug}/`,
              name: next.name,
              image: next.images[0] ? getImage(next.images[0], locale) : null,
            }
          }
          previousLabel={dict.coaches.previous}
          nextLabel={dict.coaches.next}
        />
      </div>
    </main>
  );
}
