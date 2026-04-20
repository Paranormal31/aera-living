import { NextResponse } from "next/server";
import { processBookingIntent, type BookingIntentInput } from "@/lib/bookingIntent";
import { CONTACT_CTA } from "@/lib/chatbotKnowledge";
import { retrieveContext } from "@/lib/chatbotRetrieval";
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

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function getLastUserQuestion(messages: IncomingMessage[]) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === "user" && messages[i].content?.trim()) {
      return messages[i].content.trim();
    }
  }
  return "";
}

function shouldMarkFallback(answer: string, confidenceBand: "low" | "medium" | "high") {
  if (confidenceBand === "low") {
    return true;
  }

  const lower = answer.toLowerCase();
  return (
    lower.includes("not sure") ||
    lower.includes("i don't know") ||
    lower.includes("unable to confirm") ||
    lower.includes("please contact")
  );
}

function parseBookingPayload(assistantText: string): {
  cleanText: string;
  payload?: BookingIntentInput;
} {
  const marker = "BOOKING_INTENT_PAYLOAD:";
  const idx = assistantText.indexOf(marker);
  if (idx === -1) {
    return { cleanText: assistantText };
  }

  const payloadRaw = assistantText.slice(idx + marker.length).trim();
  const cleanText = assistantText.slice(0, idx).trim();

  try {
    const parsed = JSON.parse(payloadRaw) as BookingIntentInput;
    return { cleanText, payload: parsed };
  } catch {
    return { cleanText };
  }
}

function hasCompleteBookingPayload(payload: BookingIntentInput) {
  const propertySlug = (payload.propertySlug || "").trim();
  const propertyName = (payload.propertyName || "").trim();
  const checkIn = (payload.checkIn || "").trim();
  const checkOut = (payload.checkOut || "").trim();
  const name = (payload.name || "").trim();
  const contact = (payload.contact || "").trim();
  const guests = Number(payload.guests);

  return Boolean(
    (propertySlug || propertyName) &&
      checkIn &&
      checkOut &&
      name &&
      contact &&
      Number.isFinite(guests) &&
      guests > 0,
  );
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
    const recentMessages = incoming
      .filter((message) => message?.content?.trim())
      .slice(-12)
      .map((message) => ({
        role: message.role,
        content: message.content.trim(),
      }));

    const question = getLastUserQuestion(recentMessages);
    const retrieved = retrieveContext(question, metadata.path, 7);
    const todayIso = new Date().toISOString().slice(0, 10);

    const systemPrompt = [
      "You are Blink, the concierge assistant for AeraLiving.",
      "Use only the retrieved WEBSITE_CONTEXT to answer factual questions about properties, policies, amenities, pricing, bookings, and services.",
      "If WEBSITE_CONTEXT does not clearly support an answer, explicitly say you are not sure and then share a clear contact/booking CTA.",
      "Do not invent property details, prices, amenities, availability, legal terms, or policies.",
      "Booking flow rules:",
      "1) For booking intent, collect: property name, check-in (YYYY-MM-DD), check-out (YYYY-MM-DD), guests, full name, and contact (phone or email).",
      "2) Ask for only ONE missing field per response. Never ask multiple missing fields in one reply.",
      "3) Ask fields in this strict order: property name -> check-in -> check-out -> guests -> full name -> contact.",
      "4) Keep each booking question short and direct (one question sentence).",
      "5) If user already provided some fields, infer them and ask only the next single missing field in order.",
      `5.1) Today's date is ${todayIso}. Validate dates immediately when user provides them.`, 
      "5.2) If check-in is in the past, reply immediately that past check-in is not allowed and ask for a new check-in date. Do not continue to next fields until corrected.",
      "5.3) If check-out is not after check-in, reply immediately and ask again for a valid check-out date.",
      "6) When all fields are present, append EXACTLY one machine line at the end:",
      "BOOKING_INTENT_PAYLOAD:{\"propertyName\":\"Doons Den\",\"checkIn\":\"YYYY-MM-DD\",\"checkOut\":\"YYYY-MM-DD\",\"guests\":2,\"name\":\"...\",\"contact\":\"...\",\"message\":\"...\",\"website\":\"\"}",
      "7) Do not add any extra text after that payload line.",
      "Keep responses concise, practical, and booking-oriented.",
      `Required contact CTA when uncertain: ${CONTACT_CTA}`,
      "WEBSITE_CONTEXT:",
      retrieved.snippet,
    ].join("\n\n");

    const messages: IncomingMessage[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...recentMessages,
    ];

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        max_tokens: 650,
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
          retrievedDocIds: retrieved.docIds,
          confidenceBand: retrieved.confidenceBand,
          fallbackUsed: true,
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

    const parsed = parseBookingPayload(assistantText);
    let finalMessage = parsed.cleanText;

    if (parsed.payload && hasCompleteBookingPayload(parsed.payload)) {
      const bookingResult = await processBookingIntent({
        ...parsed.payload,
        source: "chatbot",
        sessionId: metadata.sessionId,
        path: metadata.path,
        userAgent: request.headers.get("user-agent") ?? undefined,
        ip: getClientIp(request),
      });

      if (bookingResult.ok) {
        finalMessage = [
          parsed.cleanText || "Great, I have checked your request.",
          "Availability: Available",
          `Final price: ₹${bookingResult.finalPrice.toLocaleString("en-IN")} (${bookingResult.nights} night${bookingResult.nights === 1 ? "" : "s"} at ₹${bookingResult.pricePerNight.toLocaleString("en-IN")}/night).`,
          `Your inquiry is registered. Reference ID: ${bookingResult.inquiryId}. Our team will contact you shortly.`,
        ].join("\n\n");
      } else {
        finalMessage = [
          parsed.cleanText || "I checked your booking request.",
          `Status: ${bookingResult.message}`,
          CONTACT_CTA,
        ].join("\n\n");
      }
    }

    const fallbackUsed = shouldMarkFallback(finalMessage, retrieved.confidenceBand);

    try {
      await logChatQuery({
        sessionId: metadata.sessionId,
        path: metadata.path,
        userAgent: request.headers.get("user-agent") ?? undefined,
        question,
        answer: finalMessage,
        status: "ok",
        model,
        retrievedDocIds: retrieved.docIds,
        confidenceBand: retrieved.confidenceBand,
        fallbackUsed,
      });
    } catch (logError) {
      console.error("Failed to store chat query log:", logError);
    }

    return NextResponse.json({ message: finalMessage });
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


