import Image from "next/image";
import type { ApiClub, ApiFixture } from "@/types/football";

export default function LineupSection({ fixture }: { fixture: ApiFixture }) {
  const message = getLineupMessage(fixture);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 bg-slate-950 px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-black">Squads &amp; Lineups</h2>
        {message && <p className="max-w-md rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs text-slate-300">ⓘ {message}</p>}
      </div>
      <div className="grid gap-8 p-6 md:grid-cols-2 sm:p-8">
        <TeamLineup club={fixture.homeClub} message={message} />
        <TeamLineup club={fixture.awayClub} message={message} />
      </div>
    </section>
  );
}

function TeamLineup({ club, message }: { club: ApiClub; message: string }) {
  const crestUrl = club.crestUrl?.trim() || null;
  const fallbackText =
    club.tla?.trim() || club.name.charAt(0).toUpperCase();

  return (
    <div>
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        {crestUrl ? (
          <Image src={crestUrl} alt={`${club.name} crest`} width={32} height={32} className="h-8 w-8 object-contain" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded bg-green-50 text-[10px] font-black text-green-700">
            {fallbackText}
          </span>
        )}
        <h3 className="font-bold text-slate-950">{club.name}</h3>
      </div>
      <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">{message}</div>
    </div>
  );
}

function getLineupMessage(fixture: ApiFixture) {
  if (fixture.status === "COMPLETED") return "Lineup information is unavailable for this fixture.";
  if (fixture.status === "LIVE") return "Lineups have not been announced yet.";

  const kickoff = new Date(fixture.startTime);
  if (
    !Number.isNaN(kickoff.getTime()) &&
    kickoff.getTime() - Date.now() <= 60 * 60 * 1000
  ) {
    return "Lineups have not been announced yet.";
  }

  return "Official starting lineups are typically released 60 minutes before kickoff.";
}
