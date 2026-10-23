import { getDictionary } from "./dictionaries";

export default async function Home() {
  const dict = await getDictionary();
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <h1>{dict.home.heading}</h1>
    </main>
  );
}
