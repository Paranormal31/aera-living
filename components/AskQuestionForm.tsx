"use client";

import { useMemo, useState } from "react";

const WHATSAPP_NUMBER = "918544337974";

export default function AskQuestionForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [question, setQuestion] = useState("");

  const whatsappHref = useMemo(() => {
    const lines = [
      "Hi AeraLiving,",
      "",
      `Name: ${name || "Not provided"}`,
      `Contact: ${contact || "Not provided"}`,
      "",
      "My question:",
      question || "Not provided",
    ];

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      lines.join("\n")
    )}`;
  }, [contact, name, question]);

  const isDisabled = question.trim().length === 0;

  return (
    <div className="rounded-[2rem] border border-[#2b2b28]/10 bg-white p-8 shadow-[0_30px_80px_rgba(43,43,40,0.08)] md:p-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7a8773]">
          Ask A Question
        </p>
        <h2 className="mt-3 font-serif text-4xl text-[#2b2b28]">
          Didn&apos;t find your answer?
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-[#5f5e58] md:text-base">
          Send us your question and our team will help you with bookings,
          partnerships, property details, or anything else you need.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#2b2b28]">
            Your name
          </span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-2xl border border-[#2b2b28]/10 bg-[#f5f4f1] px-4 py-3 outline-none transition focus:border-[#7a8773] focus:ring-2 focus:ring-[#7a8773]/20"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#2b2b28]">
            Phone or email
          </span>
          <input
            type="text"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder="How should we reach you?"
            className="w-full rounded-2xl border border-[#2b2b28]/10 bg-[#f5f4f1] px-4 py-3 outline-none transition focus:border-[#7a8773] focus:ring-2 focus:ring-[#7a8773]/20"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-medium text-[#2b2b28]">
          Your question
        </span>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about bookings, amenities, partnerships, refunds, or anything else."
          rows={6}
          className="w-full rounded-3xl border border-[#2b2b28]/10 bg-[#f5f4f1] px-4 py-4 outline-none transition focus:border-[#7a8773] focus:ring-2 focus:ring-[#7a8773]/20"
        />
      </label>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={isDisabled ? undefined : whatsappHref}
          target="_blank"
          rel="noreferrer"
          aria-disabled={isDisabled}
          className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition ${
            isDisabled
              ? "pointer-events-none bg-[#d9d5cc] text-[#7e7a73]"
              : "bg-[#2b2b28] text-white hover:scale-[1.01]"
          }`}
        >
          Send on WhatsApp
        </a>
        <a
          href="mailto:aeraliving.llp@gmail.com?subject=AeraLiving%20Question"
          className="inline-flex items-center justify-center rounded-full border border-[#2b2b28]/10 px-6 py-3 text-sm font-medium text-[#2b2b28] transition hover:bg-[#f5f4f1]"
        >
          Ask by Email
        </a>
      </div>
    </div>
  );
}
