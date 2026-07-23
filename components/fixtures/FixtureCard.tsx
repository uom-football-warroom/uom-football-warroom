import Image from "next/image";
import Link from "next/link";
import type { ApiClub, ApiFixture, Fixture } from "@/types/football";

type FixtureCardProps =
  | { fixture: Fixture; variant?: "compact" }
  | { fixture: ApiFixture; variant: "directory" };

export default function FixtureCard(props: FixtureCardProps) {
  if (props.variant === "directory") {
    return <DirectoryFixtureCard fixture={props.fixture} />;
  }

  const fixture = props.fixture;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
          {fixture.competition}
        </span>

        <span className="text-xs text-slate-400">{fixture.venue}</span>
      </div>

      <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <Team
          code={fixture.homeClub.code}
          logo={fixture.homeClub.logo}
          name={fixture.homeClub.name}
        />

        <div className="text-center">
          <p className="text-xs font-medium text-slate-400">VS</p>
          <p className="mt-1 rounded bg-green-50 px-3 py-1 text-sm font-black text-green-600">
            {fixture.time}
          </p>
        </div>

        <Team
          code={fixture.awayClub.code}
          logo={fixture.awayClub.logo}
          name={fixture.awayClub.name}
        />
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        {fixture.date}
      </p>

      <Link
        href={`/fixtures/${fixture.id}`}
        className="mt-5 block border-t border-slate-100 pt-4 text-center text-xs font-bold uppercase tracking-wide text-slate-800 transition hover:text-green-600"
      >
        View Match
      </Link>
    </article>
  );
}

function DirectoryFixtureCard({ fixture }: { fixture: ApiFixture }) {
  const hasScore =
    fixture.homeScore !== null && fixture.awayScore !== null;
  const isLive = fixture.status === "LIVE";
  const isInactive =
    fixture.status === "POSTPONED" || fixture.status === "CANCELLED";

  return (
    <article className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="flex min-w-0 items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">
          <span aria-hidden="true" className="text-green-700">◉</span>
          <span className="truncate">{fixture.competition}</span>
        </p>
        <StatusBadge fixture={fixture} />
      </div>

      <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
        <DirectoryTeam club={fixture.homeClub} />
        <div className="min-w-16 text-center">
          {hasScore ? (
            <>
              <p className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {fixture.homeScore} - {fixture.awayScore}
              </p>
              <p className={`mt-1 text-[10px] font-bold uppercase ${isLive ? "text-red-600" : "text-slate-400"}`}>
                {fixture.status === "COMPLETED" ? "Full time" : fixture.status}
              </p>
            </>
          ) : (
            <p className={`text-xl font-black ${isInactive ? "text-slate-400" : "text-green-700"}`}>
              {isInactive ? "TBC" : formatFixtureTime(fixture.startTime)}
            </p>
          )}
        </div>
        <DirectoryTeam club={fixture.awayClub} />
      </div>

      <div className="mt-7 flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
        <p className="min-w-0 truncate text-xs text-slate-500">
          ⌖ {fixture.venue || "Venue unavailable"}
        </p>
        <Link
          href={`/fixtures/${fixture.id}`}
          className="shrink-0 text-xs font-bold text-green-700 outline-none transition hover:text-green-800 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
        >
          View Match →
        </Link>
      </div>
    </article>
  );
}

function StatusBadge({ fixture }: { fixture: ApiFixture }) {
  const styles = {
    SCHEDULED: "bg-slate-100 text-slate-600",
    LIVE: "bg-red-100 text-red-700",
    COMPLETED: "bg-green-50 text-green-700",
    POSTPONED: "bg-slate-200 text-slate-500",
    CANCELLED: "bg-slate-200 text-slate-500",
  }[fixture.status];

  return (
    <span className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${styles}`}>
      {fixture.status === "LIVE" && <span aria-hidden="true">● </span>}
      {fixture.status}
    </span>
  );
}

function DirectoryTeam({ club }: { club: ApiClub }) {
  const crestUrl = club.crestUrl?.trim();
  const fallbackText =
    club.tla?.trim() || club.name.charAt(0).toUpperCase();

  return (
    <div className="min-w-0 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-slate-50 p-2.5 sm:h-20 sm:w-20">
        {crestUrl ? (
          <Image
            src={crestUrl}
            alt={`${club.name} crest`}
            width={64}
            height={64}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center rounded-lg bg-green-50 text-sm font-black text-green-700 sm:text-base">
            {fallbackText}
          </span>
        )}
      </div>
      <p className="mt-3 truncate text-sm font-black text-slate-950 sm:text-base">{club.name}</p>
    </div>
  );
}

function formatFixtureTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time unavailable";

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date);
}

type TeamProps = {
  code: string;
  logo: string;
  name: string;
};

function Team({ code, logo, name }: TeamProps) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-2">
        <Image
          src={logo}
          alt={`${name} crest`}
          width={44}
          height={44}
          className="h-full w-full object-contain"
        />
      </div>

      <p className="mt-3 text-xs font-bold text-slate-800" title={code}>
        {name}
      </p>
    </div>
  );
}
