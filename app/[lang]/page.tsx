import { getDictionary } from "./dictionaries";

export default async function Home() {
  const dict = await getDictionary();
  return (
    <main>
      <h1>{dict.home.heading}</h1>
    </main>
  );
}
