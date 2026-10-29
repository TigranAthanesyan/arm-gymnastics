import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { hasLocale, type Locale } from "@/app/[lang]/dictionaries";
import achievements from "@/content/shared/achievements.json";
import type { Block } from "./content";

// Same pattern as About in content.ts: text in content/<locale>/, language-neutral medals in content/shared/.
// To add a language: add content/<locale>/{athletes,labels}.json and register the locale below.

export type Athlete = {
  slug: string;
  name: string;
  category: string;
  specialty: string[];
  born?: string;
  died?: string;
  images: string[];
  blocks: Block[];
};

export type Labels = {
  competitions: Record<string, string>;
  apparatus: Record<string, string>;
  medals: Record<string, string>;
  titles: Record<string, string>;
  categories: Record<string, string>;
};

export type Medal = {
  competition: string;
  year: number;
  place: string;
  apparatus: string;
  medal: string;
};

export type AthletesData = { athletes: Athlete[]; labels: Labels };

const athletesData: Partial<Record<Locale, () => Promise<AthletesData>>> = {
  hy: async () => {
    const [athletes, labels] = await Promise.all([
      import("@/content/hy/athletes.json"),
      import("@/content/hy/labels.json"),
    ]);
    return {
      athletes: athletes.default.athletes as unknown as Athlete[],
      labels: labels.default as unknown as Labels,
    };
  },
};

const emptyAthletes: AthletesData = {
  athletes: [],
  labels: {
    competitions: {},
    apparatus: {},
    medals: {},
    titles: {},
    categories: {},
  },
};

/** A locale without a content file gets an empty list, so its pages render empty instead of 404. */
export const getAthletes = async (locale?: string): Promise<AthletesData> => {
  const current = locale ?? (await lang());
  if (!hasLocale(current)) notFound();
  return athletesData[current]?.() ?? emptyAthletes;
};

type MedalRow = {
  athlete: string;
  competition: string;
  year: number;
  place: Partial<Record<Locale, string>> | null;
  apparatus: string;
  medal: string;
};

/** Medal rows of one athlete, newest first (the source table is grouped by athlete, not sorted). */
export const getMedals = (slug: string, locale: Locale): Medal[] =>
  (achievements.medals as MedalRow[])
    .filter((row) => row.athlete === slug)
    .map((row) => ({
      competition: row.competition,
      year: row.year,
      place: row.place?.[locale] ?? "",
      apparatus: row.apparatus,
      medal: row.medal,
    }))
    .sort((a, b) => b.year - a.year);

export type Title = { title: string; years: number[] };

export const getTitles = (slug: string): Title[] =>
  (achievements.titles as ({ athlete: string } & Title)[])
    .filter((row) => row.athlete === slug)
    .map(({ title, years }) => ({ title, years }));

export type MedalEntry = Medal & { athlete: string; athleteName: string };

const medalOrder = ["gold", "silver", "bronze"];

const athleteNames = new Map(
  (
    achievements.athletes as { slug: string; name: Partial<Record<Locale, string>> }[]
  ).map(({ slug, name }) => [slug, name]),
);

/** Every medal row of every athlete (including those without a profile), newest first, then gold before silver. */
export const getAllMedals = (locale: Locale): MedalEntry[] =>
  (achievements.medals as MedalRow[])
    .map((row) => ({
      athlete: row.athlete,
      athleteName:
        athleteNames.get(row.athlete)?.[locale] ??
        athleteNames.get(row.athlete)?.hy ??
        row.athlete,
      competition: row.competition,
      year: row.year,
      place: row.place?.[locale] ?? "",
      apparatus: row.apparatus,
      medal: row.medal,
    }))
    .sort(
      (a, b) =>
        b.year - a.year ||
        medalOrder.indexOf(a.medal) - medalOrder.indexOf(b.medal),
    );

/** Overall World Cup titles of all athletes. */
export const getAllTitles = (): (Title & { athlete: string })[] =>
  (achievements.titles as ({ athlete: string } & Title)[]).map(
    ({ athlete, title, years }) => ({ athlete, title, years }),
  );
