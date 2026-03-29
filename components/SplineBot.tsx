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

        const fallbackText =
          "Sorry I am currently under developement, stay tuned tho.\n\nIn the meantime, contact Guest Operations Head: Achal Pookie: Contact: +91 8234079482, aeraliving.llp@gmail.com";
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
          data-chat-panel="true"
          className="fixed bottom-[calc(1rem+10.5rem)] left-7 right-7 z-[70] overflow-hidden rounded-3xl border border-[#8fb6dc]/25 bg-[#071325] shadow-[0_28px_65px_-28px_rgba(2,10,22,0.92)] sm:bottom-4 sm:left-auto sm:right-[calc(1rem+13rem)] sm:w-[380px]"
          style={{
            animation: isClosing
              ? "blink-chat-exit 220ms ease-in forwards"
              : "blink-chat-enter 220ms ease-out both",
          }}
        >
          <button
            type="button"
            onClick={closeChat}
            className="absolute right-3 top-3 z-10 rounded-full border border-white/15 bg-[#071325]/90 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-white/35 hover:bg-white/10"
          >
            Close
          </button>

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

          <div className="max-h-[42vh] min-h-[230px] space-y-3 overflow-y-auto bg-gradient-to-b from-[#0a1b31]/85 to-[#061020]/85 px-4 pb-4 pt-14 sm:max-h-[420px] sm:min-h-[250px]">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed shadow-lg ${
                  message.role === "user"
                    ? "ml-auto rounded-br-md bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950"
                    : "mr-auto rounded-bl-md border border-white/10 bg-white/12 text-slate-100"
                }`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <p className="text-xs font-medium text-cyan-100/80">Blink is typing...</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/10 bg-[#050d1b]/80 p-3">
            <div className="flex items-center gap-2 rounded-2xl border border-white/12 bg-white/5 p-1.5">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about stays, pricing, or locations..."
                className="flex-1 bg-transparent px-2.5 py-2 text-sm text-white placeholder:text-slate-400 outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-[60] pointer-events-auto h-[160px] w-[160px] sm:h-[220px] sm:w-[220px]">
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
