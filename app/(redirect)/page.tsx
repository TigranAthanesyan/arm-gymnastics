import { defaultLocale } from "../[lang]/dictionaries";

// Static export has no server redirects, so `/` forwards to the default locale
// with a meta refresh. On Apache, public/.htaccess also sends a real HTTP redirect.
export default function Root() {
  const target = `/${defaultLocale}/`;
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${target}`} />
      <link rel="canonical" href={target} />
      <a href={target}>{target}</a>
    </>
  );
}
