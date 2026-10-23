import Link from "next/link";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { SectionBody } from "@/components/blocks";
import { getAbout } from "@/lib/content";
import { defaultLocale, getDictionary, locales } from "../../dictionaries";

// Section ids are language-neutral, so every locale gets the default locale's ids;
// a locale without content renders the "not available" note instead of 404.
export async function generateStaticParams() {
  const { sections } = await getAbout(defaultLocale);
  return locales.flatMap((lang) =>
    sections.map(({ id }) => ({ lang, section: id })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/about/[section]">) {
  const { section: id } = await params;
  const { sections } = await getAbout();
  return { title: sections.find((s) => s.id === id)?.title };
}

export default async function AboutSection({
  params,
}: PageProps<"/[lang]/about/[section]">) {
  const { section: id } = await params;
  const [{ sections }, dict, locale] = await Promise.all([
    getAbout(),
    getDictionary(),
    lang(),
  ]);

  const link = "text-brand underline hover:text-accent-deep";

  if (sections.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <Link href={`/${locale}/about/`} className={link}>
          ← {dict.about.allSections}
        </Link>
        <p className="mt-6">{dict.about.empty}</p>
      </main>
    );
  }

  const index = sections.findIndex((s) => s.id === id);
  if (index === -1) notFound();
  const section = sections[index];
  const previous = sections[index - 1];
  const next = sections[index + 1];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10">
      <Link href={`/${locale}/about/`} className={link}>
        ← {dict.about.allSections}
      </Link>
      <h1 className="mt-4 mb-6 text-3xl font-bold text-brand-deep">
        {section.title}
      </h1>
      <SectionBody section={section} lang={locale} />
      <div className="min-h-12 flex-1" />
      <nav className="mt-auto flex justify-between gap-4 border-t border-surface pt-4">
        {previous ? (
          <Link href={`/${locale}/about/${previous.id}/`} className={link}>
            ← {dict.about.previous}: {previous.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/${locale}/about/${next.id}/`}
            className={`${link} text-right`}
          >
            {dict.about.next}: {next.title} →
          </Link>
        )}
      </nav>
    </main>
  );
}
