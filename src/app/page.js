import ChatUI from "../components/Chat/ChatUI";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold mt-8 mb-4">Fatebound</h1>
      <ChatUI />
    </main>
  );
}
