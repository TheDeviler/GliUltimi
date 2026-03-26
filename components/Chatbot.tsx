"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { CHATBOT_RESPONSES } from "@/lib/constants";
import type { ChatMessage } from "@/lib/types";

function findResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [patterns, response] of Object.entries(CHATBOT_RESPONSES)) {
    const keywords = patterns.split("|");
    if (keywords.some((kw) => lower.includes(kw))) {
      return response;
    }
  }
  return "Non ho informazioni specifiche su questo argomento. Prova a chiedere informazioni su emissioni CO₂, score ESG, compliance normativa o risparmio energetico.";
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Ciao! Sono il tuo assistente ESG. Chiedimi informazioni sui tuoi dati ambientali, sociali o di governance.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI response with delay
    setTimeout(() => {
      const response = findResponse(userMsg.content);

      // ============================================================
      // REAL GEMINI CHAT INTEGRATION (uncomment for production)
      // ============================================================
      // const res = await fetch("/api/chat", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ message: userMsg.content, history: messages }),
      // });
      // const data = await res.json();
      // const response = data.reply;
      // ============================================================

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 600);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105",
          isOpen
            ? "bg-slate-800 text-white"
            : "bg-emerald-600 text-white hover:bg-emerald-700"
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[480px] w-[380px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-200 bg-emerald-600 px-4 py-3">
            <Bot className="h-5 w-5 text-white" />
            <div>
              <p className="text-sm font-semibold text-white">Assistente ESG</p>
              <p className="text-xs text-emerald-100">Powered by Eco360 AI</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    msg.role === "user" ? "bg-blue-100" : "bg-emerald-100"
                  )}
                >
                  {msg.role === "user" ? (
                    <User className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Bot className="h-4 w-4 text-emerald-600" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Chiedi qualcosa..."
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
