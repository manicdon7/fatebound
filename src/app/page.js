export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-linear-to-b from-[#05060a] via-[#070a14] to-[#0b1022]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-3xl" />
      </div>
      <div className="relative">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="fade-in-up">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Play stories.
                <span className="text-indigo-200"> Choose your fate.</span>
              </h1>
              <p className="mt-5 max-w-xl text-slate-200 leading-relaxed">
                Fatebound is an AI-powered interactive story platform where chat is the game.
                The AI narrates, suggests next actions, and you decide what happens.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="/play"
                  className="inline-flex items-center justify-center rounded-full bg-indigo-500/90 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
                >
                  Start playing
                </a>
                <a
                  href="/how-it-works"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-100 hover:bg-white/10 transition-colors"
                >
                  How it works
                </a>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-4">
                  <div className="text-xs text-slate-400">Core</div>
                  <div className="mt-1 text-sm font-medium text-white">Chat-first</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-4">
                  <div className="text-xs text-slate-400">Guidance</div>
                  <div className="mt-1 text-sm font-medium text-white">3 suggestions</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-4">
                  <div className="text-xs text-slate-400">Narrative</div>
                  <div className="mt-1 text-sm font-medium text-white">Stories end</div>
                </div>
              </div>
            </div>

            <div className="fade-in-up">
              <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-6 shadow-2xl">
                <div className="text-xs text-slate-400">Preview</div>
                <div className="mt-4 space-y-3">
                  <div className="max-w-[85%] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
                    You awaken at the edge of an unfamiliar path. The air is still—waiting.
                  </div>
                  <div className="ml-auto max-w-[85%] rounded-xl bg-indigo-500/90 px-4 py-3 text-sm text-white">
                    I check my pockets and look for a landmark.
                  </div>
                  <div className="max-w-[85%] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
                    In your palm: a coin stamped with a sigil you don’t recognize. Somewhere ahead, a lantern flickers.
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200">
                      Examine the coin
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200">
                      Walk toward the lantern
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200">
                      Hide and observe
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
