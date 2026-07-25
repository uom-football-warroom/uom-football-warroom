"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import PhasePreviewCard from "@/components/profile/PhasePreviewCard";
import type { Club } from "@/types/football";
import type { Profile } from "@/types/profile";

type ProfileDashboardProps = {
  profile: Profile;
  clubs: Club[];
};

type Errors = Partial<Record<"displayName" | "username" | "email", string>>;

export default function ProfileDashboard({ profile, clubs }: ProfileDashboardProps) {
  const [favouriteClubId, setFavouriteClubId] = useState(profile.favouriteClubId ?? "");
  const [selectingClub, setSelectingClub] = useState(false);
  const favouriteClub = clubs.find((club) => club.id === favouriteClubId);

  function chooseClub(id: string) {
    setFavouriteClubId(id);
    setSelectingClub(false);
    // TODO: Persist the favourite club through the authenticated profile API.
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.8fr)]">
      <div className="space-y-6">
        <ProfileHeader profile={profile} />
        <FavouriteClubCard club={favouriteClub} clubs={clubs} selecting={selectingClub} onStartSelecting={() => setSelectingClub(true)} onCancel={() => setSelectingClub(false)} onChoose={chooseClub} />
        <AccountSettingsForm profile={profile} />
      </div>

      <aside className="space-y-5">
        <AccountSummary profile={profile} favouriteClub={favouriteClub} />
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
          <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-green-500 bg-slate-800 text-3xl font-black shadow-lg">{initials}</div>
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

function FavouriteClubCard({ club, clubs, selecting, onStartSelecting, onCancel, onChoose }: { club?: Club; clubs: Club[]; selecting: boolean; onStartSelecting: () => void; onCancel: () => void; onChoose: (id: string) => void }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Favourite Club</h2>
        {club && <Link href={`/clubs/${club.id}`} className="text-xs font-bold text-green-700 hover:text-green-800">View club →</Link>}
      </div>
      {selecting ? (
        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4">
          <label htmlFor="favourite-club" className="block text-xs font-bold text-slate-700">Choose a club</label>
          <select id="favourite-club" defaultValue={club?.id ?? ""} onChange={(event) => event.target.value && onChoose(event.target.value)} className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/15">
            <option value="">Select a club</option>
            {clubs.map((option) => <option key={option.id} value={option.id}>{option.name} — {option.competition}</option>)}
          </select>
          <button type="button" onClick={onCancel} className="mt-3 text-xs font-bold text-slate-500 hover:text-slate-800">Cancel</button>
        </div>
      ) : club ? (
        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-4"><Image src={club.logo} alt={`${club.name} crest`} width={72} height={72} className="h-full w-full object-contain" /></div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-black text-slate-950">{club.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{club.competition} · {club.country}</p>
            <p className="mt-3 text-xs font-semibold text-green-700">{club.supporters} supporters</p>
          </div>
          <button type="button" onClick={onStartSelecting} className="rounded-md border border-green-600 px-4 py-2.5 text-xs font-bold text-green-700 outline-none transition hover:bg-green-50 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2">Change Favourite Club</button>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-slate-300 px-5 py-9 text-center">
          <p className="text-sm text-slate-500">Choose a club to personalize your supporter profile.</p>
          <button type="button" onClick={onStartSelecting} className="mt-4 rounded-md bg-green-600 px-4 py-2.5 text-xs font-bold text-white outline-none transition hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2">Select Favourite Club</button>
        </div>
      )}
    </section>
  );
}

function AccountSummary({ profile, favouriteClub }: { profile: Profile; favouriteClub?: Club }) {
  const items = [["Favourite club", favouriteClub?.name ?? "Not selected"], ["Account role", profile.role], ["Current tier", profile.tier], ["Member since", profile.memberSince]];
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-black text-slate-950">Phase 1 Account Summary</h2>
      <dl className="mt-4 divide-y divide-slate-100">
        {items.map(([label, value]) => <div key={label} className="flex justify-between gap-4 py-3 text-sm first:pt-0 last:pb-0"><dt className="text-slate-500">{label}</dt><dd className="text-right font-bold text-slate-900">{value}</dd></div>)}
      </dl>
    </section>
  );
}

function AccountSettingsForm({ profile }: { profile: Profile }) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [username, setUsername] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);
  const [notifications, setNotifications] = useState(profile.notificationsEnabled);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Errors = {};
    if (!displayName.trim()) nextErrors.displayName = "Display name is required.";
    if (!username.trim()) nextErrors.username = "Username is required.";
    if (!email.trim()) nextErrors.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email address.";
    setErrors(nextErrors);
    setSuccess("");
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    window.setTimeout(() => {
      // TODO: Persist profile settings through the authenticated profile API.
      setSaving(false);
      setSuccess("Changes updated for this browser session only.");
    }, 500);
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <h2 className="text-xl font-black text-slate-950">Account Settings</h2>
      <form onSubmit={submit} noValidate className="mt-6 space-y-5">
        <TextField id="display-name" label="Display name" value={displayName} onChange={setDisplayName} error={errors.displayName} />
        <TextField id="username" label="Username" value={username} onChange={setUsername} error={errors.username} />
        <TextField id="email" label="Email address" type="email" value={email} onChange={setEmail} error={errors.email} />
        <div className="flex items-center justify-between gap-5 border-y border-slate-200 py-4">
          <div><p className="text-sm font-bold text-slate-900">Notifications</p><p className="mt-1 text-xs text-slate-500">Frontend preference only</p></div>
          <button type="button" role="switch" aria-checked={notifications} onClick={() => setNotifications((value) => !value)} className={`relative h-7 w-12 rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 ${notifications ? "bg-green-600" : "bg-slate-300"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${notifications ? "left-6" : "left-1"}`} /></button>
        </div>
        {success && <p role="status" className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={saving} className="flex-1 rounded-md bg-green-600 px-5 py-3 text-sm font-bold text-white outline-none transition hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Updating…" : "Save Changes"}</button>
          <LogoutButton className="rounded-md border border-slate-300 px-5 py-3 text-center text-sm font-bold text-slate-700 outline-none transition hover:border-red-300 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60" />
        </div>
      </form>
    </section>
  );
}

function TextField({ id, label, value, onChange, error, type = "text" }: { id: string; label: string; value: string; onChange: (value: string) => void; error?: string; type?: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-bold text-slate-700">{label}</label>
      <input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={`h-11 w-full rounded-md border bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:bg-white focus:ring-2 ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500/15" : "border-slate-300 focus:border-green-600 focus:ring-green-600/15"}`} />
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
