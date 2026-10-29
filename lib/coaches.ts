import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { hasLocale, type Locale } from "@/app/[lang]/dictionaries";
import type { Block } from "./content";

// Same pattern as About and Athletes: text in content/<locale>/coaches.json, registered per locale below.

export type Coach = {
  slug: string;
  name: string;
  role: string;
  images: string[];
  blocks: Block[];
};

const coaches: Partial<Record<Locale, () => Promise<Coach[]>>> = {
  hy: () =>
    import("@/content/hy/coaches.json").then(
      (m) => m.default.coaches as unknown as Coach[],
    ),
};

/** A locale without a content file gets an empty list, so its pages render empty instead of 404. */
export const getCoaches = async (locale?: string): Promise<Coach[]> => {
  const current = locale ?? (await lang());
  if (!hasLocale(current)) notFound();
  return coaches[current]?.() ?? [];
};
