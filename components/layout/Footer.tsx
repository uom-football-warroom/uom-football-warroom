import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 font-bold text-white">
              U
            </span>

            <span className="font-bold text-white">
              UOM Football War Room
            </span>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-400">
            An international football supporter platform for discovering clubs,
            following fixtures and joining matchday communities.
          </p>
        </div>

        <FooterColumn
          title="Navigation"
          links={[
            { label: "Home", href: "/" },
            { label: "Clubs", href: "/clubs" },
            { label: "Fixtures", href: "/fixtures" },
          ]}
        />

        <FooterColumn
          title="Account"
          links={[
            { label: "Register", href: "/register" },
            { label: "Login", href: "/login" },
            { label: "Profile", href: "/profile" },
          ]}
        />

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-green-400">
            Stay Updated
          </h3>

          <p className="mt-5 text-sm text-slate-400">
            Receive updates about clubs, fixtures and platform features.
          </p>

          <div className="mt-5 flex">
            <input
              type="email"
              placeholder="Email address"
              className="min-w-0 flex-1 rounded-l-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-green-500"
            />

            <button
              type="button"
              className="rounded-r-md bg-green-500 px-4 text-sm font-bold text-white hover:bg-green-600"
            >
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-6 text-xs text-slate-500 sm:flex-row lg:px-8">
          <p>© 2026 UOM Football War Room</p>

          <div className="flex gap-5">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

type FooterColumnProps = {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
};

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-green-400">
        {title}
      </h3>

      <div className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-slate-400 transition hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}