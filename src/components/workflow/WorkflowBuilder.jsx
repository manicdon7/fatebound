'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Sidebar from './Sidebar';
import ServiceNode from '@/lib/ServiceNode';

const nodeTypes = {
  service: ServiceNode,
};

const initialNodes = [
  {
    id: 'node-0',
    type: 'service',
    data: { label: 'Input', icon: '📁', description: 'Upload PDF/Images', type: 'input' },
    position: { x: 100, y: 200 },
  },
];

export default function AdvancedWorkflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Handlers moved INSIDE the component ---

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const dataString = event.dataTransfer.getData('application/reactflow');
      if (!dataString || !reactFlowInstance) return;

      const step = JSON.parse(dataString);
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node_${Date.now()}`,
        type: 'service',
        position,
        data: { 
          label: step.label, 
          icon: step.icon, 
          type: step.type,
          status: 'idle',
          description: step.description,
          isProcessing: false
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const runAdvancedWorkflow = async () => {
    if (nodes.length < 2) {
        alert("Please add at least one processing step.");
        return;
    }

    setIsLoading(true);
    
    // 1. Get execution order using DAG logic (Topological Sort)
    const executionOrder = getExecutionPath(nodes, edges);
    
    // 2. Reset status
    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, status: 'idle', isProcessing: false } })));

    for (const nodeId of executionOrder) {
      // Set current node to processing
      setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, isProcessing: true } } : n));
      
      try {
        // Here you would call your API: fetch('/api/workflow/execute', { ... })
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        // Mark current node as completed
        setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, isProcessing: false, status: 'completed' } } : n));
      } catch (error) {
        setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, isProcessing: false, status: 'error' } } : n));
        break;
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 relative h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#cbd5e1" variant="dots" />
          <Controls />
          
          <Panel position="top-right" className="bg-white p-4 rounded-xl shadow-2xl border border-slate-200 w-80">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Workflow Control</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isLoading ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                    {isLoading ? 'RUNNING' : 'READY'}
                </span>
            </div>
            
            <button 
              onClick={runAdvancedWorkflow}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
              ) : (
                <>🚀 Execute Pipeline</>
              )}
            </button>
            <p className="text-[10px] text-slate-400 mt-3 text-center">Nodes execute from left to right based on connections.</p>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

/**
 * Advanced Helper: Topological Sort (Kahn's Algorithm)
 * Ensures that if A -> B, A always executes before B.
 */
function getExecutionPath(nodes, edges) {
    const adjacencyList = new Map();
    const inDegree = new Map();
    
    nodes.forEach(node => {
        adjacencyList.set(node.id, []);
        inDegree.set(node.id, 0);
    });

    edges.forEach(edge => {
        adjacencyList.get(edge.source).push(edge.target);
        inDegree.set(edge.target, inDegree.get(edge.target) + 1);
    });

    const queue = nodes.filter(node => inDegree.get(node.id) === 0).map(node => node.id);
    const sorted = [];

    while (queue.length > 0) {
        const u = queue.shift();
        sorted.push(u);

        adjacencyList.get(u).forEach(v => {
            inDegree.set(v, inDegree.get(v) - 1);
            if (inDegree.get(v) === 0) queue.push(v);
        });
    }

    return sorted.length === nodes.length ? sorted : nodes.map(n => n.id);
}