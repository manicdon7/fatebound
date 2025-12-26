"use client";
import React, { useState } from "react";

export default function MessageInput({ onSend, disabled }) {
  const [input, setInput] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <form onSubmit={submit} className="flex gap-3 mt-3">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        placeholder="What do you do?"
        autoComplete="off"
        className="
          flex-1 px-4 py-3
          rounded-lg
          border border-slate-300
          bg-white
          text-slate-800
          focus:outline-none focus:ring-2 focus:ring-slate-400
          transition
        "
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="
          px-5 py-3
          rounded-lg
          bg-slate-900 text-white
          font-medium
          hover:bg-slate-800
          disabled:opacity-40
          transition
        "
      >
        Send
      </button>
    </form>
  );
}
