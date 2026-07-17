import Image from "next/image";
import Link from "next/link";

import ClubCard from "@/components/clubs/ClubCard";
import FixtureCard from "@/components/fixtures/FixtureCard";
import FeatureCard from "@/components/home/FeatureCard";
import HeroSection from "@/components/home/HeroSection";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { clubs, fixtures } from "@/lib/mock-data";

const competitions = [
  { name: "Premier League", logo: "/images/competitions/premier-league.svg" },
  { name: "La Liga", logo: "/images/competitions/la-liga.svg" },
  { name: "Serie A", logo: "/images/competitions/serie-a.svg" },
  { name: "Bundesliga", logo: "/images/competitions/bundesliga.svg" },
  { name: "Ligue 1", logo: "/images/competitions/ligue-1.svg" },
  {
    name: "Champions League",
    logo: "/images/competitions/champions-league.svg",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="bg-slate-50">
        <HeroSection />

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHeader
            eyebrow="Hot Fixtures"
            title="Featured Fixtures"
            description="Follow upcoming matches from major football competitions around the world."
            href="/fixtures"
            linkText="View All Matches"
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {fixtures.map((fixture) => (
              <FixtureCard key={fixture.id} fixture={fixture} />
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-5 py-8 sm:grid-cols-3 lg:grid-cols-6 lg:px-8">
            {competitions.map((competition) => (
              <div
                key={competition.name}
                className="text-center text-xs font-bold uppercase tracking-wide text-slate-400"
              >
                <div className="mx-auto mb-3 flex h-16 w-full max-w-28 items-center justify-center rounded-lg bg-slate-50 px-3 py-2">
                  <Image
                    src={competition.logo}
                    alt={`${competition.name} logo`}
                    width={96}
                    height={52}
                    className="h-full w-full object-contain"
                  />
                </div>

                {competition.name}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="text-center">
            <span className="rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-green-600">
              Fan Favourites
            </span>

            <h2 className="mt-6 text-3xl font-black uppercase text-slate-900">
              Popular Clubs
            </h2>

            <div className="mx-auto mt-3 h-1 w-16 bg-green-500" />

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-500">
              Discover popular international football clubs and choose the team
              you support.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        </section>

        <section className="bg-slate-950">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8">
            <div>
              <h2 className="text-4xl font-black uppercase leading-tight text-white">
                Choose Your Favourite Club.
                <span className="block italic text-green-400">
                  Show Your Support.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300">
                Select the club you support to personalize your profile,
                discover relevant fixtures and represent your team across the
                UOM Football War Room community.
              </p>

              <ul className="mt-7 space-y-3 text-sm text-slate-300">
                {[
                  "Personalized fixture updates",
                  "Favourite club displayed on your profile",
                  "Access to club supporter communities",
                  "Matchday War Rooms coming in Phase 2",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                      ✓
                    </span>

                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/clubs"
                className="mt-9 inline-block rounded-md bg-green-500 px-6 py-3 text-sm font-bold uppercase text-white transition hover:bg-green-600"
              >
                Choose My Club
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                ["📅", "Upcoming Fixtures"],
                ["🏆", "Latest Results"],
                ["👥", "Club Supporters"],
                ["💬", "Matchday Community"],
              ].map(([icon, label]) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/5 p-7 text-center"
                >
                  <div className="text-3xl">{icon}</div>
                  <p className="mt-4 text-sm font-bold text-white">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-600">
              Platform Features
            </p>

            <h2 className="mt-3 text-3xl font-black uppercase text-slate-900">
              Built for Football Supporters
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon="🌍"
              title="Discover International Clubs"
              description="Explore professional football clubs from leading leagues and international competitions."
            />

            <FeatureCard
              icon="📅"
              title="Follow Upcoming Fixtures"
              description="View scheduled matches, kickoff times, competitions and completed results."
            />

            <FeatureCard
              icon="💬"
              title="Join Matchday War Rooms"
              description="Discuss live matches with supporters inside dedicated match rooms."
              comingSoon
            />
          </div>
        </section>

        <section className="px-5 pb-20 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-2xl bg-green-500 px-6 py-16 text-center shadow-xl shadow-green-200 sm:px-12">
            <h2 className="text-3xl font-black uppercase text-white sm:text-4xl">
              Join Football Fans
              <span className="block">Around the World</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-green-50">
              Create your account, choose your favourite club, follow upcoming
              fixtures and get ready for matchday.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="rounded-md bg-slate-950 px-6 py-3 text-sm font-bold uppercase text-white transition hover:bg-slate-800"
              >
                Create Account
              </Link>

              <Link
                href="/login"
                className="rounded-md border border-white/40 px-6 py-3 text-sm font-bold uppercase text-white transition hover:bg-white/10"
              >
                Log In
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  linkText: string;
};

function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkText,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div className="border-l-2 border-green-500 pl-4">
        <p className="text-xs font-bold uppercase tracking-widest text-green-600">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-3xl font-black uppercase text-slate-900">
          {title}
        </h2>

        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </div>

      <Link
        href={href}
        className="text-xs font-bold uppercase tracking-wide text-green-600 hover:text-green-700"
      >
        {linkText} →
      </Link>
    </div>
  );
}
