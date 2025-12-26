import ChatUI from "@/components/Chat/ChatUI";

export const metadata = {
  title: "Play | Fatebound",
  description: "Play an AI-powered interactive story.",
};

export default function PlayPage() {
  return (
    <main className="min-h-screen w-full bg-linear-to-b from-[#05060a] via-[#070a14] to-[#0b1022]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="orb-float absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="orb-float-slow absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-3xl" />
      </div>
      <div className="relative fade-in-up">
        <ChatUI />
      </div>
    </main>
  );
}
