import type { Metadata } from "next";

import ClubOnboardingForm from "@/components/onboarding/ClubOnboardingForm";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Choose Your Favourite Club | UOM Football War Room",
  description: "Choose a favourite club for your supporter profile.",
};

type OnboardingClub = {
  id: string;
  name: string;
  crestUrl: string | null;
  country: string;
  competition: string;
};

// Temporary preview data; this will be replaced with Prisma data in the next step.
const previewClubs: OnboardingClub[] = [
  {
    id: "preview-arsenal",
    name: "Arsenal",
    crestUrl: "https://crests.football-data.org/57.png",
    country: "England",
    competition: "Premier League",
  },
  {
    id: "preview-chelsea",
    name: "Chelsea",
    crestUrl: "https://crests.football-data.org/61.png",
    country: "England",
    competition: "Premier League",
  },
  {
    id: "preview-liverpool",
    name: "Liverpool",
    crestUrl: "https://crests.football-data.org/64.png",
    country: "England",
    competition: "Premier League",
  },
  {
    id: "preview-manchester-city",
    name: "Manchester City",
    crestUrl: "https://crests.football-data.org/65.png",
    country: "England",
    competition: "Premier League",
  },
  {
    id: "preview-manchester-united",
    name: "Manchester United",
    crestUrl: "https://crests.football-data.org/66.png",
    country: "England",
    competition: "Premier League",
  },
  {
    id: "preview-tottenham-hotspur",
    name: "Tottenham Hotspur",
    crestUrl: "https://crests.football-data.org/73.png",
    country: "England",
    competition: "Premier League",
  },
  {
    id: "preview-newcastle-united",
    name: "Newcastle United",
    crestUrl: "https://crests.football-data.org/67.png",
    country: "England",
    competition: "Premier League",
  },
  {
    id: "preview-aston-villa",
    name: "Aston Villa",
    crestUrl: "https://crests.football-data.org/58.png",
    country: "England",
    competition: "Premier League",
  },
];

export default function ClubOnboardingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50">
        <section className="mx-auto max-w-7xl px-5 py-10 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">
              Supporter onboarding
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Choose Your Favourite Club
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Select the club you support. We’ll use it to personalise your
              profile, fixtures, and future War Room experience.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              You can change your favourite club later from your profile.
            </p>
          </div>

          <ol
            aria-label="Onboarding progress"
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3"
          >
            <ProgressStep number={1} label="Account created" complete />
            <ProgressDivider />
            <ProgressStep number={2} label="Email verified" complete />
            <ProgressDivider />
            <ProgressStep number={3} label="Choose club" current />
          </ol>

          <div className="mt-8 sm:mt-10">
            <ClubOnboardingForm clubs={previewClubs} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ProgressStep({
  number,
  label,
  complete = false,
  current = false,
}: {
  number: number;
  label: string;
  complete?: boolean;
  current?: boolean;
}) {
  return (
    <li
      aria-current={current ? "step" : undefined}
      className="flex items-center gap-3"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${
          complete || current
            ? "bg-green-700 text-white"
            : "bg-slate-200 text-slate-600"
        }`}
      >
        {complete ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="h-5 w-5 fill-none stroke-current"
          >
            <path
              d="m5 10 3 3 7-7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          number
        )}
      </span>
      <span
        className={`text-sm font-bold ${
          current ? "text-green-700" : "text-slate-800"
        }`}
      >
        {label}
      </span>
    </li>
  );
}

function ProgressDivider() {
  return (
    <li
      aria-hidden="true"
      className="ml-5 h-5 w-px bg-slate-300 sm:ml-0 sm:h-px sm:w-14"
    />
  );
}
