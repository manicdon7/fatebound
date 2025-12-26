"use client";
import React, { useRef, useEffect } from "react";
import TypingIndicator from "./TypingIndicator";

export default function MessageList({ messages, isTyping }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 chat-scrollbar">
      {messages.map((msg, idx) => {
        const isUser = msg.role === "user";

        return (
          <div
            key={idx}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
                max-w-[75%]
                px-4 py-3
                text-[15px] leading-relaxed
                rounded-xl
                shadow-sm
                whitespace-pre-line
                animate-messageIn
                ${
                  isUser
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-800"
                }
              `}
              dangerouslySetInnerHTML={{ __html: msg.content }}
            />
          </div>
        );
      })}

      {isTyping && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
}
