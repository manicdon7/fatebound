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
    <aside className="w-72 p-6 bg-white border-r border-slate-200 h-full flex flex-col gap-6 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Step Library</h2>
        <p className="text-sm text-slate-500 mt-1">Drag and drop components to build your pipeline.</p>
      </div>

      <div className="flex flex-col gap-3">
        {WORKFLOW_STEPS.map((step) => (
          <div
            key={step.type}
            className={`group p-4 bg-slate-50 border-2 border-dashed rounded-xl cursor-grab 
                       hover:border-solid hover:bg-white hover:shadow-md transition-all 
                       active:cursor-grabbing ${step.color}`}
            draggable
            onDragStart={(e) => onDragStart(e, step)}
            onDragEnd={onDragEnd}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform">{step.icon}</span>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-800 text-sm">{step.label}</span>
                <span className="text-[11px] text-slate-500 leading-tight">{step.description}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto p-4 bg-indigo-50 rounded-lg border border-indigo-100">
        <p className="text-[10px] uppercase font-bold text-indigo-600 tracking-widest mb-1">Tip</p>
        <p className="text-xs text-indigo-700 leading-relaxed">
          Connect nodes from <strong>Right Handle</strong> to <strong>Left Handle</strong> to define logic flow.
        </p>
      </div>
    </aside>
  );
}