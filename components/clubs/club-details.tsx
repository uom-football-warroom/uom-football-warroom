"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import ClubFixturesPreview, {
  RecentResults,
} from "@/components/clubs/ClubFixturesPreview";
import ClubHero from "@/components/clubs/ClubHero";
import type {
  ApiClubDetails,
  ApiFixture,
  ClubDetailsApiResponse,
} from "@/types/football";

type ClubDetailsProps = {
  clubId: string;
};

export default function ClubDetails({ clubId }: ClubDetailsProps) {
  const [club, setClub] = useState<ApiClubDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadClub() {
      try {
        const response = await fetch(
          `/api/clubs/${encodeURIComponent(clubId)}`,
          {
            signal: controller.signal,
          },
        );
        const result = (await response.json()) as ClubDetailsApiResponse;

        if (!response.ok || !result.success || !result.data) {
          setErrorStatus(response.status);
          return;
        }

        setClub(result.data);
      } catch (fetchError) {
        if (
          fetchError instanceof DOMException &&
          fetchError.name === "AbortError"
        ) {
          return;
        }

        setErrorStatus(500);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadClub();

    return () => controller.abort();
  }, [clubId]);

  const fixtures = useMemo<ApiFixture[]>(() => {
    if (!club) return [];

    return [
      ...club.homeFixtures.map((fixture) => ({
        ...fixture,
        homeClub: club,
        awayClub: fixture.awayClub,
      })),
      ...club.awayFixtures.map((fixture) => ({
        ...fixture,
        homeClub: fixture.homeClub,
        awayClub: club,
      })),
    ].sort(
      (first, second) =>
        safeTimestamp(first.startTime) - safeTimestamp(second.startTime),
    );
  }, [club]);

  if (isLoading) {
    return <StatePanel title="Loading club…" role="status" />;
  }

  if (errorStatus === 404) {
    return (
      <StatePanel
        title="Club not found"
        description="We could not find that club. Explore the directory to discover available clubs."
      />
    );
  }

  if (errorStatus !== null || !club) {
    return (
      <StatePanel
        title="Unable to load club"
        description="The club could not be loaded right now. Please try again later."
        role="alert"
      />
    );
  }

  const upcoming = fixtures.filter(
    (fixture) => fixture.status === "SCHEDULED" || fixture.status === "LIVE",
  );
  const completed = club.recentResults;
  const recentForm = completed.flatMap((fixture) => {
    if (fixture.homeScore === null || fixture.awayScore === null) return [];

    const isHome = fixture.homeClub.id === club.id;
    const clubScore = isHome ? fixture.homeScore : fixture.awayScore;
    const opponentScore = isHome ? fixture.awayScore : fixture.homeScore;
    return [clubScore > opponentScore ? "W" : clubScore < opponentScore ? "L" : "D"];
  }) as Array<"W" | "D" | "L">;

  const stats = [
    recentForm.length
      ? { label: "Recent form", content: <Form form={recentForm} /> }
      : null,
    {
      label: "Stadium",
      content: club.stadium || "Stadium unavailable",
    },
    {
      label: "Founded",
      content: club.founded?.toString() || "Year unavailable",
    },
  ].filter(Boolean) as Array<{ label: string; content: ReactNode }>;

  const competition = club.competition || "Competition unavailable";
  const country = club.country || "Country unavailable";

  return (
    <>
      <ClubHero club={club} />

      <section aria-label="Club statistics" className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:grid-cols-2 lg:grid-cols-[repeat(2,minmax(0,1fr))_1.7fr] lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>
              <div className="mt-1 text-xl font-black text-slate-950">
                {stat.content}
              </div>
            </div>
          ))}
          <Link
            href="/login"
            className="flex items-center justify-center gap-3 rounded-lg border border-green-500 px-5 py-4 text-center text-xs font-black uppercase tracking-wide text-green-700 outline-none transition hover:bg-green-50 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 sm:col-span-2 lg:col-span-1"
          >
            <span aria-hidden="true" className="text-2xl">♡</span>
            <span>Log in to choose favourite</span>
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 lg:px-8 lg:pb-20">
        <nav aria-label="Club sections" className="border-b border-slate-300">
          <div className="flex gap-7 overflow-x-auto sm:gap-12">
            {[
              ["Overview", "#overview"],
              ["Fixtures", "#fixtures"],
              ["Results", "#results"],
              ["Supporters", "#supporters"],
            ].map(([label, href], index) => (
              <a key={label} href={href} className={`shrink-0 border-b-2 px-2 py-4 text-xs font-bold uppercase tracking-wider outline-none transition focus-visible:text-green-700 ${index === 0 ? "border-green-600 text-green-700" : "border-transparent text-slate-600 hover:border-green-300 hover:text-green-700"}`}>
                {label}
              </a>
            ))}
          </div>
        </nav>

        <div className="mt-8 grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
          <div className="space-y-5">
            <section id="overview" className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-black text-slate-950">About {club.name}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {club.shortName || club.name} competes in {competition}, with a
                supporter community in {country} and around the world.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Manager: {club.manager || "Manager unavailable"}.
              </p>

              <div className="mt-7 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-2">
                <InfoBlock
                  icon="◷"
                  title="Club heritage"
                  text={club.founded ? `Part of the football community since ${club.founded}.` : `A proud member of ${competition}.`}
                />
                <InfoBlock
                  icon="⌂"
                  title="Home ground"
                  text={`${club.stadium || "Stadium unavailable"} · ${club.stadiumCapacity ? `${club.stadiumCapacity.toLocaleString("en-US")} capacity` : "Capacity unavailable"}`}
                />
              </div>

              {club.websiteUrl && (
                <a
                  href={club.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block text-sm font-bold text-green-700 hover:text-green-800"
                >
                  Visit club website →
                </a>
              )}
            </section>

            <RecentResults club={club} completed={completed} />
          </div>

          <div className="space-y-5 lg:row-start-1">
            <ClubFixturesPreview club={club} upcoming={upcoming} />
          </div>
        </div>

        <section id="supporters" className="mt-5 scroll-mt-24 rounded-xl border border-green-200 bg-green-50 p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-700">Supporter community</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">Follow {club.name}</h2>
            <p className="mt-2 text-sm text-slate-600">Choose this club as your favourite and join fellow supporters.</p>
          </div>
          <Link href="/login" className="mt-5 inline-block rounded-md bg-green-600 px-5 py-3 text-xs font-black uppercase text-white transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 sm:mt-0">
            Log in to choose favourite
          </Link>
        </section>
      </div>
    </>
  );
}

function StatePanel({
  title,
  description,
  role,
}: {
  title: string;
  description?: string;
  role?: "alert" | "status";
}) {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-5 py-20 text-center">
      <div className="max-w-md" role={role}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600">
          Club directory
        </p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">{title}</h1>
        {description && (
          <p className="mt-4 text-sm leading-6 text-slate-500">{description}</p>
        )}
        {title !== "Loading club…" && (
          <Link href="/clubs" className="mt-7 inline-block rounded-md bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2">
            Explore clubs
          </Link>
        )}
      </div>
    </section>
  );
}

function Form({ form }: { form: Array<"W" | "D" | "L"> }) {
  return (
    <span className="flex gap-1.5" aria-label={`Recent form: ${form.join(", ")}`}>
      {form.map((result, index) => (
        <span key={`${result}-${index}`} aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${result === "W" ? "bg-green-500" : result === "L" ? "bg-red-400" : "bg-slate-400"}`} />
      ))}
    </span>
  );
}

function InfoBlock({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-green-50 font-bold text-green-700">{icon}</span>
      <div>
        <h3 className="text-sm font-bold text-slate-950">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}

function safeTimestamp(value: string) {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
}
