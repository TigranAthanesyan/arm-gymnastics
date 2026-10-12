import { lang } from "next/root-params";
import { notFound } from "next/navigation";

const dictionaries = {
  hy: () => import("./dictionaries/hy").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;

export const locales = Object.keys(dictionaries) as Locale[];
export const defaultLocale: Locale = "hy";

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async () => {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return dictionaries[locale]();
};
