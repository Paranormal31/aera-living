import { NextResponse } from "next/server";
import { WEBSITE_KNOWLEDGE } from "@/lib/chatbotKnowledge";
import { logChatQuery } from "@/lib/chatbotTelemetry";

type IncomingMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type ChatRequestBody = {
  messages?: IncomingMessage[];
  metadata?: {
    sessionId?: string;
    path?: string;
  };
};

const DEFAULT_GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.1-8b-instant";

function resolveModel(rawModel?: string) {
  const requested = (rawModel || "").trim();
  if (!requested) {
    return DEFAULT_MODEL;
  }

  if (requested === "llama3-8b-8192" || requested === "llama3-70b-8192") {
    return DEFAULT_MODEL;
  }

  return requested;
}

function getLastUserQuestion(messages: IncomingMessage[]) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === "user" && messages[i].content?.trim()) {
      return messages[i].content.trim();
    }
  }
  return "";
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY || process.env.CHATBOT_LLM_API_KEY;
  const endpoint = process.env.CHATBOT_LLM_API_URL || DEFAULT_GROQ_ENDPOINT;
  const model = resolveModel(process.env.CHATBOT_LLM_MODEL);

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing API key. Set GROQ_API_KEY or CHATBOT_LLM_API_KEY." },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as ChatRequestBody;
    const incoming = body.messages ?? [];
    const metadata = body.metadata ?? {};

    const messages: IncomingMessage[] = [
      {
        role: "system",
        content: `${WEBSITE_KNOWLEDGE}\n\nYou are Aera Living's concierge assistant.`,
      },
      ...incoming
        .filter((message) => message?.content?.trim())
        .slice(-12)
        .map((message) => ({
          role: message.role,
          content: message.content.trim(),
        })),
    ];

    const question = getLastUserQuestion(messages);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 512,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      try {
        await logChatQuery({
          sessionId: metadata.sessionId,
          path: metadata.path,
          userAgent: request.headers.get("user-agent") ?? undefined,
          question,
          status: "error",
          error: errorText,
          model,
        });
      } catch (logError) {
        console.error("Failed to store chat error log:", logError);
      }

      return NextResponse.json(
        {
          error: "Groq request failed.",
          detail: errorText,
          debug: {
            endpoint,
            model,
            providerStatus: response.status,
          },
        },
        { status: 500 },
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };

    const assistantText = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!assistantText) {
      return NextResponse.json(
        {
          error: "Empty assistant response.",
          detail: "Provider returned no text content.",
          debug: { endpoint, model },
        },
        { status: 500 },
      );
    }

    try {
      await logChatQuery({
        sessionId: metadata.sessionId,
        path: metadata.path,
        userAgent: request.headers.get("user-agent") ?? undefined,
        question,
        answer: assistantText,
        status: "ok",
        model,
      });
    } catch (logError) {
      console.error("Failed to store chat query log:", logError);
    }

    return NextResponse.json({ message: assistantText });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected server error.",
        detail: error instanceof Error ? error.message : "unknown",
      },
      { status: 500 },
    );
  }
}
