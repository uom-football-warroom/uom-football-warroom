"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type OnboardingClub = {
  id: string;
  name: string;
  crestUrl: string | null;
  country: string;
  competition: string;
};

type ClubOnboardingFormProps = {
  clubs: OnboardingClub[];
  initialSelectedClubId?: string | null;
};

function getValidCrestUrl(value: string | null) {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

export default function ClubOnboardingForm({
  clubs,
  initialSelectedClubId = null,
}: ClubOnboardingFormProps) {
  const [query, setQuery] = useState("");
  const [selectedCompetition, setSelectedCompetition] = useState("All");
  const [selectedClubId, setSelectedClubId] = useState<string | null>(
    initialSelectedClubId,
  );

  const competitions = useMemo(
    () => [
      "All",
      ...Array.from(new Set(clubs.map((club) => club.competition))).sort(),
    ],
    [clubs],
  );

  const filteredClubs = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return clubs.filter(
      (club) =>
        club.name.toLocaleLowerCase().includes(normalizedQuery) &&
        (selectedCompetition === "All" ||
          club.competition === selectedCompetition),
    );
  }, [clubs, query, selectedCompetition]);

  const selectedClub =
    clubs.find((club) => club.id === selectedClubId) ?? null;

  function handleContinue() {
    if (!selectedClub) return;

    /*
     * Persistence and navigation will be connected to
     * POST /api/profile/favourite-club in a later step.
     */
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <label htmlFor="onboarding-club-search" className="sr-only">
              Search clubs by name
            </label>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 fill-none stroke-slate-400"
            >
              <circle cx="8.5" cy="8.5" r="5.5" strokeWidth="1.7" />
              <path
                d="m13 13 4 4"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
            <input
              id="onboarding-club-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for your club..."
              className="h-12 w-full rounded-lg border border-slate-300 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-600/15"
            />
          </div>

          <fieldset>
            <legend className="sr-only">Filter clubs by competition</legend>
            <div className="flex flex-wrap gap-2">
              {competitions.map((competition) => {
                const isActive = selectedCompetition === competition;

                return (
                  <button
                    key={competition}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setSelectedCompetition(competition)}
                    className={`min-h-10 rounded-full border px-4 py-2 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 ${
                      isActive
                        ? "border-green-700 bg-green-700 text-white"
                        : "border-slate-300 bg-white text-slate-600 hover:border-green-400 hover:text-green-700"
                    }`}
                  >
                    {competition}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {filteredClubs.length > 0 ? (
          <div
            role="radiogroup"
            aria-label="Choose your favourite club"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {filteredClubs.map((club) => {
              const isSelected = selectedClubId === club.id;

              return (
                <button
                  key={club.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedClubId(club.id)}
                  className={`relative flex min-h-64 w-full flex-col items-center rounded-xl border p-5 text-center outline-none transition focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 ${
                    isSelected
                      ? "border-2 border-green-700 bg-green-50/70 shadow-sm"
                      : "border-slate-200 bg-white hover:border-green-300 hover:shadow-md"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                      isSelected
                        ? "border-green-700 bg-green-700 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        viewBox="0 0 20 20"
                        className="h-4 w-4 fill-none stroke-current"
                      >
                        <path
                          d="m5 10 3 3 7-7"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>

                  <ClubCrest club={club} size="large" />
                  <span className="mt-5 text-base font-bold text-slate-950">
                    {club.name}
                  </span>
                  {isSelected && (
                    <span className="mt-1 text-sm font-bold text-green-700">
                      Selected
                    </span>
                  )}
                  <span className="mt-2 text-sm text-slate-500">
                    {club.country} · {club.competition}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 px-5 py-16 text-center">
            <h2 className="text-base font-bold text-slate-950">
              No clubs found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Try another club name or change the competition filter.
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {selectedClub ? (
            <div className="flex min-w-0 items-center gap-4">
              <ClubCrest club={selectedClub} size="small" />
              <div className="min-w-0">
                <p className="truncate font-bold text-slate-950">
                  {selectedClub.name}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  This club will appear on your supporter profile.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm font-medium text-slate-600">
              Select one club to continue.
            </p>
          )}

          <button
            type="button"
            disabled={!selectedClub}
            onClick={handleContinue}
            className="flex min-h-12 w-full shrink-0 items-center justify-center gap-3 rounded-lg bg-green-700 px-6 py-3 text-sm font-bold text-white outline-none transition hover:bg-green-800 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 sm:w-auto"
          >
            Continue to Profile
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-5 w-5 fill-none stroke-current"
            >
              <path
                d="M4 10h12m-5-5 5 5-5 5"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

function ClubCrest({
  club,
  size,
}: {
  club: OnboardingClub;
  size: "small" | "large";
}) {
  const crestUrl = getValidCrestUrl(club.crestUrl);
  const isSmall = size === "small";

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 ${
        isSmall ? "h-14 w-14 p-2" : "mt-5 h-24 w-24 p-3"
      }`}
    >
      {crestUrl ? (
        <Image
          src={crestUrl}
          alt={`${club.name} crest`}
          width={isSmall ? 40 : 72}
          height={isSmall ? 40 : 72}
          className="h-full w-full object-contain"
        />
      ) : (
        <span
          aria-label={`${club.name} crest unavailable`}
          className={`font-black text-green-700 ${
            isSmall ? "text-sm" : "text-xl"
          }`}
        >
          {getInitials(club.name)}
        </span>
      )}
    </span>
  );
}
