import { defaultLocale, hasLocale, type Locale } from "@/app/[lang]/dictionaries";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";

// Same pattern as the other content loaders, but a locale without a file falls back to the default
// locale: the footer shows on every page, so an empty contact block would be worse than an Armenian one.

export type Contact = {
  organization: string;
  address: { country: string; postalCode: string; city: string; street: string };
  email: string;
};

const contact: Partial<Record<Locale, () => Promise<Contact>>> = {
  hy: () => import("@/content/hy/contact.json").then((m) => m.default),
  en: () => import("@/content/en/contact.json").then((m) => m.default),
};

export const getContact = async (locale?: string): Promise<Contact> => {
  const current = locale ?? (await lang());
  if (!hasLocale(current)) notFound();
  return (contact[current] ?? contact[defaultLocale]!)();
};
