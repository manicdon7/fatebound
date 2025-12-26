"use client";
import React, { useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import Suggestions from "./Suggestions";

export default function ChatUI() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "You awaken at the edge of an unfamiliar path. The air is still, as if the world itself is waiting for your move.",
    },
  ]);

  const [suggestions, setSuggestions] = useState([
    "Look around",
    "Walk forward",
    "Call out into the silence",
  ]);

  const [loading, setLoading] = useState(false);

  const handleSend = async (input) => {
    if (!input.trim() || loading) return;

    setLoading(true);
    setSuggestions([]);

    // Build next message list safely
    const nextMessages = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(nextMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("API error");
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.story },
      ]);

      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "The world falters. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          Fatebound
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          An interactive story where choices shape the ending.
        </p>
      </div>

      {/* Chat */}
      <div className="h-[60vh] flex flex-col">
        <MessageList messages={messages} isTyping={loading} />
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-slate-200 bg-slate-50">
        <Suggestions
          suggestions={suggestions}
          onSelect={handleSend}
          disabled={loading}
        />
        <MessageInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
}
