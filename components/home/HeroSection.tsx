// Home page hero component placeholder.
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[560px] overflow-hidden bg-slate-950 bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(8,17,38,0.96) 0%, rgba(8,17,38,0.82) 45%, rgba(8,17,38,0.35) 100%), url('/images/stadium.png')",
      }}
    >
      <div className="mx-auto flex min-h-[560px] max-w-7xl items-center px-5 py-20 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-green-400/40 bg-green-400/10 px-4 py-2 text-xs font-bold tracking-[0.18em] text-green-400">
            GLOBAL FOOTBALL FAN COMMUNITY
          </span>

          <h1 className="mt-7 text-4xl font-black uppercase leading-tight text-white sm:text-5xl lg:text-6xl">
            Your Football Club.
            <span className="mt-2 block italic text-green-400">
              Your Matchday Community.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Discover international clubs, follow upcoming fixtures, choose your
            favourite team and prepare to connect with supporters on matchday.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/clubs"
              className="rounded-md bg-green-500 px-6 py-3 text-sm font-bold uppercase text-white transition hover:bg-green-600"
            >
              Explore Clubs
            </Link>

            <Link
              href="/fixtures"
              className="rounded-md border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold uppercase text-white transition hover:bg-white/20"
            >
              View Fixtures
            </Link>
          </div>

          <div className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-7">
            <Statistic value="150+" label="International clubs" />
            <Statistic value="20+" label="Competitions" />
            <Statistic value="24/7" label="Fan community" />
          </div>
        </div>
      </div>
    </section>
  );
}

type StatisticProps = {
  value: string;
  label: string;
};

function Statistic({ value, label }: StatisticProps) {
  return (
    <div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
        {label}
      </p>
    </div>
  );
}
