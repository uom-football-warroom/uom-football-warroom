import FixtureCard from "@/components/fixtures/FixtureCard";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { fixtures } from "@/lib/mock-data";

export default function FixturesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50">
        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-green-600">
            Match Centre
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase text-slate-900">
            Upcoming Fixtures
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
            Follow upcoming matches, kickoff times, competitions, and venues.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {fixtures.map((fixture) => (
              <FixtureCard key={fixture.id} fixture={fixture} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
