import { Handle, Position } from '@xyflow/react';

export default function ServiceNode({ data }) {
  return (
    <div className={`px-4 py-3 shadow-xl rounded-xl border-2 bg-white min-w-[200px] ${data.isProcessing ? 'border-blue-500 animate-pulse' : 'border-gray-200'}`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-400" />
      
      <div className="flex items-center pb-2 border-b mb-2">
        <span className="text-lg mr-2">{data.icon}</span>
        <div className="text-sm font-bold text-gray-800 uppercase tracking-wider">{data.label}</div>
      </div>

      <div className="text-xs text-gray-500 mb-2">
        {data.description}
      </div>

      {/* Dynamic configuration UI inside the node */}
      {data.type === 'llm' && (
        <select className="text-[10px] w-full p-1 border rounded bg-gray-50">
          <option>GLM-4 (OpenRouter)</option>
          <option>Claude 3.5 Sonnet</option>
          <option>GPT-4o</option>
        </select>
      )}

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-400" />
      
      {data.status === 'completed' && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
      )}
    </div>
  );
}