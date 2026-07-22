"use client";

import { useMemo, useState } from "react";
import FixtureCard from "@/components/fixtures/FixtureCard";
import type { Fixture } from "@/types/football";

type FixtureDirectoryProps = {
  fixtures: Fixture[];
};

type StatusFilter = "SCHEDULED" | "LIVE" | "COMPLETED" | "ALL";

const tabs: Array<{ label: string; value: StatusFilter }> = [
  { label: "Upcoming", value: "SCHEDULED" },
  { label: "Live", value: "LIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "All", value: "ALL" },
];

export default function FixtureDirectory({ fixtures }: FixtureDirectoryProps) {
  const [status, setStatus] = useState<StatusFilter>("SCHEDULED");
  const [competition, setCompetition] = useState("ALL");
  const [teamQuery, setTeamQuery] = useState("");
  const [date, setDate] = useState("");

  const competitions = useMemo(
    () => Array.from(new Set(fixtures.map((fixture) => fixture.competition))),
    [fixtures],
  );

  const filteredFixtures = useMemo(() => {
    const normalizedTeam = teamQuery.trim().toLocaleLowerCase();

    return fixtures.filter((fixture) => {
      const matchesStatus =
        status === "ALL" ||
        (status === "SCHEDULED"
          ? fixture.status === "SCHEDULED" ||
            fixture.status === "POSTPONED" ||
            fixture.status === "CANCELLED"
          : fixture.status === status);
      const matchesCompetition =
        competition === "ALL" || fixture.competition === competition;
      const matchesTeam =
        !normalizedTeam ||
        fixture.homeClub.name.toLocaleLowerCase().includes(normalizedTeam) ||
        fixture.awayClub.name.toLocaleLowerCase().includes(normalizedTeam);
      const matchesDate = !date || fixture.dateISO === date;

      return matchesStatus && matchesCompetition && matchesTeam && matchesDate;
    });
  }, [competition, date, fixtures, status, teamQuery]);

  const groupedFixtures = useMemo(() => {
    const groups = new Map<string, Fixture[]>();

    filteredFixtures.forEach((fixture) => {
      const key = fixture.dateISO ?? fixture.date;
      groups.set(key, [...(groups.get(key) ?? []), fixture]);
    });

    return Array.from(groups.entries());
  }, [filteredFixtures]);

  function resetFilters() {
    setStatus("SCHEDULED");
    setCompetition("ALL");
    setTeamQuery("");
    setDate("");
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      <div role="tablist" aria-label="Fixture status" className="flex gap-7 overflow-x-auto border-b border-slate-300 sm:gap-12">
        {tabs.map((tab) => {
          const isActive = status === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setStatus(tab.value)}
              className={`shrink-0 border-b-2 px-2 py-4 text-xs font-bold uppercase tracking-wider outline-none transition focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-inset ${isActive ? "border-green-600 text-green-700" : "border-transparent text-slate-600 hover:border-green-300 hover:text-green-700"}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 rounded-xl border border-slate-200 bg-slate-100/70 p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[1fr_1.15fr_1fr_1fr_auto] lg:items-end lg:p-5">
        <FilterField label="Competition" id="competition-filter">
          <select id="competition-filter" value={competition} onChange={(event) => setCompetition(event.target.value)} className={controlStyles}>
            <option value="ALL">All competitions</option>
            {competitions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </FilterField>

        <FilterField label="Club or team" id="team-filter">
          <input id="team-filter" type="search" value={teamQuery} onChange={(event) => setTeamQuery(event.target.value)} placeholder="Search teams" className={controlStyles} />
        </FilterField>

        <FilterField label="Date" id="date-filter">
          <input id="date-filter" type="date" value={date} onChange={(event) => setDate(event.target.value)} className={controlStyles} />
        </FilterField>

        <FilterField label="Match status" id="status-filter">
          <select id="status-filter" value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} className={controlStyles}>
            <option value="ALL">Any status</option>
            <option value="SCHEDULED">Upcoming</option>
            <option value="LIVE">Live</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </FilterField>

        <button type="button" onClick={resetFilters} className="h-[46px] rounded-md border border-slate-400 bg-white px-5 text-xs font-bold text-slate-800 outline-none transition hover:border-green-600 hover:text-green-700 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 sm:col-span-2 lg:col-span-1">
          ↻ Reset Filters
        </button>
      </div>

      <p className="mt-6 text-sm font-semibold text-slate-600" aria-live="polite">
        {filteredFixtures.length} {filteredFixtures.length === 1 ? "fixture" : "fixtures"}
      </p>

      {groupedFixtures.length ? (
        <div className="mt-3 space-y-10">
          {groupedFixtures.map(([groupDate, groupFixtures]) => (
            <section key={groupDate}>
              <div className="flex items-center gap-4">
                <h2 className="shrink-0 text-lg font-black text-slate-950 sm:text-xl">{formatDate(groupDate, groupFixtures[0].date)}</h2>
                <div className="h-px flex-1 bg-slate-300" />
              </div>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                {groupFixtures.map((fixture) => <FixtureCard key={fixture.id} fixture={fixture} variant="directory" />)}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">○</div>
          <h2 className="mt-4 text-lg font-black text-slate-950">No fixtures found</h2>
          <p className="mt-2 text-sm text-slate-500">No fixtures match your selected filters.</p>
          <button type="button" onClick={resetFilters} className="mt-5 rounded-md border border-green-600 px-4 py-2 text-xs font-bold text-green-700 outline-none transition hover:bg-green-50 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2">Reset Filters</button>
        </div>
      )}
    </section>
  );
}

const controlStyles =
  "h-[46px] w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition hover:border-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/15";

function FilterField({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-slate-600">{label}</label>
      {children}
    </div>
  );
}

function formatDate(value: string, fallback: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return fallback;

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}
