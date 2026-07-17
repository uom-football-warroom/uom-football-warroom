import Image from "next/image";

import type { Club } from "@/types/football";

export type ClubCardProps = {
  club: Club;
};

export default function ClubCard({ club }: ClubCardProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-50 p-4">
        <Image
          src={club.logo}
          alt={`${club.name} crest`}
          width={72}
          height={72}
          className="h-full w-full object-contain"
        />
      </div>
      <span className="mb-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
        {club.code}
      </span>
      <h2 className="text-xl font-semibold text-zinc-950">{club.name}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        {club.competition} · {club.country}
      </p>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
        {club.supporters} supporters
      </p>
    </article>
  );
}
