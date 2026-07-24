import type { Metadata } from "next";
import ClubDetails from "@/components/clubs/club-details";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

type ClubPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Club details | UOM Football War Room",
  description: "View club information, upcoming fixtures, and recent results.",
};

export default async function ClubPage({ params }: ClubPageProps) {
  const { id } = await params;

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
