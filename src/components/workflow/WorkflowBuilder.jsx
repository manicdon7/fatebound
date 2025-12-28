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
import WorkflowControls from './WorkflowControls';
import Notification from './Notification';

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState([]);
  const [currentWorkflowId, setCurrentWorkflowId] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

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

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setResults([]);
  };

  const runAdvancedWorkflow = async () => {
    if (!selectedFile) {
      setNotification({ message: 'Please select a file to process.', type: 'error' });
      return;
    }
    if (nodes.length < 2) {
      setNotification({ message: 'Please add at least one processing step.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setResults([]);
    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, status: 'idle', isProcessing: false } })));

    // 1. Upload the file
    const formData = new FormData();
    formData.append('file', selectedFile);
    const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
    const uploadData = await uploadRes.json();

    if (!uploadData.success) {
      setNotification({ message: 'File upload failed.', type: 'error' });
      setIsLoading(false);
      return;
    }

    // 2. Get execution order and run steps
    const executionOrder = getExecutionPath(nodes, edges);
    let currentData = uploadData.filepath; // Initial data for OCR
    const tempResults = [];

    for (const nodeId of executionOrder) {
      const node = nodes.find(n => n.id === nodeId);
      if (node.data.type === 'input') continue; // Skip the input node

      setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, isProcessing: true } } : n));

      try {
        const stepRes = await fetch('/api/workflows/step', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: node.data.type, data: currentData }),
        });

        if (!stepRes.ok) {
          throw new Error(`Step ${node.data.type} failed`);
        }

        const stepData = await stepRes.json();
        currentData = stepData.result; // Output of this step is input for the next
        tempResults.push({ step: node.data.label, result: currentData });

        setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, isProcessing: false, status: 'completed' } } : n));
      } catch (error) {
        setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, isProcessing: false, status: 'error' } } : n));
        break; // Stop workflow on error
      }
    }

    setResults(tempResults);
    setIsLoading(false);
  };

  const handleSaveWorkflow = async (name) => {
    try {
      const payload = { name, nodes, edges };
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to save workflow');
      const data = await response.json();
      setCurrentWorkflowId(data.insertedId);
      setNotification({ message: 'Workflow saved successfully!', type: 'success' });
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Error saving workflow.', type: 'error' });
    }
  };

  const handleLoadWorkflow = async (id) => {
    try {
      const response = await fetch(`/api/workflows/${id}`);
      if (!response.ok) throw new Error('Failed to load workflow');
      const data = await response.json();
      setNodes(data.nodes || []);
      setEdges(data.edges || []);
      setCurrentWorkflowId(data._id);
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Error loading workflow.', type: 'error' });
    }
  };

  const handleDeleteWorkflow = async (id) => {
    try {
      const response = await fetch(`/api/workflows/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete workflow');
      if (currentWorkflowId === id) {
        setCurrentWorkflowId(null);
        setNodes(initialNodes);
        setEdges([]);
      }
      setNotification({ message: 'Workflow deleted.', type: 'success' });
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Error deleting workflow.', type: 'error' });
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 overflow-hidden">
      <Notification message={notification.message} type={notification.type} onClear={() => setNotification({ message: '', type: '' })} />
      <Sidebar />
      <div className="flex-1 relative h-full bg-white/5 backdrop-blur-2xl">
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
          <Background color="#e2e8f0" gap={20} variant="dots" />
          <Controls />

          <Panel position="top-right" className="mr-6 mt-6">
            <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">Pipeline Control</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${isLoading
                    ? 'bg-amber-100/80 text-amber-700'
                    : 'bg-emerald-100/80 text-emerald-700'
                  }`}>
                  {isLoading ? 'PROCESSING' : 'READY'}
                </span>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Source Document
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl 
                     file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white 
                     hover:file:bg-indigo-700 cursor-pointer transition-all"
                  />
                </div>

                <button
                  onClick={runAdvancedWorkflow}
                  disabled={isLoading || !selectedFile}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 
                   disabled:from-slate-300 disabled:to-slate-400 text-white font-bold py-4 rounded-xl 
                   transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 
                   disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 border-3 border-white/30 border-t-white animate-spin rounded-full" />
                      Executing Pipeline...
                    </>
                  ) : (
                    <>
                      <span className="text-xl">⚡</span>
                      Execute Document Pipeline
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/30">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Final Output</h3>
                <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 h-40 overflow-y-auto font-mono text-xs text-slate-700 border border-white/20">
                  {results.length > 0 ? (
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(results[results.length - 1].result, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-slate-500 italic">Pipeline results will appear here after execution...</p>
                  )}
                </div>
              </div>

              <WorkflowControls
                onSave={handleSaveWorkflow}
                onLoad={handleLoadWorkflow}
                onDelete={handleDeleteWorkflow}
              />
            </div>
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