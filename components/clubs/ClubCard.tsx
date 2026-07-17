import Link from "next/link";
import type { Club } from "@/types/football";

type ClubCardProps = {
  club: Club;
};

export default function ClubCard({ club }: ClubCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-sm font-black text-slate-800">
        {club.code}
      </div>

      <h3 className="mt-4 font-bold text-slate-900">{club.name}</h3>

      <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
        {club.country}
      </p>

      <p className="mt-4 text-xs text-slate-500">{club.competition}</p>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="text-left">
          <p className="text-[10px] uppercase text-slate-400">Supporters</p>
          <p className="text-sm font-black text-green-600">
            {club.supporters}
          </p>
        </div>

        <Link
          href={`/clubs/${club.id}`}
          className="rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-green-500 hover:text-green-600"
        >
          View Club
        </Link>
      </div>
    </article>
  );
}