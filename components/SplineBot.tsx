"use client";

import dynamic from "next/dynamic";
import { FormEvent, useEffect, useState } from "react";

const RobotScene = dynamic(() => import("@/components/interactive-robot").then((mod) => mod.Scene), {
  ssr: false,
});

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type DebugInfo = {
  status?: number;
  error?: string;
  detail?: string;
  debug?: {
    endpoint?: string;
    model?: string;
    providerStatus?: number;
  };
};

const CHAT_DEBUG_ENABLED = process.env.NEXT_PUBLIC_CHAT_DEBUG === "true";

function getOrCreateSessionId() {
  if (typeof window === "undefined") {
    return "server-session";
  }

  const key = "blink_chat_session_id";
  const existing = window.localStorage.getItem(key);
  if (existing) {
    return existing;
  }

  const created = `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  window.localStorage.setItem(key, created);
  return created;
}

export default function SplineBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastDebug, setLastDebug] = useState<DebugInfo | null>(null);
  const [sessionId, setSessionId] = useState("pending-session");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I can help with stays, locations, and booking details.",
    },
  ]);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = input.trim();

    if (!trimmed || isLoading) {
      return;
    }

    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setLastDebug(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
          metadata: {
            sessionId,
            path: typeof window !== "undefined" ? window.location.pathname : "/",
          },
        }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as
          | {
              error?: string;
              detail?: string;
              debug?: { endpoint?: string; model?: string; providerStatus?: number };
            }
          | null;

        setLastDebug({
          status: response.status,
          error: errorPayload?.error || "Request failed",
          detail: errorPayload?.detail || "No error detail returned.",
          debug: errorPayload?.debug,
        });

        const fallbackText = "Sorry, I could not respond right now. Please try again in a moment.";
        setMessages((prev) => [...prev, { role: "assistant", content: fallbackText }]);
        return;
      }

      const data = (await response.json()) as { message?: string };
      const botReply = data.message?.trim() || "I am here, but I got an empty response.";
      setMessages((prev) => [...prev, { role: "assistant", content: botReply }]);
    } catch (error) {
      setLastDebug({
        error: "Network issue",
        detail: error instanceof Error ? error.message : "Unknown client error",
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network issue. Please check connection and retry." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function openChat() {
    setIsMounted(true);
    setIsClosing(false);
    setIsOpen(true);
  }

  function closeChat() {
    setIsClosing(true);
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isClosing) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setIsMounted(false);
      setIsClosing(false);
    }, 220);

    return () => clearTimeout(timer);
  }, [isClosing]);

  return (
    <>
      {isMounted && (
        <div
          className="fixed bottom-4 right-[calc(1rem+12.5rem)] z-[70] w-[320px] max-w-[calc(100vw-13.5rem)] overflow-hidden rounded-2xl border border-white/20 bg-[#0f1724]/95 shadow-2xl backdrop-blur sm:right-[calc(1rem+13rem)] sm:max-w-[380px]"
          style={{
            animation: isClosing
              ? "blink-chat-exit 220ms ease-in forwards"
              : "blink-chat-enter 220ms ease-out both",
          }}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="text-sm font-semibold text-white">Blink - The AeraLiving Assistant</p>
            <button
              type="button"
              onClick={closeChat}
              className="rounded-md px-2 py-1 text-xs text-white/80 hover:bg-white/10"
            >
              Close
            </button>
          </div>

          {CHAT_DEBUG_ENABLED && lastDebug && (
            <div className="border-b border-amber-300/30 bg-amber-400/10 px-4 py-2 text-[11px] text-amber-100">
              <p className="font-semibold">Debug</p>
              <p>{`status: ${lastDebug.status ?? "n/a"}`}</p>
              <p>{`error: ${lastDebug.error ?? "n/a"}`}</p>
              <p className="break-words">{`detail: ${lastDebug.detail ?? "n/a"}`}</p>
              <p>{`providerStatus: ${lastDebug.debug?.providerStatus ?? "n/a"}`}</p>
              <p className="break-all">{`model: ${lastDebug.debug?.model ?? "n/a"}`}</p>
            </div>
          )}

          <div className="h-72 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto bg-cyan-500 text-white"
                    : "mr-auto bg-white/10 text-slate-100"
                }`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && <p className="text-xs text-white/60">Assistant is typing...</p>}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/10 p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about locations, stays, pricing..."
                className="flex-1 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-[60] pointer-events-auto h-[180px] w-[180px] sm:h-[220px] sm:w-[220px]">
        <RobotScene
          robotProps={{
            dialogueEnabled: false,
            debugTelemetry: false,
            onBotClick: () => {
              if (isOpen) {
                closeChat();
              } else {
                openChat();
              }
            },
          }}
          containerStyle={{
            width: "100%",
            height: "100%",
            background: "transparent",
          }}
        />
      </div>
      <style jsx global>{`
        @keyframes blink-chat-enter {
          0% {
            opacity: 0;
            transform: translate3d(10px, 18px, 0) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes blink-chat-exit {
          0% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate3d(8px, 14px, 0) scale(0.97);
          }
        }
      `}</style>
    </>
  );
}
