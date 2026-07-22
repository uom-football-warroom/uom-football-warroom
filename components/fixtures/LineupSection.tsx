import Image from "next/image";
import type { Fixture, Lineup } from "@/types/football";

export default function LineupSection({ fixture }: { fixture: Fixture }) {
  const message = getLineupMessage(fixture);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 bg-slate-950 px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-black">Squads &amp; Lineups</h2>
        {message && <p className="max-w-md rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs text-slate-300">ⓘ {message}</p>}
      </div>
      <div className="grid gap-8 p-6 md:grid-cols-2 sm:p-8">
        <TeamLineup clubName={fixture.homeClub.name} logo={fixture.homeClub.logo} lineup={fixture.homeLineup} message={message} />
        <TeamLineup clubName={fixture.awayClub.name} logo={fixture.awayClub.logo} lineup={fixture.awayLineup} message={message} />
      </div>
    </section>
  );
}

function TeamLineup({ clubName, logo, lineup, message }: { clubName: string; logo: string; lineup?: Lineup; message: string | null }) {
  return (
    <div>
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <Image src={logo} alt={`${clubName} crest`} width={32} height={32} className="h-8 w-8 object-contain" />
        <h3 className="font-bold text-slate-950">{clubName}</h3>
      </div>
      {lineup?.starting.length ? (
        <>
          <h4 className="mt-5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Starting XI</h4>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {lineup.starting.map((player, index) => <li key={`${player}-${index}`} className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700"><span className="mr-2 text-slate-400">{index + 1}</span>{player}</li>)}
          </ol>
          {lineup.substitutes?.length ? (
            <>
              <h4 className="mt-5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Substitutes</h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">{lineup.substitutes.join(", ")}</p>
            </>
          ) : null}
        </>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">{message}</div>
      )}
    </div>
  );
}

function getLineupMessage(fixture: Fixture) {
  if (fixture.homeLineup?.starting.length && fixture.awayLineup?.starting.length) return null;
  if (fixture.status === "COMPLETED") return "Lineup information is unavailable for this fixture.";
  if (fixture.status === "LIVE") return "Lineups have not been announced yet.";

  if (fixture.dateISO) {
    const kickoff = new Date(`${fixture.dateISO}T${fixture.time}:00`);
    if (kickoff.getTime() - Date.now() <= 60 * 60 * 1000) {
      return "Lineups have not been announced yet.";
    }
  }

  return "Official starting lineups are typically released 60 minutes before kickoff.";
}
