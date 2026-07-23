import ClubsList from "@/components/clubs/clubs-list";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function ClubsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50">
        <section className="mx-auto max-w-7xl px-5 py-10 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600">
              Club Directory
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Explore Clubs
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              Browse clubs from leading competitions, follow your favourite
              club, and join supporter communities around the world.
            </p>
          </div>

          <ClubsList />
        </section>
      </main>
      <Footer />
    </>
  );
}
