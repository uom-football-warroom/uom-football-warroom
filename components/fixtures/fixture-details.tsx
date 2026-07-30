"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FixtureHero from "@/components/fixtures/FixtureHero";
import HeadToHeadSection from "@/components/fixtures/HeadToHeadSection";
import LineupSection from "@/components/fixtures/LineupSection";
import MatchComparison from "@/components/fixtures/MatchComparison";
import OtherFixturesSection from "@/components/fixtures/OtherFixturesSection";
import StadiumCapacityCard from "@/components/fixtures/StadiumCapacityCard";
import type {
  ApiFixture,
  FixtureDetailsApiData,
  FixtureDetailsApiResponse,
  FixtureStatus,
} from "@/types/football";

type FixtureDetailsProps = {
  fixtureId: string;
};

export default function FixtureDetails({ fixtureId }: FixtureDetailsProps) {
  const [details, setDetails] = useState<FixtureDetailsApiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFixture() {
      try {
        const response = await fetch(
          `/api/fixtures/${encodeURIComponent(fixtureId)}`,
          {
            signal: controller.signal,
          },
        );
        const result = (await response.json()) as FixtureDetailsApiResponse;

        if (!response.ok || !result.success || !result.data) {
          setErrorStatus(response.status);
          return;
        }

        setDetails(result.data);
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

    void loadFixture();

    return () => controller.abort();
  }, [fixtureId]);

  if (isLoading) {
    return <StatePanel title="Loading fixture…" role="status" />;
  }

  if (errorStatus === 404) {
    return (
      <StatePanel
        title="Fixture not found"
        description="We could not find that fixture. Browse the fixture directory for upcoming matches."
      />
    );
  }

  if (errorStatus !== null || !details) {
    return (
      <StatePanel
        title="Unable to load fixture"
        description="The fixture could not be loaded right now. Please try again later."
        role="alert"
      />
    );
  }

  const {
    fixture,
    headToHead,
    headToHeadUnavailable,
    otherFixtures,
  } = details;

  return (
    <>
      <FixtureHero fixture={fixture} />

      <div className="mx-auto max-w-7xl space-y-12 px-5 py-10 lg:px-8 lg:py-14">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(17rem,0.8fr)_minmax(0,2fr)]">
          <div className="space-y-6">
            <MatchInformation fixture={fixture} />
            <StadiumCapacityCard fixture={fixture} />
          </div>
          <MatchComparison fixture={fixture} />
        </div>

        <HeadToHeadSection
          headToHead={headToHead}
          unavailable={headToHeadUnavailable}
          selectedHomeClub={fixture.homeClub}
          selectedAwayClub={fixture.awayClub}
        />
        <OtherFixturesSection
          competitionName={fixture.competition}
          matchday={fixture.matchday}
          otherFixtures={otherFixtures}
        />

        <LineupSection fixture={fixture} />

        <section aria-labelledby="upcoming-features-title">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-700">
              Coming later
            </p>
            <h2
              id="upcoming-features-title"
              className="mt-2 text-xl font-black text-slate-950"
            >
              Upcoming Features
            </h2>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <FeaturePlaceholder
              icon="◎"
              title="War Room"
              description="Live match discussion will be available in Phase 2."
              phase="Phase 2"
            />
            <FeaturePlaceholder
              icon="◇"
              title="Predictions"
              description="Virtual coin predictions will be available in Phase 3."
              phase="Phase 3"
            />
            <FeaturePlaceholder
              icon="✦"
              title="AI Match Insight"
              description="AI pre-match insight is planned for a later phase."
              phase="Planned"
            />
          </div>
        </section>
      </div>
    </>
  );
}

function MatchInformation({ fixture }: { fixture: ApiFixture }) {
  const kickoff = parseDate(fixture.startTime);
  const details = [
    ["Venue", fixture.venue || "Venue unavailable"],
    ["Competition", fixture.competition || "Competition unavailable"],
    ["Competition code", fixture.competitionCode || "Code unavailable"],
    [
      "Matchday",
      fixture.matchday ? `Matchday ${fixture.matchday}` : "Matchday unavailable",
    ],
    ["Kickoff date", kickoff ? formatDate(kickoff) : "Date unavailable"],
    ["Kickoff time", kickoff ? formatTime(kickoff) : "Time unavailable"],
    ["Status", displayStatus(fixture.status)],
    ["Referee", fixture.referee || "Referee unavailable"],
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xs font-black uppercase tracking-wider text-green-700">
        Match Information
      </h2>
      <dl className="mt-5 space-y-4">
        {details.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-5 text-sm">
            <dt className="text-slate-500">{label}</dt>
            <dd className="text-right font-semibold text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
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
          Fixture directory
        </p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">{title}</h1>
        {description && (
          <p className="mt-4 text-sm leading-6 text-slate-500">{description}</p>
        )}
        {title !== "Loading fixture…" && (
          <Link
            href="/fixtures"
            className="mt-7 inline-block rounded-md bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
          >
            Browse fixtures
          </Link>
        )}
      </div>
    </section>
  );
}

function FeaturePlaceholder({
  icon,
  title,
  description,
  phase,
}: {
  icon: string;
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-100 p-6 text-center text-slate-500">
      <span
        aria-hidden="true"
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-white text-xl text-slate-400"
      >
        {icon}
      </span>
      <h3 className="mt-4 font-black text-slate-700">{title}</h3>
      <p className="mt-2 text-sm leading-6">{description}</p>
      <span className="mt-4 inline-block rounded-full bg-slate-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wide">
        {phase}
      </span>
    </article>
  );
}

function parseDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date);
}

function displayStatus(status: FixtureStatus) {
  return status.charAt(0) + status.slice(1).toLocaleLowerCase();
}
