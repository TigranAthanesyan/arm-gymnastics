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

function BlockView({ block, lang }: { block: Block; lang: string }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="leading-relaxed">
          <Inline text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul className="list-disc space-y-1 pl-6 leading-relaxed">
          {block.items.map((item) => (
            <li key={item}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      );
    case "fact":
      return (
        <aside className="border-l-4 border-highlight bg-surface p-4 leading-relaxed">
          {block.title && <p className="mb-1 font-bold">{block.title}</p>}
          <p>
            <Inline text={block.text} />
          </p>
        </aside>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-brand pl-4 italic leading-relaxed">
          <p>
            <Inline text={block.text} />
          </p>
          {block.attribution && (
            <footer className="mt-2 text-sm not-italic">
              — {block.attribution}
            </footer>
          )}
        </blockquote>
      );
    case "callout":
      return (
        <p className="bg-brand-deep p-4 text-lg font-bold leading-relaxed text-white">
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
          className="h-auto max-w-full"
        />
      );
    }
    default:
      return null;
  }
}

export function Blocks({ blocks, lang }: { blocks: Block[]; lang: string }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} lang={lang} />
      ))}
    </div>
  );
}

export function SectionBody({
  section,
  lang,
}: {
  section: Section;
  lang: string;
}) {
  return (
    <>
      {section.blocks && <Blocks blocks={section.blocks} lang={lang} />}
      {section.subsections?.map((sub) => (
        <section key={sub.id} className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">{sub.title}</h2>
          <Blocks blocks={sub.blocks} lang={lang} />
        </section>
      ))}
    </>
  );
}
