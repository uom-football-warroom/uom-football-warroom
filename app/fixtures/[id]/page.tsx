import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FixtureHero from "@/components/fixtures/FixtureHero";
import LineupSection from "@/components/fixtures/LineupSection";
import MatchComparison from "@/components/fixtures/MatchComparison";
import RelatedFixtures from "@/components/fixtures/RelatedFixtures";
import StadiumCapacityCard from "@/components/fixtures/StadiumCapacityCard";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { findFixtureById, fixtures } from "@/lib/mock-data";
import type { Fixture } from "@/types/football";

type FixturePageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return fixtures.map((fixture) => ({ id: fixture.id }));
}

export async function generateMetadata({ params }: FixturePageProps): Promise<Metadata> {
  const { id } = await params;
  const fixture = findFixtureById(id);

  return fixture
    ? {
        title: `${fixture.homeClub.name} vs ${fixture.awayClub.name} | UOM Football War Room`,
        description: `Fixture details for ${fixture.homeClub.name} vs ${fixture.awayClub.name} in the ${fixture.competition}.`,
      }
    : { title: "Fixture not found | UOM Football War Room" };
}

export default async function FixturePage({ params }: FixturePageProps) {
  const { id } = await params;
  const fixture = findFixtureById(id);

  if (!fixture) notFound();

  const relatedFixtures = getRelatedFixtures(fixture);

  return (
    <>
      <Navbar />
      <main className="bg-slate-50">
        <FixtureHero fixture={fixture} />

        <div className="mx-auto max-w-7xl space-y-12 px-5 py-10 lg:px-8 lg:py-14">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(17rem,0.8fr)_minmax(0,2fr)]">
            <div className="space-y-6">
              <MatchInformation fixture={fixture} />
              <StadiumCapacityCard fixture={fixture} />
            </div>
            <MatchComparison fixture={fixture} />
          </div>

          <LineupSection fixture={fixture} />
          <RelatedFixtures fixtures={relatedFixtures} competition={fixture.competition} />

          <section aria-labelledby="upcoming-features-title">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-700">Coming later</p>
              <h2 id="upcoming-features-title" className="mt-2 text-xl font-black text-slate-950">Upcoming Features</h2>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <FeaturePlaceholder icon="◎" title="War Room" description="Live match discussion will be available in Phase 2." phase="Phase 2" />
              <FeaturePlaceholder icon="◇" title="Predictions" description="Virtual coin predictions will be available in Phase 3." phase="Phase 3" />
              <FeaturePlaceholder icon="✦" title="AI Match Insight" description="AI pre-match insight is planned for a later phase." phase="Planned" />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function MatchInformation({ fixture }: { fixture: Fixture }) {
  const details = [
    ["Venue", fixture.venue],
    ["Competition", fixture.competition],
    ["Kickoff date", formatDate(fixture)],
    ["Kickoff time", fixture.time],
    ["Status", displayStatus(fixture.status)],
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xs font-black uppercase tracking-wider text-green-700">Match Information</h2>
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

function FeaturePlaceholder({ icon, title, description, phase }: { icon: string; title: string; description: string; phase: string }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-100 p-6 text-center text-slate-500">
      <span aria-hidden="true" className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-white text-xl text-slate-400">{icon}</span>
      <h3 className="mt-4 font-black text-slate-700">{title}</h3>
      <p className="mt-2 text-sm leading-6">{description}</p>
      <span className="mt-4 inline-block rounded-full bg-slate-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wide">{phase}</span>
    </article>
  );
}

function formatDate(fixture: Fixture) {
  if (!fixture.dateISO) return fixture.date;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${fixture.dateISO}T00:00:00Z`));
}

function displayStatus(status: Fixture["status"]) {
  return status.charAt(0) + status.slice(1).toLocaleLowerCase();
}

function getRelatedFixtures(fixture: Fixture) {
  const currentDate = fixture.dateISO
    ? new Date(`${fixture.dateISO}T00:00:00Z`).getTime()
    : 0;

  return Array.from(
    new Map(
      fixtures
        .filter(
          (candidate) =>
            candidate.id !== fixture.id &&
            candidate.competition === fixture.competition,
        )
        .sort((a, b) => dateDistance(a, currentDate) - dateDistance(b, currentDate))
        .map((candidate) => [candidate.id, candidate]),
    ).values(),
  ).slice(0, 3);
}

function dateDistance(fixture: Fixture, currentDate: number) {
  if (!fixture.dateISO || !currentDate) return Number.MAX_SAFE_INTEGER;
  return Math.abs(
    new Date(`${fixture.dateISO}T00:00:00Z`).getTime() - currentDate,
  );
}
