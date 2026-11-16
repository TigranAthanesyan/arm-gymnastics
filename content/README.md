# Site content (armgymnastics.am)

> Structured copy of the PDF the Armenian Gymnastics Federation sent (Canva export, 28 pages, A4, dated 2026-07-01, title on the cover: «Հայկական մարմնամարզության պատմություն», Երևան 2026).
> Created 2026-10-19. Language of the source: Armenian only. The PDF has no text layer (every page is one flat image), so all text was read from the page images by eye, not copied from a text layer. Proofread before publishing.

## What is here

```
content/
├── README.md                     this file
├── shared/                       language-neutral, never translated
│   ├── achievements.json         medal data (128 rows after the 2026-11-16 corrections) + athlete index + overall World Cup titles
│   └── images.json               id → file (relative to public/images/), size, source page, subject, kind
├── hy/                           Armenian (source language). To add a language, copy this folder to content/<locale>/ and translate.
│   ├── about.json                overview, history, men/women programme, golden age, independent Armenia, federation, conclusion, cover
│   ├── athletes.json             9 athlete profiles (2 legends, 7 from independent Armenia)
│   ├── coaches.json              4 coaches (Hakob Serobyan full profile, 3 short entries)
│   ├── elements.json             8 gymnastics elements named after Armenians (FIG)
│   ├── labels.json               code → text maps (competitions, apparatus, medals, categories)
│   ├── contact.json              federation address and email
│   └── images.json               image id → alt text
└── en/
    └── images.json               English alt texts only; the rest is not translated yet

public/images/                    image files (the only copy)
├── athletes/<slug>/…             named <slug>-<role>.jpg
├── federation/
└── brand/                        logo (transparent PNG)
```

## How the JSON is shaped

- **Locale split.** Text lives in `content/<locale>/`. Anything that does not change by language (medals, years, image ids, slugs) lives once in `content/shared/`. To add English: copy `content/hy/*.json` to `content/en/`, translate the strings, keep ids and structure, then register the locale in every loader: `lib/content.ts`, `lib/athletes.ts`, `lib/coaches.ts`, `lib/elements.ts` (`labels.json` is needed too). See `../docs/pattern-content-pages.md` (parent folder).
- **Content blocks.** `about.json`, `athletes.json` and `coaches.json` hold an ordered `blocks` array in the order the PDF shows it. Block types: `paragraph`, `list` (`items`), `fact` («Ուշագրավ փաստ» boxes, optional `title`), `quote` (`text`, `attribution`), `callout`, `image` (`ref` = id in `shared/images.json`).
- **Inline emphasis.** `**bold**` marks the bold passages in the PDF. The block renderer turns it into `<strong>`.
- **Slugs** are stable ids (`albert-azaryan`, …). `achievements.json`, `elements.json` and the profiles all point to them.
- **Codes.** `competition`, `apparatus` and `medal` in `achievements.json` are codes. `labels.json` gives the Armenian text. Source abbreviation Նժ/թ = `pommel-horse`.
- **`sourcePage` / `sourcePages`** are 1-based pages of the federation's PDF (no longer in the repo), so a line can be traced back when checking facts. `sourceNote` / `sourceNotes` hold open questions (below). Strip them once the federation has answered.

### Page map

| PDF pages | Content | File |
|---|---|---|
| 1 | Cover | `about.json` → `cover` |
| 2–4 | Overview, history, men/women, golden age | `about.json` |
| 5–6 | Hrant Shahinyan | `athletes.json` |
| 7–9, 11 | Albert Azaryan (statue photo is on 11 and belongs to the federation section) | `athletes.json`, `about.json` |
| 10–11 | Independent Armenia, federation role | `about.json` |
| 12–20 | Stepanyan, Merdinyan, A. Davtyan, V. Davtyan, Avetisyan, Manoukyan, Khachatryan, Serobyan | `athletes.json`, `coaches.json` |
| 21 | Other coaches, FIG elements | `coaches.json`, `elements.json` |
| 22 | Summary (mentions the 2027 European Championships in Yerevan) | `about.json` |
| 23–28 | Achievements table, contact | `achievements.json`, `contact.json` |

> **Update 2026-11-16:** most of the checks below are resolved (sources and applied changes: `../docs/content-fixes.md`; what is still open: `../docs/content-questions.md`). The table now covers **main events only** (no Challenge Cups, EYOF, Military Games, invitational cups) and has 2026 results added; it is no longer a copy of the PDF. `content/` is tracked in git.

## Things to check with the federation (original list, partly resolved)

These are inconsistencies **inside the PDF**. I transcribed what is printed and flagged them with `sourceNote`; I did not correct facts.

1. **Shahinyan, Helsinki 1952.** The bio says Olympic gold on pommel horse; the table lists pommel horse as silver (and gold on rings, team; silver all-around).
2. **Mamikon Khachatryan, World Juniors 2023.** The bio says bronze; the table says silver.
3. **Artur Avetisyan, 2025.** The bio says World Championships bronze, Leipzig; the table says European Championships bronze, Rimini. (Leipzig hosted the 2025 Europeans; Rimini the 2024 ones.)
4. **Artur Davtyan, pommel horse.** The Basel 2021 European gold, the 2023 Antalya European bronze and the 2021 Cairo "Davtyan" element are all listed on pommel horse, but he is presented as a vault specialist. Probably typos for vault.
5. **Manoukyan element.** The text says "Համլետ **Մամիկոն**յան" and "Paris World Cup 2025", but his table lists 2025 World Cup stages in Osijek, Doha, Cairo.
6. **World Cup rows** in the tables (Davtyan A., Avetisyan) give no apparatus; I assumed their specialty (flagged in each row).
7. **Truncated sentence** at the end of the history paragraph on PDF page 3 («…համարվում էին անհնարին», no full stop).
8. **Stylised headings.** Section titles are in a script font. The cover and "Պատմական ակնարկ" were read from the glyphs; confirm.
9. **Typos fixed** silently: missing spaces, «Կաղ»→«Վաղ», «մրցաշարթակներում»→«մրցաշարերում», «աղդեցություն»→«ազդեցություն». Everything else is as printed.

## About the images

- **Resolution is limited.** The PDF stored each page as a 990×1400 px raster (about 120 ppi), so these are crops of that raster, not the originals. They are fine for web cards at roughly 500 px wide but too small for print or full-width heroes. Ask the federation for the original photos.
- **Rights and provenance.** Several images (the historical portraits of Shahinyan and Azaryan, and some athlete portraits with composite backgrounds) look AI-generated or heavily composited. Ask the federation which images are cleared for publication and whether captions are needed.
- The cover artwork from the PDF was dropped (not needed). The federation logo is cut as a circle with transparent corners; `Armenian_Gymnastics_Federation_logo.jpg` in the project root is probably a better source if it is larger.

## Site notes

- `hy/contact.json` and `en/contact.json` feed the footer. The public email is `info@armgymnastics.am` (from the client); the PDF's `armgymnastics@gmail.com` is not published.
- Tracked by git (unlike `docs/`, which is gitignored). Loaders: `lib/content.ts` (About), `lib/athletes.ts`, `lib/coaches.ts`, `lib/elements.ts`; renderer: `components/blocks.tsx`. `lib/contact.ts` loads the contact data for the footer.
- Only for the armgymnastics.am site. Not needed for echyerevan2027.com.
