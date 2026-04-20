import type { Metadata } from "next";
import { FAQS } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "FAQ | AeraLiving",
  description: "Frequently asked questions about AeraLiving stays, bookings, amenities, and partnerships.",
};

export default function FAQPage() {
  return (
    <main className="bg-[#f8f7f4] px-6 py-16 text-[#1f1f1c]">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-4xl md:text-5xl">Frequently Asked Questions</h1>
        <p className="mt-3 text-sm text-neutral-600">
          Common questions from guests and property partners.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-7 md:text-base">
          {FAQS.map((faq, index) => (
            <section key={faq.question}>
              <h2 className="font-serif text-2xl">
                {index + 1}. {faq.question}
              </h2>
              <div className="mt-3 space-y-3 text-neutral-700">
                {faq.answer.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-xl border border-neutral-200 bg-white/70 px-4 py-4 text-xs text-neutral-600 md:text-sm">
          <details className="group">
            <summary className="cursor-pointer list-none rounded-md px-1 py-1 font-medium text-neutral-800 transition hover:text-neutral-950">
              Chatbot Usage Guidelines
            </summary>
            <div className="mt-3 space-y-2 text-neutral-700">
              <p>Anti-spam and safety rules enforced by our system:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Honeypot protection: requests with hidden-field values are blocked.</li>
                <li>Fast-submit detection: submissions that arrive unrealistically fast are blocked.</li>
                <li>Rate limiting: max 5 booking-intent attempts per 15 minutes per risk fingerprint.</li>
                <li>Duplicate suppression: repeated same contact + property + dates within 24 hours are rejected.</li>
                <li>Strict server validation for dates, guest count limits, and contact format.</li>
                <li>Misuse signals are logged for abuse prevention and service quality monitoring.</li>
              </ul>
            </div>
          </details>
        </section>
      </div>
    </main>
  );
}
