"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import {
  updateProfile,
  type ProfileUpdateState,
} from "@/app/profile/actions";
import LogoutButton from "@/components/auth/LogoutButton";
import PhasePreviewCard from "@/components/profile/PhasePreviewCard";
import type { Profile } from "@/types/profile";

type ProfileDashboardProps = {
  profile: Profile;
  initialDisplayName: string;
};

export default function ProfileDashboard({
  profile,
  initialDisplayName,
}: ProfileDashboardProps) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.8fr)]">
      <div className="space-y-6">
        <ProfileHeader profile={profile} />
        <FavouriteClubsCard clubs={profile.favouriteClubs} />
        <AccountSettingsForm
          profile={profile}
          initialDisplayName={initialDisplayName}
        />
      </div>

      <aside className="space-y-5">
        <AccountSummary profile={profile} />
        <PhasePreviewCard title="War Room Activity" phase="Phase 2" description="Your War Room post count and recent match discussions will appear here after live match rooms are implemented." items={["War Room posts", "Matches discussed", "Recent discussion activity"]} />
        <PhasePreviewCard title="Prediction Statistics" phase="Phase 3" description="Prediction history, correct predictions and win rate will appear here after virtual-coin predictions are implemented." items={["Total predictions", "Correct predictions", "Prediction win rate", "Recent predictions"]} />
        <PhasePreviewCard title="War Coin Wallet" phase="Phase 3" description="Your virtual coin balance and transaction history will appear here after the prediction economy is implemented. War Coins are virtual and have no real-money value." items={["Coin balance", "Coins earned", "Coins spent", "Transaction history"]} />
        <PhasePreviewCard title="Loyalty and Ranking" phase="Phase 4" description="Loyalty points, tier progression and leaderboard rank will appear here after the loyalty system is implemented." items={["Loyalty points", "Next tier progress", "Fan rank", "Tier history"]} />
      </aside>
    </div>
  );
}

function ProfileHeader({ profile }: { profile: Profile }) {
  const initials = profile.displayName.split(/\s+/).map((name) => name[0]).join("").slice(0, 2).toUpperCase();
  return (
    <section className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
      <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-green-500/10 blur-2xl" />
      <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <div className="relative">
          <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-green-500 bg-slate-800 text-3xl font-black shadow-lg">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={`${profile.displayName} avatar`}
                fill
                sizes="112px"
                unoptimized
                className="object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <button type="button" aria-label="Edit avatar" title="Avatar editing is not yet connected" className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm outline-none transition hover:bg-green-500 focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">✎</button>
        </div>
        <div className="min-w-0 flex-1">
          <span className="rounded-full bg-green-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-green-400">{profile.role}</span>
          <h2 className="mt-3 truncate text-3xl font-black">{profile.displayName}</h2>
          <p className="mt-1 text-sm text-slate-400">@{profile.username}</p>
          <p className="mt-1 break-all text-sm text-slate-300">{profile.email}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs sm:justify-start">
            <span className="rounded-md bg-white/10 px-3 py-2">Member since {profile.memberSince}</span>
            <span className="rounded-md bg-white/10 px-3 py-2">Account: {profile.accountStatus}</span>
            <span className="rounded-md bg-green-500/15 px-3 py-2 text-green-300">Tier: {profile.tier}</span>
          </div>
        </div>
        <LogoutButton className="rounded-md border border-white/20 px-4 py-2 text-xs font-bold outline-none transition hover:border-green-400 hover:text-green-400 focus-visible:ring-2 focus-visible:ring-green-400 disabled:cursor-not-allowed disabled:opacity-60" />
      </div>
    </section>
  );
}

function FavouriteClubsCard({
  clubs,
}: {
  clubs: Profile["favouriteClubs"];
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Favourite Clubs</h2>
        {clubs.length > 0 && <Link href="/onboarding/club" className="text-xs font-bold text-green-700 hover:text-green-800">Change favourite clubs →</Link>}
      </div>
      {clubs.length > 0 ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {clubs.map((club) => (
            <FavouriteClubItem key={club.id} club={club} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-slate-300 px-5 py-9 text-center">
          <h3 className="font-bold text-slate-950">No favourite clubs selected</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">Choose the clubs you support to personalise your profile and War Room experience.</p>
          <Link href="/onboarding/club" className="mt-4 inline-block rounded-md bg-green-600 px-4 py-2.5 text-xs font-bold text-white outline-none transition hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2">Choose Favourite Clubs</Link>
        </div>
      )}
    </section>
  );
}

function FavouriteClubItem({
  club,
}: {
  club: Profile["favouriteClubs"][number];
}) {
  const crestUrl = club.crestUrl?.trim() || null;

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-3">
        {crestUrl ? (
          <Image src={crestUrl} alt={`${club.name} crest`} width={64} height={64} className="h-full w-full object-contain" />
        ) : (
          <span className="text-2xl font-black text-slate-400">
            {club.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-black text-slate-950">{club.name}</h3>
        <p className="mt-1 text-sm text-slate-500">Your favourite club</p>
        <Link href={`/clubs/${club.id}`} className="mt-3 inline-block text-xs font-bold text-green-700 hover:text-green-800">View club →</Link>
      </div>
    </article>
  );
}

function AccountSummary({ profile }: { profile: Profile }) {
  const favouriteClubNames =
    profile.favouriteClubs.map((club) => club.name).join(", ") ||
    "Not selected";
  const items = [["Favourite clubs", favouriteClubNames], ["Account role", profile.role], ["Current tier", profile.tier], ["Loyalty points", String(profile.loyaltyPoints ?? 0)], ["Member since", profile.memberSince]];
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-black text-slate-950">Phase 1 Account Summary</h2>
      <dl className="mt-4 divide-y divide-slate-100">
        {items.map(([label, value]) => <div key={label} className="flex justify-between gap-4 py-3 text-sm first:pt-0 last:pb-0"><dt className="text-slate-500">{label}</dt><dd className="text-right font-bold text-slate-900">{value}</dd></div>)}
      </dl>
    </section>
  );
}

const initialUpdateState: ProfileUpdateState = {
  success: false,
  message: "",
};

function AccountSettingsForm({
  profile,
  initialDisplayName,
}: {
  profile: Profile;
  initialDisplayName: string;
}) {
  const [notifications, setNotifications] = useState(profile.notificationsEnabled);
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialUpdateState,
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <h2 className="text-xl font-black text-slate-950">Account Settings</h2>
      <form action={formAction} noValidate className="mt-6 space-y-5">
        <TextField id="displayName" label="Display name" defaultValue={initialDisplayName} maxLength={80} error={state.errors?.displayName} />
        <TextField id="username" label="Username" defaultValue={profile.username} minLength={3} maxLength={30} required error={state.errors?.username} />
        <TextField id="email" label="Email address" type="email" defaultValue={profile.email} readOnly />
        <TextField id="role" label="Account role" defaultValue={profile.role} readOnly />
        <div className="flex items-center justify-between gap-5 border-y border-slate-200 py-4">
          <div><p className="text-sm font-bold text-slate-900">Notifications</p><p className="mt-1 text-xs text-slate-500">Frontend preference only</p></div>
          <button type="button" role="switch" aria-checked={notifications} onClick={() => setNotifications((value) => !value)} className={`relative h-7 w-12 rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 ${notifications ? "bg-green-600" : "bg-slate-300"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${notifications ? "left-6" : "left-1"}`} /></button>
        </div>
        {state.message && <p role={state.success ? "status" : "alert"} className={`rounded-md px-3 py-2 text-sm ${state.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{state.message}</p>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={pending} className="flex-1 rounded-md bg-green-600 px-5 py-3 text-sm font-bold text-white outline-none transition hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Updating…" : "Save Changes"}</button>
          <LogoutButton className="rounded-md border border-slate-300 px-5 py-3 text-center text-sm font-bold text-slate-700 outline-none transition hover:border-red-300 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60" />
        </div>
      </form>
    </section>
  );
}

function TextField({ id, label, defaultValue, error, type = "text", readOnly = false, required = false, minLength, maxLength }: { id: string; label: string; defaultValue: string; error?: string; type?: string; readOnly?: boolean; required?: boolean; minLength?: number; maxLength?: number }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-bold text-slate-700">{label}</label>
      <input id={id} name={readOnly ? undefined : id} type={type} defaultValue={defaultValue} readOnly={readOnly} required={required} minLength={minLength} maxLength={maxLength} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={`h-11 w-full rounded-md border px-3 text-sm text-slate-900 outline-none transition focus:ring-2 ${readOnly ? "cursor-not-allowed bg-slate-100 text-slate-500" : "bg-slate-50 focus:bg-white"} ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500/15" : "border-slate-300 focus:border-green-600 focus:ring-green-600/15"}`} />
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
