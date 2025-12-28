'use client';

import React from 'react';

// Define the step types with metadata
const WORKFLOW_STEPS = [
  {
    type: 'ocr',
    label: 'OCR Document',
    icon: '🔍',
    description: 'Extract text from images/PDFs',
    color: 'border-blue-500'
  },
  {
    type: 'classify',
    label: 'Classify',
    icon: '🏷️',
    description: 'Identify document type using LLM',
    color: 'border-purple-500'
  },
  {
    type: 'summarize',
    label: 'Summarize',
    icon: '📝',
    description: 'Get key insights from text',
    color: 'border-green-500'
  },
  {
    type: 'export',
    label: 'Export Data',
    icon: '📤',
    description: 'Save results to JSON/Database',
    color: 'border-orange-500'
  },
];

export default function Sidebar() {
  const onDragStart = (event, step) => {
    // Pass the entire step object as metadata
    event.dataTransfer.setData('application/reactflow', JSON.stringify(step));
    event.dataTransfer.effectAllowed = 'move';

    // Optional: Add a ghost image or style during drag
    event.target.style.opacity = '0.5';
  };

  const onDragEnd = (event) => {
    event.target.style.opacity = '1';
  };

  return (
    <aside className="w-80 p-8 bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-2xl h-full flex flex-col gap-8 border-r border-white/10 shadow-2xl">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Step Library</h2>
        <p className="text-sm text-slate-300 mt-2">Drag components to build intelligent document pipelines.</p>
      </div>

      <div className="flex flex-col gap-4">
        {WORKFLOW_STEPS.map((step) => (
          <div
            key={step.type}
            className={`group p-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl cursor-grab 
                     hover:bg-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-300 
                     active:cursor-grabbing`}
            draggable
            onDragStart={(e) => onDragStart(e, step)}
            onDragEnd={onDragEnd}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl group-hover:scale-125 transition-transform duration-300">{step.icon}</span>
              <div>
                <h4 className="font-bold text-white text-base">{step.label}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
        <p className="text-[11px] uppercase font-bold text-indigo-300 tracking-widest mb-2">Pro Tip</p>
        <p className="text-sm text-slate-200 leading-relaxed">
          Connect nodes using the <strong>right handle → left handle</strong> to define execution order.
        </p>
      </div>
    </aside>
  );
}