import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { hasLocale, type Locale } from "@/app/[lang]/dictionaries";
import imageManifest from "@/content/shared/images.json";
import imageAltEn from "@/content/en/images.json";
import imageAltHy from "@/content/hy/images.json";

// Text lives in content/<locale>/*.json, language-neutral data in content/shared/, image files in public/images/.
// To add a language: copy content/hy/ to content/<locale>/, translate it and register the locale below.

export type Block =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "fact"; title?: string; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "callout"; text: string }
  | { type: "image"; ref: string };

export type Subsection = { id: string; title: string; blocks: Block[] };

// A section has either `blocks` or `subsections`.
export type Section = {
  id: string;
  title: string;
  blocks?: Block[];
  subsections?: Subsection[];
};

export type About = {
  cover: { title: string; place: string; year: number };
  sections: Section[];
};

const about: Partial<Record<Locale, () => Promise<About>>> = {
  hy: () =>
    import("@/content/hy/about.json").then(
      (m) => m.default as unknown as About,
    ),
};

/** Locales that have content files; routes only generate pages for these. */
export const aboutLocales = Object.keys(about) as Locale[];

export const getAbout = async (locale?: string): Promise<About> => {
  const current = locale ?? (await lang());
  const load = hasLocale(current) ? about[current] : undefined;
  if (!load) notFound();
  return load();
};

type ImageEntry = {
  id: string;
  file: string;
  width: number;
  height: number;
};

const images = new Map(
  (imageManifest.images as ImageEntry[]).map((image) => [image.id, image]),
);

const imageAlt: Record<string, Record<string, string>> = {
  hy: imageAltHy,
  en: imageAltEn,
};

export const getImage = (id: string, locale: string) => {
  const image = images.get(id);
  if (!image) throw new Error(`Unknown image id: ${id}`);
  return {
    src: `/images/${image.file}`,
    width: image.width,
    height: image.height,
    alt: imageAlt[locale]?.[id] ?? imageAlt.hy[id] ?? "",
  };
};
