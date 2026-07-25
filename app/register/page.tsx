import type { Metadata } from "next";
import { redirect } from "next/navigation";

import RegisterForm from "@/components/auth/RegisterForm";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Create Account | UOM Football War Room",
  description:
    "Create an account to follow your club and join the football community.",
};

export default async function RegisterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/profile");
  }

  return (
    <>
      <Navbar />

      <main className="relative flex-1 overflow-hidden bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.14),transparent_48%)]"
        />

        <section className="relative mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white px-5 py-9 shadow-xl shadow-slate-200/70 sm:px-10 sm:py-12">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">
              Join the War Room
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Create Your Fan Account
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
              Follow your favourite club, join live discussions and compete with
              other football supporters.
            </p>
          </div>

          <RegisterForm />
        </section>
      </main>

      <Footer />
    </>
  );
}
