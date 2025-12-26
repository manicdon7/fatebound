"use client";
import React from "react";

export default function Suggestions({ suggestions, onSelect, disabled }) {
  if (!suggestions.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {suggestions.map((s, idx) => (
        <button
          key={idx}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(s)}
          className="
            px-3 py-1.5
            text-sm
            rounded-full
            border border-white/10
            text-slate-200
            bg-white/5
            hover:bg-white/10
            transition
            disabled:opacity-40
          "
        >
          {s}
        </button>
      ))}
    </div>
  );
}
