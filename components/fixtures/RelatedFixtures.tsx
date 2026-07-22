import Image from "next/image";
import Link from "next/link";
import type { Fixture } from "@/types/football";

export default function RelatedFixtures({ fixtures }: { fixtures: Fixture[] }) {
  if (!fixtures.length) return null;

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-black text-slate-950">Related Fixtures</h2>
        <Link href="/fixtures" className="text-xs font-bold text-green-700 hover:text-green-800">View all →</Link>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {fixtures.slice(0, 3).map((fixture) => (
          <Link key={fixture.id} href={`/fixtures/${fixture.id}`} className="rounded-xl border border-slate-200 bg-white p-5 outline-none transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2">
            <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase text-slate-500"><span>{fixture.date}</span><span>{fixture.time}</span></div>
            <p className="mt-2 truncate text-xs text-slate-400">{fixture.venue}</p>
            <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
              {[fixture.homeClub, fixture.awayClub].map((club, index) => (
                <div key={club.id} className={index === 1 ? "col-start-3" : ""}>
                  <Image src={club.logo} alt={`${club.name} crest`} width={38} height={38} className="mx-auto h-9 w-9 object-contain" />
                  <p className="mt-2 truncate text-xs font-bold text-slate-900">{club.name}</p>
                </div>
              ))}
              <span className="col-start-2 row-start-1 text-xs font-bold text-slate-400">VS</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
