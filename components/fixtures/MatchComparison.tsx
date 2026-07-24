import type { ApiFixture } from "@/types/football";

export default function MatchComparison({ fixture }: { fixture: ApiFixture }) {
  const home = fixture.homeClub;
  const away = fixture.awayClub;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-black uppercase tracking-wider text-green-700">Match Comparison</p>
      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] gap-3 text-sm font-black text-slate-950">
        <p>{home.name}</p>
        <span className="text-xs uppercase tracking-wide text-slate-400">Teams</span>
        <p className="text-right">{away.name}</p>
      </div>

      <div className="mt-6 space-y-7">
        <ValueRow
          label="League Position"
          homeValue="N/A"
          awayValue="N/A"
        />
        <ComparisonBar
          label="Average Goals Scored"
          homeValue={undefined}
          awayValue={undefined}
          format={(value) => value.toFixed(1)}
        />
        <ComparisonBar
          label="Average Possession"
          homeValue={undefined}
          awayValue={undefined}
          format={(value) => `${value}%`}
        />
        <div>
          <p className="text-center text-xs text-slate-500">Recent Form</p>
          <div className="mt-3 grid grid-cols-2 gap-6 text-xs text-slate-400">
            <p>N/A</p>
            <p className="text-right">N/A</p>
          </div>
        </div>
      </div>

      <div className="mt-7 border-t border-slate-200 pt-6">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Last head-to-head results</h3>
        <p className="mt-3 text-sm text-slate-500">Head-to-head results are not available for this fixture.</p>
      </div>
    </section>
  );
}

function ValueRow({ label, homeValue, awayValue }: { label: string; homeValue: string; awayValue: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm">
      <p className="font-bold text-slate-900">{homeValue}</p>
      <p className="text-center text-xs text-slate-500">{label}</p>
      <p className="text-right font-bold text-slate-900">{awayValue}</p>
    </div>
  );
}

function ComparisonBar({ label, homeValue, awayValue, format }: { label: string; homeValue?: number; awayValue?: number; format: (value: number) => string }) {
  const maximum = Math.max(homeValue ?? 0, awayValue ?? 0, 1);
  return (
    <div>
      <ValueRow label={label} homeValue={homeValue === undefined ? "N/A" : format(homeValue)} awayValue={awayValue === undefined ? "N/A" : format(awayValue)} />
      <div className="mt-3 grid grid-cols-2 gap-1" role="img" aria-label={`${label}: home ${homeValue ?? "not available"}, away ${awayValue ?? "not available"}`}>
        <div className="flex h-2 justify-end overflow-hidden rounded-l-full bg-slate-100">
          <span className="h-full rounded-l-full bg-green-600" style={{ width: `${((homeValue ?? 0) / maximum) * 100}%` }} />
        </div>
        <div className="h-2 overflow-hidden rounded-r-full bg-slate-100">
          <span className="block h-full rounded-r-full bg-red-500" style={{ width: `${((awayValue ?? 0) / maximum) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
