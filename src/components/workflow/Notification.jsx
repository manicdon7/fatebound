'use client';

import React, { useEffect } from 'react';

export default function Notification({ message, type, onClear }) {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClear();
            }, 3000); // Auto-dismiss after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [message, onClear]);

    if (!message) return null;

    const baseClasses = 'fixed top-5 right-5 p-4 rounded-lg shadow-lg text-sm font-medium';
    const typeClasses = type === 'success'
        ? 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30'
        : 'bg-red-500/20 text-red-100 border-red-400/30';

    return (
        <div className={`fixed top-8 right-8 z-50 p-5 rounded-2xl shadow-2xl text-sm font-semibold 
                  backdrop-blur-xl border ${typeClasses} animate-in slide-in-from-right`}>
            <div className="flex items-center gap-3">
                <span className="text-xl">
                    {type === 'success' ? '✅' : '⚠️'}
                </span>
                <span>{message}</span>
            </div>
        </div>
    );


}
