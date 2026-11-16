export const medalDot: Record<string, string> = {
  gold: "bg-medal-gold",
  silver: "bg-medal-silver",
  bronze: "bg-medal-bronze",
};

/** Gold / silver / bronze counters for dark backgrounds. `counts` is keyed by medal id. */
export function MedalTiles({
  counts,
  labels,
}: {
  counts: Record<string, number>;
  labels: Record<string, string>;
}) {
  return (
    <dl className="grid max-w-xl grid-cols-3 gap-3 text-center md:gap-4">
      {["gold", "silver", "bronze"].map((medal) => (
        <div
          key={medal}
          className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur md:p-6"
        >
          <dd className="text-4xl font-bold md:text-5xl">{counts[medal]}</dd>
          <dt className="mt-2 flex items-center justify-center gap-2 text-sm text-white/85">
            <span
              aria-hidden="true"
              className={`size-3 rounded-full ${medalDot[medal]}`}
            />
            {labels[medal]}
          </dt>
        </div>
      ))}
    </dl>
  );
}
