import Image from "next/image";
import Link from "next/link";
import type { ApiClub, ApiFixture } from "@/types/football";

type OtherFixturesSectionProps = {
  competitionName: string;
  matchday: number | null;
  otherFixtures: ApiFixture[];
};

export default function OtherFixturesSection({
  competitionName,
  matchday,
  otherFixtures,
}: OtherFixturesSectionProps) {
  const heading = `Other ${competitionName} Fixtures${
    matchday !== null ? ` — Matchday ${matchday}` : ""
  }`;

  return (
    <section aria-labelledby="other-fixtures-title">
      <div className="flex items-end justify-between gap-4">
        <h2
          id="other-fixtures-title"
          className="text-xl font-black text-slate-950"
        >
          {heading}
        </h2>
        <Link
          href="/fixtures"
          className="shrink-0 text-xs font-bold text-green-700 hover:text-green-800"
        >
          View all →
        </Link>
      </div>

      {otherFixtures.length === 0 ? (
        <p className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm text-slate-500">
          No other fixtures are available for this matchday.
        </p>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {otherFixtures.map((fixture) => (
            <Link
              key={fixture.id}
              href={`/fixtures/${fixture.id}`}
              className="rounded-xl border border-slate-200 bg-white p-5 outline-none transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
            >
              <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase text-slate-500">
                <span>{formatDate(fixture.startTime)}</span>
                <span>{formatTime(fixture.startTime)}</span>
              </div>

              <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
                <Team club={fixture.homeClub} />
                <div>
                  <p className="font-black text-slate-950">
                    {fixture.status === "COMPLETED" &&
                    fixture.homeScore !== null &&
                    fixture.awayScore !== null
                      ? `${fixture.homeScore} - ${fixture.awayScore}`
                      : "VS"}
                  </p>
                  <span className="mt-1 block text-[10px] font-bold uppercase text-slate-400">
                    {fixture.status}
                  </span>
                </div>
                <Team club={fixture.awayClub} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function Team({ club }: { club: ApiClub }) {
  const crestUrl = club.crestUrl?.trim() || null;
  const fallbackText =
    club.tla?.trim() || club.name.charAt(0).toUpperCase();

  return (
    <div className="min-w-0">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 p-1">
        {crestUrl ? (
          <Image
            src={crestUrl}
            alt={`${club.name} crest`}
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
      <p className="mt-2 truncate text-xs font-bold text-slate-900">
        {club.name}
      </p>
    </div>
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
    timeZone: "UTC",
  }).format(date);
}

function formatTime(value: string) {
  const date = parseDate(value);
  if (!date) return "Time unavailable";

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date);
}
