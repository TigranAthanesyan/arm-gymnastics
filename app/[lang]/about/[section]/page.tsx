import Link from "next/link";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { SectionBody } from "@/components/blocks";
import { aboutLocales, getAbout } from "@/lib/content";
import { getDictionary } from "../../dictionaries";

export async function generateStaticParams() {
  const params = await Promise.all(
    aboutLocales.map(async (lang) => {
      const { sections } = await getAbout(lang);
      return sections.map(({ id }) => ({ lang, section: id }));
    }),
  );
  return params.flat();
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

  const index = sections.findIndex((s) => s.id === id);
  if (index === -1) notFound();
  const section = sections[index];
  const previous = sections[index - 1];
  const next = sections[index + 1];
  const link = "text-brand underline hover:text-accent-deep";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href={`/${locale}/about/`} className={link}>
        ← {dict.about.allSections}
      </Link>
      <h1 className="mt-4 mb-6 text-3xl font-bold text-brand-deep">
        {section.title}
      </h1>
      <SectionBody section={section} lang={locale} />
      <nav className="mt-12 flex justify-between gap-4 border-t border-surface pt-4">
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
