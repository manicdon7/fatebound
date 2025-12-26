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
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setSuggestions([]);

    // Build next message list safely
    const nextMessages = [
      ...messages,
      { role: "user", content: trimmed },
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

      setSuggestions((data.suggestions || []).slice(0, 3));
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "The world falters, as if something beyond the veil interrupted the tale. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="mx-auto w-full max-w-4xl h-[calc(100vh-4rem)] px-4 py-6 sm:px-6">
        <div className="h-full rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-white">
                  Fatebound
                </h1>
                <p className="text-sm text-slate-300 mt-1">
                  An interactive story where choices shape the ending.
                </p>
              </div>
              <div className="text-xs text-slate-400 mt-1">MVP</div>
            </div>
          </div>

          <div className="h-[calc(100%-76px)] flex flex-col">
            <MessageList messages={messages} isTyping={loading} />

            <div className="px-5 py-4 border-t border-white/10 bg-black/20">
              <Suggestions
                suggestions={suggestions}
                onSelect={handleSend}
                disabled={loading}
              />
              <MessageInput onSend={handleSend} disabled={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
