import ClubCard from "@/components/clubs/ClubCard";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { clubs } from "@/lib/mock-data";

export default function ClubsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50">
        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-green-600">
            Club Directory
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase text-slate-900">
            Choose Your Club
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
            Explore international clubs and find the team you support.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
