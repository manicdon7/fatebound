'use client';

import React, { useState, useEffect } from 'react';

export default function WorkflowControls({ onSave, onLoad, onDelete }) {
    const [workflows, setWorkflows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchWorkflows() {
        setIsLoading(true);
        try {
            const response = await fetch('/api/workflows');
            const data = await response.json();
            setWorkflows(data);
        } catch (error) {
            console.error('Failed to fetch workflows:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchWorkflows();
    }, []);

    const handleSave = () => {
        const name = prompt('Enter a name for your workflow:');
        if (name) {
            onSave(name).then(fetchWorkflows); // Refresh list after saving
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this workflow?')) {
            await onDelete(id);
            fetchWorkflows(); // Refresh list after deleting
        }
    };

    return (
        <div className="mt-6 pt-6 border-t border-white/30">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Saved Workflows</h3>
                <button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 
                   text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                    Save Current
                </button>
            </div>

            <div className="bg-white/50 backdrop-blur-lg rounded-xl p-4 h-48 overflow-y-auto border border-white/20 shadow-inner">
                {isLoading ? (
                    <p className="text-slate-500 text-center py-8">Loading workflows...</p>
                ) : workflows.length > 0 ? (
                    <ul className="space-y-2">
                        {workflows.map(wf => (
                            <li
                                key={wf._id}
                                className="flex justify-between items-center p-3 bg-white/70 backdrop-blur-sm rounded-lg 
                         shadow-sm hover:shadow-md transition-all border border-white/30"
                            >
                                <span className="font-semibold text-slate-700 truncate pr-2">{wf.name}</span>
                                <div className="flex gap-3 text-xs">
                                    <button
                                        onClick={() => onLoad(wf._id)}
                                        className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                                    >
                                        Load
                                    </button>
                                    <button
                                        onClick={() => handleDelete(wf._id)}
                                        className="text-red-600 hover:text-red-800 font-medium hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-500 text-center py-8 italic">No saved workflows yet.</p>
                )}
            </div>
        </div>
    );
}
