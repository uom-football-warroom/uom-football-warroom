import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ProfileDashboard from "@/components/profile/ProfileDashboard";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/profile";

export const metadata: Metadata = {
  title: "Profile | UOM Football War Room",
  description: "Manage your supporter profile and favourite football club.",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login?next=/profile");
  }

  const email = user.email || "Email unavailable";
  const emailPrefix =
    user.email?.split("@")[0]?.trim() || "supporter";
  const username =
    typeof user.user_metadata.username === "string" &&
    user.user_metadata.username.trim()
      ? user.user_metadata.username.trim()
      : emailPrefix;
  const displayName =
    typeof user.user_metadata.display_name === "string" &&
    user.user_metadata.display_name.trim()
      ? user.user_metadata.display_name.trim()
      : username;
  const createdAt = new Date(user.created_at);
  const memberSince = Number.isNaN(createdAt.getTime())
    ? "Unavailable"
    : new Intl.DateTimeFormat("en", {
        month: "long",
        year: "numeric",
      }).format(createdAt);
  const profile: Profile = {
    id: user.id,
    displayName,
    username,
    email,
    role: "Supporter",
    tier: "New Fan",
    memberSince,
    accountStatus: "Active",
    notificationsEnabled: false,
  };

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
          <ProfileDashboard profile={profile} clubs={[]} />
        </section>
      </main>
      <Footer />
    </>
  );
}
