import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FixtureDetails from "@/components/fixtures/fixture-details";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { prisma } from "@/lib/db";

type FixturePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Fixture details | UOM Football War Room",
  description: "View fixture information, teams, kickoff details, and status.",
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function FixturePage({ params }: FixturePageProps) {
  const { id } = await params;

  if (!uuidPattern.test(id)) {
    notFound();
  }

  const fixture = await prisma.fixture.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!fixture) {
    notFound();
  }

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
