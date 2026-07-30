import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClubDetails from "@/components/clubs/club-details";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { prisma } from "@/lib/db";

type ClubPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Club details | UOM Football War Room",
  description: "View club information, upcoming fixtures, and recent results.",
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ClubPage({ params }: ClubPageProps) {
  const { id } = await params;

  if (!uuidPattern.test(id)) {
    notFound();
  }

  const club = await prisma.club.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!club) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="bg-slate-50">
        <ClubDetails clubId={id} />
      </main>
      <Footer />
    </>
  );
}
