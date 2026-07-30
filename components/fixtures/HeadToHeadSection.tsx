import Image from "next/image";
import type {
  ApiClub,
  FixtureHeadToHeadItem,
  FixtureHeadToHeadTeam,
} from "@/types/football";

type HeadToHeadSectionProps = {
  headToHead: FixtureHeadToHeadItem[];
  unavailable: boolean;
  selectedHomeClub: ApiClub;
  selectedAwayClub: ApiClub;
};

export default function HeadToHeadSection({
  headToHead,
  unavailable,
  selectedHomeClub,
  selectedAwayClub,
}: HeadToHeadSectionProps) {
  return (
    <section aria-labelledby="head-to-head-title">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-green-700">
          Previous meetings
        </p>
        <h2
          id="head-to-head-title"
          className="mt-2 text-xl font-black text-slate-950"
        >
          Head-to-Head
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Recent meetings between {selectedHomeClub.name} and{" "}
          {selectedAwayClub.name}.
        </p>
      </div>

      {unavailable ? (
        <EmptyState>
          Head-to-head data is temporarily unavailable.
        </EmptyState>
      ) : headToHead.length === 0 ? (
        <EmptyState>
          No previous head-to-head matches are available.
        </EmptyState>
      ) : (
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <ul className="divide-y divide-slate-200">
            {headToHead.map((match) => (
              <li
                key={match.externalId}
                className="p-5 sm:grid sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-5 sm:p-6"
              >
                <div className="text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">
                    {formatMatchDate(match.utcDate)}
                  </p>
                  {match.competition.name && (
                    <p className="mt-1 truncate">{match.competition.name}</p>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:mt-0 sm:gap-5">
                  <Team team={match.homeTeam} />
                  <p className="min-w-14 text-center text-lg font-black text-slate-950">
                    {formatScore(match.homeScore, match.awayScore)}
                  </p>
                  <Team team={match.awayTeam} alignRight />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function Team({
  team,
  alignRight = false,
}: {
  team: FixtureHeadToHeadTeam;
  alignRight?: boolean;
}) {
  const crestUrl = team.crestUrl?.trim() || null;
  const fallbackText =
    team.tla?.trim() || team.name.charAt(0).toUpperCase();

  return (
    <div
      className={`flex min-w-0 items-center gap-3 ${
        alignRight ? "flex-row-reverse text-right" : ""
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-50 p-1.5">
        {crestUrl ? (
          <Image
            src={crestUrl}
            alt={`${team.name} crest`}
            width={36}
            height={36}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center rounded-md bg-green-50 text-[10px] font-black text-green-700">
            {fallbackText}
          </span>
        )}
      </div>
      <p className="truncate text-sm font-bold text-slate-900">{team.name}</p>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm text-slate-500">
      {children}
    </p>
  );
}

function formatScore(homeScore: number | null, awayScore: number | null) {
  return homeScore === null || awayScore === null
    ? "—"
    : `${homeScore} - ${awayScore}`;
}

function formatMatchDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
