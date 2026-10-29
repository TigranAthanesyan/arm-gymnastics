import Image from "next/image";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { getContact } from "@/lib/contact";
import { socialLinks } from "@/lib/social";

export async function SiteFooter() {
  const [dict, { address, email }] = await Promise.all([
    getDictionary(),
    getContact(),
  ]);

  return (
    <footer className="bg-brand-deep text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12">
          <Image
            src="/images/brand/federation-logo-round.png"
            alt=""
            width={80}
            height={80}
            className="shrink-0"
          />
          <address className="not-italic leading-relaxed">
            <p className="font-bold">{dict.footer.contact}</p>
            <p>
              {address.street}, {address.city} {address.postalCode},{" "}
              {address.country}
            </p>
            <p>
              <a
                href={`mailto:${email}`}
                className="underline hover:text-white/80"
              >
                {email}
              </a>
            </p>
          </address>
          <div>
            <p className="font-bold">{dict.footer.followUs}</p>
            <ul className="mt-2 flex gap-3">
              {socialLinks.map(({ name, icon, href }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    title={name}
                    className="block transition-opacity hover:opacity-80"
                  >
                    <Image
                      src={`/images/social/${icon}.svg`}
                      alt=""
                      width={32}
                      height={32}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-white/20 pt-4 text-center">
          © {new Date().getFullYear()} {dict.meta.title}
        </p>
      </div>
    </footer>
  );
}
