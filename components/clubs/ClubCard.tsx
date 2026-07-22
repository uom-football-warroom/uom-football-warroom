import Image from "next/image";
import Link from "next/link";
import type { Club } from "@/types/football";

type ClubCardProps = {
  club: Club;
  variant?: "compact" | "directory";
};

export default function ClubCard({ club, variant = "compact" }: ClubCardProps) {
  if (variant === "compact") {
    return (
      <article className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-2">
          <Image
            src={club.logo}
            alt={`${club.name} logo`}
            width={48}
            height={48}
            className="h-full w-full object-contain"
          />
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

  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg hover:shadow-slate-200/70 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20">
      <Link
        href={`/clubs/${club.id}`}
        className="absolute inset-0 z-10 rounded-xl outline-none"
        aria-label={`View ${club.name}`}
      />
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-lg bg-slate-50 p-8 sm:p-10">
        <div className="absolute inset-x-8 top-1/2 h-12 -translate-y-1/2 rounded-full bg-white blur-xl" />
        <Image
          src={club.logo}
          alt={`${club.name} crest`}
          width={112}
          height={112}
          className="relative h-24 w-24 object-contain drop-shadow-md transition duration-200 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-slate-950">
              {club.name}
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-500">
              {club.competition}
            </p>
          </div>
          {club.country && (
            <span className="shrink-0 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              {club.country}
            </span>
          )}
        </div>

        {club.supporters && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current text-green-600">
              <path d="M7.5 9A3.5 3.5 0 1 0 7.5 2a3.5 3.5 0 0 0 0 7Zm5.75-.5a2.75 2.75 0 1 0 0-5.5 2.74 2.74 0 0 0-1.46.42A4.96 4.96 0 0 1 12.5 6c0 .82-.2 1.6-.55 2.28.4.14.84.22 1.3.22ZM7.5 10.5C3.91 10.5 1 12.74 1 15.5V17h13v-1.5c0-2.76-2.91-5-6.5-5Zm6.1-.46c1.72.94 2.9 2.44 2.9 4.21V17H19v-1.5c0-2.48-2.36-4.54-5.4-5.46Z" />
            </svg>
            {club.supporters} supporters
          </p>
        )}

        <span className="mt-4 block rounded-md bg-green-600 px-4 py-2.5 text-center text-xs font-bold text-white transition group-hover:bg-green-700">
          View Club
        </span>
      </div>
    </article>
  );
}
