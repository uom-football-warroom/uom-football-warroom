import Image from "next/image";
import Link from "next/link";
import type { Fixture } from "@/types/football";

type FixtureCardProps = {
  fixture: Fixture;
};

export default function FixtureCard({ fixture }: FixtureCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
          {fixture.competition}
        </span>

        <span className="text-xs text-slate-400">{fixture.venue}</span>
      </div>

      <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <Team
          code={fixture.homeClub.code}
          logo={fixture.homeClub.logo}
          name={fixture.homeClub.name}
        />

        <div className="text-center">
          <p className="text-xs font-medium text-slate-400">VS</p>
          <p className="mt-1 rounded bg-green-50 px-3 py-1 text-sm font-black text-green-600">
            {fixture.time}
          </p>
        </div>

        <Team
          code={fixture.awayClub.code}
          logo={fixture.awayClub.logo}
          name={fixture.awayClub.name}
        />
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        {fixture.date}
      </p>

      <Link
        href={`/fixtures/${fixture.id}`}
        className="mt-5 block border-t border-slate-100 pt-4 text-center text-xs font-bold uppercase tracking-wide text-slate-800 transition hover:text-green-600"
      >
        View Match
      </Link>
    </article>
  );
}

type TeamProps = {
  code: string;
  logo: string;
  name: string;
};

function Team({ code, logo, name }: TeamProps) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-2">
        <Image
          src={logo}
          alt={`${name} crest`}
          width={44}
          height={44}
          className="h-full w-full object-contain"
        />
      </div>

      <p className="mt-3 text-xs font-bold text-slate-800" title={code}>
        {name}
      </p>
    </div>
  );
}
