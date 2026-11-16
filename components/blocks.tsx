import Image from "next/image";
import { getImage, type Block, type Section } from "@/lib/content";

// "**bold**" in the content JSON marks the bold passages of the source.
function Inline({ text }: { text: string }) {
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
    );
}

function BlockView({
  block,
  lang,
  lede,
}: {
  block: Block;
  lang: string;
  lede: boolean;
}) {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          className={
            lede
              ? "text-xl leading-relaxed font-medium text-brand-deep"
              : "text-lg leading-relaxed"
          }
        >
          <Inline text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul className="list-disc space-y-1 pl-6 text-lg leading-relaxed marker:text-highlight">
          {block.items.map((item) => (
            <li key={item}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      );
    case "fact":
      return (
        <aside className="relative overflow-hidden rounded-2xl bg-surface p-6 leading-relaxed ring-1 ring-black/5">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1.5 bg-linear-to-b from-highlight to-accent"
          />
          {block.title && (
            <p className="mb-2 text-lg font-bold text-brand-deep">
              {block.title}
            </p>
          )}
          <p>
            <Inline text={block.text} />
          </p>
        </aside>
      );
    case "quote":
      return (
        <blockquote className="relative py-2 pl-10 md:-mx-6 md:pl-16">
          <span
            aria-hidden="true"
            className="absolute -top-2 left-0 font-serif text-7xl leading-none text-highlight md:text-8xl"
          >
            “
          </span>
          <p className="text-xl leading-relaxed font-medium text-brand-deep italic md:text-2xl">
            <Inline text={block.text} />
          </p>
          {block.attribution && (
            <footer className="mt-3 text-sm text-ink/70">
              — {block.attribution}
            </footer>
          )}
        </blockquote>
      );
    case "callout":
      return (
        <p className="rounded-2xl bg-linear-to-br from-brand-deep to-night p-6 text-xl leading-relaxed font-bold text-white shadow-lg md:-mx-6 md:p-8">
          <Inline text={block.text} />
        </p>
      );
    case "image": {
      const { src, width, height, alt } = getImage(block.ref, lang);
      return (
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          className="h-auto max-w-full rounded-2xl shadow-lg ring-1 ring-black/5"
        />
      );
    }
    default:
      return null;
  }
}

/** `lede` renders the first paragraph larger, as an introduction. */
export function Blocks({
  blocks,
  lang,
  lede = false,
}: {
  blocks: Block[];
  lang: string;
  lede?: boolean;
}) {
  const first = blocks.findIndex((b) => b.type === "paragraph");
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => (
        <BlockView
          key={i}
          block={block}
          lang={lang}
          lede={lede && i === first}
        />
      ))}
    </div>
  );
}

export function SectionBody({
  section,
  lang,
  lede = false,
}: {
  section: Section;
  lang: string;
  lede?: boolean;
}) {
  return (
    <>
      {section.blocks && <Blocks blocks={section.blocks} lang={lang} lede={lede} />}
      {section.subsections?.map((sub) => (
        <section key={sub.id} className="mt-12 space-y-6 first:mt-0">
          <h2 className="text-3xl font-bold text-brand-deep">{sub.title}</h2>
          <Blocks blocks={sub.blocks} lang={lang} />
        </section>
      ))}
    </>
  );
}
