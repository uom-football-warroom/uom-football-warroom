type PhasePreviewCardProps = {
  title: string;
  phase: "Phase 2" | "Phase 3" | "Phase 4";
  description: string;
  items: string[];
};

export default function PhasePreviewCard({ title, phase, description, items }: PhasePreviewCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-100/80 p-5 text-slate-500" aria-label={`${title}, locked preview`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-slate-400">▣</span>
          <h2 className="font-black text-slate-700">{title}</h2>
        </div>
        <span className="shrink-0 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">Available in {phase}</span>
      </div>
      <p className="mt-4 text-sm leading-6">{description}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item} className="rounded-md border border-slate-200 bg-white/70 px-3 py-3 text-xs">
            <span aria-hidden="true" className="mr-2 text-slate-300">—</span>{item}
          </div>
        ))}
      </div>
    </section>
  );
}
