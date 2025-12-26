import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight text-white">
          Fatebound
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-200 sm:flex">
          <Link href="/how-it-works" className="hover:text-white transition-colors">
            How it works
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link
            href="/play"
            className="rounded-full bg-indigo-500/90 px-4 py-2 font-medium text-white hover:bg-indigo-500 transition-colors"
          >
            Play
          </Link>
        </nav>

        <details className="relative sm:hidden">
          <summary className="list-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#0b1022]/95 backdrop-blur-xl shadow-2xl">
            <Link
              href="/how-it-works"
              className="block px-4 py-3 text-sm text-slate-200 hover:bg-white/5"
            >
              How it works
            </Link>
            <Link
              href="/about"
              className="block px-4 py-3 text-sm text-slate-200 hover:bg-white/5"
            >
              About
            </Link>
            <Link
              href="/play"
              className="block px-4 py-3 text-sm font-medium text-white bg-indigo-500/20 hover:bg-indigo-500/30"
            >
              Play
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
