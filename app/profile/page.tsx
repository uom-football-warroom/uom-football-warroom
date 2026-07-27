import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ProfileDashboard from "@/components/profile/ProfileDashboard";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/profile";

export const metadata: Metadata = {
  title: "Profile | UOM Football War Room",
  description: "Manage your supporter profile and favourite football club.",
};

function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getSafeAvatarUrl(value: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function ProfileUnavailable() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-black text-slate-950">
        Your supporter profile has not been created yet.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        Please sign out and register again, or contact support if the problem
        continues.
      </p>
    </section>
  );
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login?next=/profile");
  }

  let databaseProfile;

  try {
    databaseProfile = await prisma.userProfile.findUnique({
      where: {
        id: user.id,
      },
      include: {
        supportProfile: {
          include: {
            favouriteClubs: {
              include: {
                club: true,
              },
            },
          },
        },
      },
    });
  } catch {
    databaseProfile = null;
  }

  const profile: Profile | null = databaseProfile
    ? {
        id: databaseProfile.id,
        displayName:
          databaseProfile.displayName ?? databaseProfile.username,
        username: databaseProfile.username,
        email: user.email ?? "Email unavailable",
        role: formatEnumLabel(databaseProfile.role),
        avatarUrl: getSafeAvatarUrl(databaseProfile.avatarUrl),
        favouriteClub: databaseProfile.supportProfile?.favouriteClubs[0]?.club
          ? {
              id: databaseProfile.supportProfile.favouriteClubs[0].club.id,
              name: databaseProfile.supportProfile.favouriteClubs[0].club.name,
              crestUrl:
                databaseProfile.supportProfile.favouriteClubs[0].club.crestUrl,
            }
          : null,
        tier: formatEnumLabel(
          databaseProfile.supportProfile?.tier ?? "NEW_FAN",
        ),
        loyaltyPoints:
          databaseProfile.supportProfile?.loyaltyPoints ?? 0,
        memberSince: new Intl.DateTimeFormat("en", {
          month: "long",
          year: "numeric",
        }).format(databaseProfile.createdAt),
        accountStatus: "Active",
        notificationsEnabled: false,
      }
    : null;

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
          {profile ? (
            <ProfileDashboard profile={profile} />
          ) : (
            <ProfileUnavailable />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
