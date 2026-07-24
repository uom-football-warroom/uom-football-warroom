import Image from "next/image";
import Link from "next/link";
import type { ApiClub, ApiFixture } from "@/types/football";

export default function FixtureHero({ fixture }: { fixture: ApiFixture }) {
  const hasScore =
    fixture.homeScore !== null && fixture.awayScore !== null;

  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      <Image
        src="/images/stadium.png"
        alt="Football stadium"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/75 to-slate-950" />

      <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-8 sm:pb-16 lg:px-8">
        <Link
          href="/fixtures"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 outline-none transition hover:text-green-400 focus-visible:ring-2 focus-visible:ring-green-400"
        >
          ← Back to fixtures
        </Link>

        <div className="mt-7 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider">
            <span className="text-green-400">
              {fixture.competition || "Competition unavailable"}
            </span>
            <span className="text-slate-500">•</span>
            <Status fixture={fixture} />
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            {fixture.venue || "Venue unavailable"}
          </h1>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            {formatFixtureDate(fixture.startTime)} • {formatFixtureTime(fixture.startTime)}
          </p>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-10">
            <HeroTeam club={fixture.homeClub} />
            <div className="min-w-16 text-center">
              {hasScore ? (
                <>
                  <p className="text-4xl font-black tracking-tight sm:text-6xl">
                    {fixture.homeScore} - {fixture.awayScore}
                  </p>
                  <p className={`mt-2 text-xs font-bold uppercase ${fixture.status === "LIVE" ? "text-red-400" : "text-slate-400"}`}>
                    {fixture.status === "COMPLETED" ? "Full time" : fixture.status}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-4xl font-black uppercase text-green-400 sm:text-6xl">-</p>
                  <p className="mt-2 text-xs font-bold uppercase text-slate-400">Kickoff {formatFixtureTime(fixture.startTime)}</p>
                </>
              )}
            </div>
            <HeroTeam club={fixture.awayClub} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroTeam({ club }: { club: ApiClub }) {
  const crestUrl = club.crestUrl?.trim() || null;
  const fallbackText =
    club.tla?.trim() || club.name.charAt(0).toUpperCase();

  return (
    <div className="min-w-0 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur sm:h-36 sm:w-36 sm:p-6">
        {crestUrl ? (
          <Image
            src={crestUrl}
            alt={`${club.name} crest`}
            width={112}
            height={112}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center rounded-lg bg-white text-xl font-black text-green-700 sm:text-3xl">
            {fallbackText}
          </span>
        )}
      </div>
      <Link
        href={`/clubs/${club.id}`}
        className="mt-4 block truncate text-base font-black outline-none transition hover:text-green-400 focus-visible:ring-2 focus-visible:ring-green-400 sm:text-xl"
      >
        {club.name}
      </Link>
    </div>
  );
}

function Status({ fixture }: { fixture: ApiFixture }) {
  const isLive = fixture.status === "LIVE";
  return (
    <span className={isLive ? "text-red-400" : "text-slate-300"}>
      {isLive && <span aria-hidden="true">● </span>}
      {fixture.status}
    </span>
  );
}

function formatFixtureDate(value: string) {
  const date = parseDate(value);
  if (!date) return "Date unavailable";

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatFixtureTime(value: string) {
  const date = parseDate(value);
  if (!date) return "Time unavailable";

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date);
}

function parseDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
