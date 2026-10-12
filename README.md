# Armenian Gymnastics Federation

Public information website of the Armenian Gymnastics Federation, served at `armgymnastics.am`. Built for Doping Space. Armenian and English.

Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4, exported as a fully static site. The host is cPanel shared hosting without Node.js.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build   # static export to out/
```

## Deployment

`npm run build` writes plain HTML/CSS/JS to `out/`. Upload the contents of `out/` to the domain's `public_html`. The upload method (SFTP or cPanel File Manager) depends on the hosting access and is not decided yet.

## Notes

- Languages are prefixed routes (`/hy/*`, `/en/*`), and `/` redirects to `/hy/`.
- Static export means no server features: no route handlers, cookies, middleware, redirects/rewrites config, server actions or ISR.
- Project context and decisions live in `docs/` (gitignored, kept locally). See `CLAUDE.md` for working rules.
