import { getDictionary } from "@/app/[lang]/dictionaries";

export async function SiteFooter() {
  const dict = await getDictionary();

  return (
    <footer className="bg-brand-deep text-white">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm">
        © {new Date().getFullYear()} {dict.meta.title}
      </div>
    </footer>
  );
}
