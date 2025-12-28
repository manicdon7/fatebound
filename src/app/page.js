import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Document AI Workflow Builder</h1>
        <p className="text-lg text-gray-600 mb-8">The main application is available at the /workflow path.</p>
        <Link href="/workflow" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
          Go to Workflow Builder
        </Link>
      </div>
    </main>
  );
}
