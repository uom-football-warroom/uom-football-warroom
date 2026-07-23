import Image from "next/image";
import Link from "next/link";
import FixturesList from "@/components/fixtures/fixtures-list";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function FixturesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50">
        <section className="relative isolate overflow-hidden bg-slate-950">
          <Image src="/images/stadium.png" alt="Football stadium" fill priority sizes="100vw" className="object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40" />
          <div className="relative mx-auto max-w-7xl px-5 py-14 text-white sm:py-20 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-300">
              <Link href="/" className="outline-none transition hover:text-green-400 focus-visible:ring-2 focus-visible:ring-green-400">Home</Link>
              <span aria-hidden="true">›</span>
              <span className="font-semibold text-green-400">Fixtures</span>
            </nav>
            <h1 className="mt-5 text-4xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl">Football Fixtures</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
              Browse upcoming fixtures, follow live scores, and review completed matches across major football leagues.
            </p>
          </div>
        </section>

        <FixturesList />
      </main>
      <Footer />
    </>
  );
}
