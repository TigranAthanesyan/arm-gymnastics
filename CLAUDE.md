@AGENTS.md

# Armenian Gymnastics Federation

Simple public information site about the Armenian Gymnastics Federation (`armgymnastics.am`). Planned v1 pages: Home, About, Disciplines, News, Contact (not final, discuss first). Client: Doping Space. Armenian + English. A sibling site (`echyerevan2027.com`, the 2027 European Championships in Yerevan) lives in a separate repo.

Full context, decisions and open items: [docs/project-context.md](docs/project-context.md). Read it first. `docs/` is gitignored, so keep it in sync with `../docs/project-context.md` when you change it. Hosting notes for this domain are in `../docs/cpanel-armgymnastics.md`.

## Hard constraints

- **Static export only** (`output: 'export'` in `next.config.ts`). The host is cPanel shared hosting with no Node.js. Do not use anything that needs a server: route handlers on Request, cookies/headers, proxy/middleware, rewrites/redirects/headers config, server actions, ISR, `cacheComponents`, the default image optimizer. Check `node_modules/next/dist/docs/01-app/02-guides/static-exports.md` before adding features.
- Every dynamic route needs `generateStaticParams`.
- **i18n:** both languages are prefixed (`/hy/*`, `/en/*`) via `app/[lang]/`, with plain typed dictionaries and no i18n library. `/` only redirects to `/hy/` (`app/(redirect)/` plus `public/.htaccess`). Armenian is the default. Dictionaries: `app/[lang]/dictionaries/{en,hy}.ts` (`en.ts` defines the `Dictionary` type; `hy.ts` must match it). Read them with `getDictionary()`. All user-facing text goes in the dictionaries, never hardcoded in components.
- Content is static. No CMS, no backend. Russian is not in v1.
- **Never** put credentials (cPanel, FTP, email, registrar) in the repo or in `docs/`.

## Commands

- `npm run dev`: dev server
- `npm run build`: static export to `out/` (this is what gets uploaded to `public_html`)
- `npm run lint`: ESLint

Deployment is manual: upload the contents of `out/`. Method is not decided yet.

## Stack

Next.js 16 (App Router, root `app/` dir, no `src/`), React 19, TypeScript, Tailwind CSS 4.

## Working style

- Be direct and concise. Ask before drafting rather than assuming.
- The developer is new to freelance hosting and deployment. Briefly explain new hosting or tooling terms.
- Design, page list and content are not decided yet (waiting for the federation's brand book and reference research). Do not invent them. Discuss first.
- Update `docs/project-context.md` (decision log) when a decision changes.
