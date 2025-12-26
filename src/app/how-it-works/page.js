import Link from "next/link";

export const metadata = {
  title: "How it works | Fatebound",
  description: "How Fatebound generates interactive stories.",
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen w-full bg-linear-to-b from-[#05060a] via-[#070a14] to-[#0b1022]">
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
        <div className="fade-in-up">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            How it works
          </h1>
          <p className="mt-4 max-w-2xl text-slate-200 leading-relaxed">
            Fatebound runs like a story engine. Every turn, we send your chat history to the AI with a strict system prompt.
            The AI returns narration plus three suggested actions.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-6 fade-in-up">
            <div className="text-sm text-indigo-200">Step 1</div>
            <h2 className="mt-2 text-lg font-medium text-white">You act</h2>
            <p className="mt-2 text-sm text-slate-200 leading-relaxed">
              Type any action, or click one of the suggested options.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-6 fade-in-up">
            <div className="text-sm text-indigo-200">Step 2</div>
            <h2 className="mt-2 text-lg font-medium text-white">AI narrates</h2>
            <p className="mt-2 text-sm text-slate-200 leading-relaxed">
              The AI responds as a game master, moving the plot forward toward an ending.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-6 fade-in-up">
            <div className="text-sm text-indigo-200">Step 3</div>
            <h2 className="mt-2 text-lg font-medium text-white">Suggestions appear</h2>
            <p className="mt-2 text-sm text-slate-200 leading-relaxed">
              You always get three next actions to keep momentum, but you’re never locked in.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/play"
            className="inline-flex items-center justify-center rounded-full bg-indigo-500/90 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
          >
            Start playing
          </Link>
        </div>
      </div>
    </main>
  );
}
