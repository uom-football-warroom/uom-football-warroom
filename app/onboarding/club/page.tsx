import type { Metadata } from "next";
import { redirect } from "next/navigation";

import ClubOnboardingForm from "@/components/onboarding/ClubOnboardingForm";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Choose Your Favourite Club | UOM Football War Room",
  description: "Choose a favourite club for your supporter profile.",
};

function ClubDataStatus({
  heading,
  text,
}: {
  heading: string;
  text: string;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
      <h2 className="text-base font-bold text-slate-950">{heading}</h2>
      <p className="mt-2 text-sm text-slate-500">{text}</p>
    </section>
  );
}

export default async function ClubOnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login?next=/onboarding/club");
  }

  let clubData:
    | {
        clubs: {
          id: string;
          name: string;
          crestUrl: string | null;
          country: string;
          competition: string;
        }[];
        favouriteClubId: string | null;
      }
    | undefined;

  try {
    const [clubs, userProfile] = await Promise.all([
      prisma.club.findMany({
        select: {
          id: true,
          name: true,
          crestUrl: true,
          country: true,
          competition: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.userProfile.findUnique({
        where: {
          id: user.id,
        },
        select: {
          supportProfile: {
            select: {
              favouriteClubId: true,
            },
          },
        },
      }),
    ]);

    clubData = {
      clubs: clubs.map((club) => ({
        ...club,
        country: club.country ?? "",
        competition: club.competition ?? "",
      })),
      favouriteClubId:
        userProfile?.supportProfile?.favouriteClubId ?? null,
    };
  } catch (databaseError) {
    console.error("Failed to load club onboarding data", databaseError);
  }

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
            {!clubData ? (
              <ClubDataStatus
                heading="We couldn’t load the clubs"
                text="Club information is temporarily unavailable. Please try again later."
              />
            ) : clubData.clubs.length === 0 ? (
              <ClubDataStatus
                heading="No clubs are currently available"
                text="Club data has not been synchronised yet."
              />
            ) : (
              <ClubOnboardingForm
                clubs={clubData.clubs}
                initialSelectedClubId={clubData.favouriteClubId}
              />
            )}
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
