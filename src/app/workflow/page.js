import WorkflowBuilder from '@/components/workflow/WorkflowBuilder';

export const metadata = {
  title: 'Document AI Workflow Builder',
  description: 'Visually build and run document processing workflows.',
};

export default function WorkflowPage() {
  return (
    <main className="w-full h-screen bg-gray-50">
      <header className="p-4 border-b bg-white">
        <h1 className="text-xl font-semibold">Document AI Workflow Builder</h1>
      </header>
      <WorkflowBuilder />
    </main>
  );
}
