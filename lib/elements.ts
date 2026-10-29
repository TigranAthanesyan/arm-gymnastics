import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { hasLocale, type Locale } from "@/app/[lang]/dictionaries";

// Same pattern as About and Athletes: text in content/<locale>/elements.json, registered per locale below.

export type Element = {
  id: string;
  name: string;
  athlete: string;
  apparatus: string;
  year: number | null;
  text: string;
};

export type Elements = { title: string; intro: string; items: Element[] };

const elements: Partial<Record<Locale, () => Promise<Elements>>> = {
  hy: () =>
    import("@/content/hy/elements.json").then(
      (m) => m.default as unknown as Elements,
    ),
};

/** A locale without a content file gets an empty page, so it renders the "not available" note instead of 404. */
export const getElements = async (locale?: string): Promise<Elements> => {
  const current = locale ?? (await lang());
  if (!hasLocale(current)) notFound();
  return elements[current]?.() ?? { title: "", intro: "", items: [] };
};
