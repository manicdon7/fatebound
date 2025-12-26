export const metadata = {
  title: "About | Fatebound",
  description: "About Fatebound.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full bg-linear-to-b from-[#05060a] via-[#070a14] to-[#0b1022]">
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-6 sm:p-10 fade-in-up">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            About Fatebound
          </h1>
          <p className="mt-4 text-slate-200 leading-relaxed">
            Fatebound is an AI-powered interactive story platform where chat is the entire game.
            The AI describes the world and proposes possible next actions, but you always decide what happens next.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-medium text-white">Player agency</h2>
              <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                Suggestions help you move fast, but free-text input means you can attempt anything.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-medium text-white">Stories that end</h2>
              <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                Each run is designed to progress and reach a meaningful conclusion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
