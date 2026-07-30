import Image from "next/image";
import type { ApiClub } from "@/types/football";

type ClubHeroProps = {
  club: ApiClub;
};

export default function ClubHero({ club }: ClubHeroProps) {
  const crestUrl = club.crestUrl?.trim() || null;
  const fallbackText =
    club.tla?.trim() || club.name.charAt(0).toUpperCase();

  return (
    <section className="relative isolate min-h-[340px] overflow-hidden bg-slate-950 sm:min-h-[390px]">
      <Image
        src="/images/stadium.png"
        alt="Football stadium"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-900/10" />

      <div className="relative mx-auto flex min-h-[340px] max-w-7xl items-end px-5 py-9 sm:min-h-[390px] sm:py-12 lg:px-8">
        <div className="flex w-full flex-col items-start gap-6 sm:flex-row sm:items-end">
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white p-5 shadow-2xl sm:h-36 sm:w-36">
            {crestUrl ? (
              <Image
                src={crestUrl}
                alt={`${club.name} crest`}
                width={112}
                height={112}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center rounded-lg bg-green-50 text-3xl font-black text-green-700">
                {fallbackText}
              </span>
            )}
          </div>

          <div className="pb-1 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded bg-green-500 px-2.5 py-1 uppercase tracking-wide text-slate-950">
                {club.competition || "Competition unavailable"}
              </span>
              <span>{club.country || "Country unavailable"}</span>
            </div>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl">
              {club.name}
            </h1>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-200">
              <span>⌖ {club.stadium || "Stadium unavailable"}</span>
              <span>
                ▣ {club.founded ? `Founded ${club.founded}` : "Founded year unavailable"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
