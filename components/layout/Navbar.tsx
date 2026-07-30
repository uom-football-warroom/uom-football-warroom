import Link from "next/link";

import LogoutButton from "@/components/auth/LogoutButton";
import { createClient } from "@/lib/supabase/server";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Clubs", href: "/clubs" },
  { label: "Fixtures", href: "/fixtures" },
];

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 font-bold text-white">
            U
          </span>

          <span className="text-sm font-extrabold tracking-wide text-slate-900 sm:text-base">
            UOM FOOTBALL WAR ROOM
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-green-600"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/profile"
                className="hidden text-sm font-semibold text-slate-700 transition hover:text-green-600 sm:block"
              >
                Profile
              </Link>
              <LogoutButton className="rounded-md bg-green-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70" />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-semibold text-slate-700 transition hover:text-green-600 sm:block"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-green-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
