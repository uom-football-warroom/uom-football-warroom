import type { ApiFixture } from "@/types/football";

export default function StadiumCapacityCard({ fixture }: { fixture: ApiFixture }) {
  const capacity =
    fixture.venue === fixture.homeClub.stadium
      ? fixture.homeClub.stadiumCapacity
      : undefined;

  return (
    <section className="relative overflow-hidden rounded-xl bg-slate-950 p-6 text-white shadow-sm">
      <span aria-hidden="true" className="absolute -bottom-5 -right-3 text-8xl text-white/5">◒</span>
      <p className="text-xs font-black uppercase tracking-wider text-green-400">Stadium Capacity</p>
      {capacity ? (
        <p className="mt-3 text-3xl font-black">{capacity.toLocaleString("en-US")}</p>
      ) : (
        <p className="mt-3 text-lg font-black">Capacity unavailable</p>
      )}
      <p className="mt-2 text-sm font-semibold text-slate-200">⌂ {fixture.venue || "Venue unavailable"}</p>
      <p className="mt-3 max-w-xs text-xs leading-5 text-slate-400">Expected to host a memorable matchday crowd of football supporters.</p>
    </section>
  );
}
