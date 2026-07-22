import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ProfileDashboard from "@/components/profile/ProfileDashboard";
import { clubs, mockProfile } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Profile | UOM Football War Room",
  description: "Manage your supporter profile and favourite football club.",
};

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50">
        <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">Supporter account</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Your Profile</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">Manage your Phase 1 account details, choose your favourite club, and preview features planned for future phases.</p>
          </div>
          <ProfileDashboard profile={mockProfile} clubs={clubs} />
        </section>
      </main>
      <Footer />
    </>
  );
}
