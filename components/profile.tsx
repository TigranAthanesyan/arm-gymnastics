import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Img = { src: string; width: number; height: number; alt: string };

/** Dark band at the top of the list pages (athletes, coaches, elements, medals). */
export function PageHeader({
  title,
  intro,
  back,
  children,
}: {
  title: string;
  intro?: string;
  back?: { href: string; label: string };
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-night text-white">
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 size-96 rounded-full bg-accent/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 left-1/4 size-96 rounded-full bg-brand/50 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
        {back && (
          <Link
            href={back.href}
            className="rise mb-6 inline-block rounded-full border border-white/30 px-4 py-1.5 text-sm text-white/90 transition hover:bg-white/10"
          >
            ← {back.label}
          </Link>
        )}
        <span
          aria-hidden="true"
          className="rise mb-5 block h-1 w-16 bg-linear-to-r from-accent via-brand to-highlight"
        />
        <h1 className="rise max-w-4xl text-[1.7rem] leading-tight font-bold wrap-break-word sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="rise mt-4 max-w-2xl text-lg leading-relaxed text-white/80">
            {intro}
          </p>
        )}
        {children && <div className="rise mt-8">{children}</div>}
      </div>
    </div>
  );
}

/** Portrait card with the name over the photo. `featured` makes it larger. */
export function ProfileCard({
  href,
  name,
  subtitle,
  portrait,
  featured = false,
}: {
  href: string;
  name: string;
  subtitle?: string;
  portrait: Img | null;
  featured?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group relative block aspect-3/4 overflow-hidden rounded-2xl bg-night shadow-md ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {portrait ? (
        <Image
          src={portrait.src}
          width={portrait.width}
          height={portrait.height}
          alt={portrait.alt}
          className="absolute inset-0 size-full object-cover object-top transition duration-700 group-hover:scale-105"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center bg-linear-to-br from-brand-deep to-night text-6xl font-bold text-white/25"
        >
          {name.charAt(0)}
        </span>
      )}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-night via-night/40 to-transparent opacity-90"
      />
      <span className="absolute inset-x-0 bottom-0 block p-4 text-white md:p-5">
        <span
          aria-hidden="true"
          className="mb-3 block h-0.5 w-8 bg-highlight transition-all duration-300 group-hover:w-16"
        />
        <span
          className={`block leading-tight font-bold ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}
        >
          {name}
        </span>
        {subtitle && (
          <span
            className={`mt-1 block text-white/75 ${featured ? "text-base" : "text-sm"}`}
          >
            {subtitle}
          </span>
        )}
      </span>
    </Link>
  );
}

/** Dark hero of a profile page: blurred copy of the portrait as backdrop, name large, portrait beside it. */
export function ProfileHero({
  backHref,
  backLabel,
  name,
  chips,
  portrait,
}: {
  backHref: string;
  backLabel: string;
  name: string;
  chips: string[];
  portrait: Img | null;
}) {
  return (
    <div className="relative overflow-hidden bg-night text-white">
      {portrait && (
        <Image
          src={portrait.src}
          width={portrait.width}
          height={portrait.height}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full scale-125 object-cover opacity-40 blur-2xl"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-night via-night/80 to-night/30"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-[1fr_auto] md:py-16">
        <div className="rise order-2 md:order-1">
          <Link
            href={backHref}
            className="inline-block rounded-full border border-white/30 px-4 py-1.5 text-sm text-white/90 transition hover:bg-white/10"
          >
            ← {backLabel}
          </Link>
          <h1 className="mt-6 text-[1.7rem] leading-tight font-bold wrap-break-word sm:text-4xl md:text-6xl">
            {name}
          </h1>
          {chips.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full bg-white/10 px-4 py-1.5 text-sm ring-1 ring-white/20 backdrop-blur"
                >
                  {chip}
                </li>
              ))}
            </ul>
          )}
          <span
            aria-hidden="true"
            className="mt-8 block h-1 w-24 bg-linear-to-r from-accent via-brand to-highlight"
          />
        </div>
        {portrait && (
          <div className="rise order-1 mx-auto w-56 md:order-2 md:w-80">
            <Image
              src={portrait.src}
              width={portrait.width}
              height={portrait.height}
              alt={portrait.alt}
              priority
              className="aspect-3/4 w-full rounded-2xl object-cover object-top shadow-2xl ring-1 ring-white/20"
            />
          </div>
        )}
      </div>
    </div>
  );
}

type NavTarget = { href: string; name: string; image?: Img | null };

function NavCard({
  target,
  label,
  direction,
}: {
  target: NavTarget;
  label: string;
  direction: "previous" | "next";
}) {
  const isNext = direction === "next";
  const arrow = (
    <span
      aria-hidden="true"
      className={`grid size-12 shrink-0 place-items-center rounded-full bg-white/10 text-xl ring-1 ring-white/25 transition duration-300 group-hover:bg-highlight group-hover:text-night group-hover:ring-highlight ${
        isNext ? "group-hover:translate-x-1" : "group-hover:-translate-x-1"
      }`}
    >
      {isNext ? "→" : "←"}
    </span>
  );
  return (
    <Link
      href={target.href}
      className={`group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl bg-linear-to-br from-brand-deep to-night p-5 text-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl md:p-6 ${
        isNext ? "flex-row-reverse text-right" : ""
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-accent via-brand to-highlight"
      />
      {arrow}
      {target.image && (
        <Image
          src={target.image.src}
          width={target.image.width}
          height={target.image.height}
          alt=""
          className="hidden size-16 shrink-0 rounded-full object-cover object-top ring-2 ring-white/30 sm:block"
        />
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-sm text-highlight">{label}</span>
        <span className="mt-1 block text-lg leading-snug font-bold">
          {target.name}
        </span>
      </span>
    </Link>
  );
}

/** Previous / next cards at the bottom of a profile or article page. */
export function ProfileNav({
  previous,
  next,
  previousLabel,
  nextLabel,
}: {
  previous?: NavTarget;
  next?: NavTarget;
  previousLabel: string;
  nextLabel: string;
}) {
  return (
    <nav className="mt-16 grid gap-4 sm:grid-cols-2">
      {previous ? (
        <NavCard target={previous} label={previousLabel} direction="previous" />
      ) : (
        <span />
      )}
      {next && <NavCard target={next} label={nextLabel} direction="next" />}
    </nav>
  );
}
