"use client";

import { useMemo, useState } from "react";
import ClubCard from "@/components/clubs/ClubCard";
import type { ApiClub } from "@/types/football";

type ClubGridProps = {
  clubs: ApiClub[];
};

export default function ClubGrid({ clubs }: ClubGridProps) {
  const [query, setQuery] = useState("");
  const [competition, setCompetition] = useState("All");

  const competitions = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(clubs.map((club) => club.competition || "Competition unavailable")),
      ),
    ],
    [clubs],
  );

  const filteredClubs = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return clubs.filter((club) => {
      const matchesName = club.name.toLocaleLowerCase().includes(normalizedQuery);
      const matchesCompetition =
        competition === "All" ||
        (club.competition || "Competition unavailable") === competition;

      return matchesName && matchesCompetition;
    });
  }, [clubs, competition, query]);

  return (
    <div className="mt-8 sm:mt-10">
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <label htmlFor="club-search" className="sr-only">
          Search clubs by name
        </label>
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-slate-400"
          >
            <circle cx="8.5" cy="8.5" r="5.5" strokeWidth="1.7" />
            <path d="m13 13 4 4" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            id="club-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for your club..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/15"
          />
        </div>

        <fieldset className="mt-4">
          <legend className="sr-only">Filter clubs by competition</legend>
          <div className="flex flex-wrap gap-2">
            {competitions.map((item) => {
              const isActive = competition === item;

              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setCompetition(item)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold outline-none transition focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 ${
                    isActive
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {item === "All" ? "All Competitions" : item}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-slate-700" aria-live="polite">
          {filteredClubs.length} {filteredClubs.length === 1 ? "club" : "clubs"}
        </p>
        <p className="hidden text-xs text-slate-400 sm:block">
          Follow your favourite club
        </p>
      </div>

      {filteredClubs.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClubs.map((club) => (
            <ClubCard key={club.id} club={club} variant="directory" />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 fill-none stroke-current">
              <circle cx="8.5" cy="8.5" r="5.5" strokeWidth="1.7" />
              <path d="m13 13 4 4" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-bold text-slate-900">No clubs found</h2>
          <p className="mt-2 text-sm text-slate-500">
            Try another club name or choose a different competition.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCompetition("All");
            }}
            className="mt-5 rounded-md border border-green-600 px-4 py-2 text-xs font-bold text-green-700 outline-none transition hover:bg-green-50 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
