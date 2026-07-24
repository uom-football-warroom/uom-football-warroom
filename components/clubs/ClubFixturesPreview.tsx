import Image from "next/image";
import Link from "next/link";
import type { ApiClub, ApiFixture } from "@/types/football";

type ClubFixturesPreviewProps = {
  club: ApiClub;
  upcoming: ApiFixture[];
};

type RecentResultsProps = {
  club: ApiClub;
  completed: ApiFixture[];
};

function opponentFor(fixture: ApiFixture, clubId: string) {
  return fixture.homeClub.id === clubId
    ? fixture.awayClub
    : fixture.homeClub;
}

function resultFor(fixture: ApiFixture, clubId: string) {
  if (fixture.homeScore === null || fixture.awayScore === null) {
    return null;
  }

  const isHome = fixture.homeClub.id === clubId;
  const clubScore = isHome ? fixture.homeScore : fixture.awayScore;
  const opponentScore = isHome ? fixture.awayScore : fixture.homeScore;

  return {
    score: `${clubScore} - ${opponentScore}`,
    outcome: clubScore > opponentScore ? "W" : clubScore < opponentScore ? "L" : "D",
  } as const;
}

export default function ClubFixturesPreview({
  club,
  upcoming,
}: ClubFixturesPreviewProps) {
  const nextMatch = upcoming[0];
  const opponent = nextMatch ? opponentFor(nextMatch, club.id) : null;

  return (
      <aside id="fixtures" className="scroll-mt-24 space-y-5">
        {nextMatch ? (
          <div className="rounded-xl bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-green-400">
              Next Match
            </p>
            <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
              <div className="min-w-0">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-white p-2">
                    <ClubCrest club={club} />
                  </div>
                  <p className="mt-2 truncate text-[11px] font-bold uppercase">{club.name}</p>
              </div>
              <div>
                <p className="text-xl font-black">{formatTime(nextMatch.startTime)}</p>
                <p className="mt-1 max-w-24 text-[10px] uppercase text-slate-400">{formatDate(nextMatch.startTime)}</p>
              </div>
              {opponent && (
                <div className="min-w-0">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-white p-2">
                    <ClubCrest club={opponent} />
                  </div>
                  <p className="mt-2 truncate text-[11px] font-bold uppercase">{opponent.name}</p>
                </div>
              )}
            </div>
            <p className="mt-5 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-center text-xs text-slate-300">
              ⌖ {nextMatch.venue || "Venue unavailable"}
            </p>
            <Link href={`/fixtures/${nextMatch.id}`} className="mt-5 block rounded-md bg-green-500 px-4 py-3 text-center text-xs font-black uppercase text-slate-950 transition hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
              Match Center
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="font-bold text-slate-900">Next Match</h2>
            <p className="mt-2 text-sm text-slate-500">No upcoming matches are listed yet.</p>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Upcoming</h2>
          {upcoming.length ? (
            <ul className="mt-4 divide-y divide-slate-200">
              {upcoming.slice(0, 3).map((fixture) => (
                <li key={fixture.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-16 shrink-0 text-xs font-bold uppercase text-slate-500">{formatShortDate(fixture.startTime)}</div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-green-700">{fixture.competition}</p>
                    <p className="mt-1 truncate text-sm font-bold text-slate-900">vs {opponentFor(fixture, club.id).name}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No upcoming fixtures available.</p>
          )}
        </div>
      </aside>
  );
}

export function RecentResults({ club, completed }: RecentResultsProps) {
  return (
      <section id="results" className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-slate-950">Recent Results</h2>
          <Link href="/fixtures" className="text-xs font-bold uppercase tracking-wide text-green-700 hover:text-green-800">View all →</Link>
        </div>
        {completed.length ? (
          <ul className="mt-5 divide-y divide-slate-100">
            {completed.slice(0, 3).map((fixture) => {
              const opponent = opponentFor(fixture, club.id);
              const result = resultFor(fixture, club.id);
              return (
                <li key={fixture.id} className="grid grid-cols-[1fr_auto] items-center gap-4 py-4 sm:grid-cols-[9rem_1fr_auto]">
                  <p className="text-xs uppercase text-slate-500">{formatDate(fixture.startTime)}</p>
                  <p className="text-sm font-bold text-slate-900 sm:col-start-2">vs {opponent.name}</p>
                  {result && (
                    <div className="col-start-2 row-span-2 row-start-1 flex items-center gap-3 sm:col-start-3 sm:row-span-1">
                      <span className="font-black text-slate-950">{result.score}</span>
                      <span className={`flex h-6 w-6 items-center justify-center rounded text-xs font-black ${result.outcome === "W" ? "bg-green-100 text-green-700" : result.outcome === "L" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{result.outcome}</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No recent results are available.</p>
        )}
      </section>
  );
}

function ClubCrest({ club }: { club: ApiClub }) {
  const crestUrl = club.crestUrl?.trim() || null;
  const fallbackText =
    club.tla?.trim() || club.name.charAt(0).toUpperCase();

  return crestUrl ? (
    <Image
      src={crestUrl}
      alt={`${club.name} crest`}
      width={44}
      height={44}
      className="h-full w-full object-contain"
    />
  ) : (
    <span className="flex h-full w-full items-center justify-center rounded-md bg-green-50 text-xs font-black text-green-700">
      {fallbackText}
    </span>
  );
}

function parseDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value: string) {
  const date = parseDate(value);
  if (!date) return "Date unavailable";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatShortDate(value: string) {
  const date = parseDate(value);
  if (!date) return "TBC";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

function formatTime(value: string) {
  const date = parseDate(value);
  if (!date) return "TBC";

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date);
}
