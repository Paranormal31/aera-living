import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebaseAdmin";

type ChatLogInput = {
  sessionId?: string;
  path?: string;
  userAgent?: string;
  question: string;
  answer?: string;
  status: "ok" | "error";
  error?: string;
  model: string;
  retrievedDocIds?: string[];
  fallbackUsed?: boolean;
  confidenceBand?: "low" | "medium" | "high";
};

const WEBHOOK_URL = process.env.CHATBOT_GSHEET_WEBHOOK_URL;

export async function logChatQuery(input: ChatLogInput) {
  const db = getDb();

  await db.collection("chatbotQueries").add({
    sessionId: input.sessionId ?? null,
    path: input.path ?? null,
    userAgent: input.userAgent ?? null,
    question: input.question,
    answer: input.answer ?? null,
    status: input.status,
    error: input.error ?? null,
    model: input.model,
    retrievedDocIds: input.retrievedDocIds ?? [],
    fallbackUsed: input.fallbackUsed ?? false,
    confidenceBand: input.confidenceBand ?? null,
    createdAt: FieldValue.serverTimestamp(),
  });

  if (!WEBHOOK_URL) {
    return;
  }

  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      sessionId: input.sessionId ?? "",
      path: input.path ?? "",
      userAgent: input.userAgent ?? "",
      question: input.question,
      answer: input.answer ?? "",
      status: input.status,
      error: input.error ?? "",
      model: input.model,
      retrievedDocIds: input.retrievedDocIds ?? [],
      fallbackUsed: input.fallbackUsed ?? false,
      confidenceBand: input.confidenceBand ?? "",
    }),
  });
}
