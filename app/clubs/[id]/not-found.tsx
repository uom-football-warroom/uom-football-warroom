import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function ClubNotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-5 py-20 text-center">
        <div className="max-w-md">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600">Club directory</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">Club not found</h1>
          <p className="mt-4 text-sm leading-6 text-slate-500">We could not find that club. Explore the directory to discover available clubs and supporter communities.</p>
          <Link href="/clubs" className="mt-7 inline-block rounded-md bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2">Explore clubs</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
