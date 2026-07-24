import type { Metadata } from "next";
import FixtureDetails from "@/components/fixtures/fixture-details";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

type FixturePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Fixture details | UOM Football War Room",
  description: "View fixture information, teams, kickoff details, and status.",
};

export default async function FixturePage({ params }: FixturePageProps) {
  const { id } = await params;

  return (
    <>
      <Navbar />
      <main className="bg-slate-50">
        <FixtureDetails fixtureId={id} />
      </main>
      <Footer />
    </>
  );
}
