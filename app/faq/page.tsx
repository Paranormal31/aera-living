import type { Metadata } from "next";
import AskQuestionForm from "@/components/AskQuestionForm";

type FAQ = {
  question: string;
  answer: string[];
};

const faqs: FAQ[] = [
  {
    question: "What is AeraLiving?",
    answer: [
      "AeraLiving is a hospitality and property management company that develops and manages premium Airbnb-style stays.",
      "We partner with property owners to transform their homes into professionally designed vacation rentals and manage the entire operation while sharing profits with the owner.",
    ],
  },
  {
    question: "Where are AeraLiving properties located?",
    answer: [
      "Our properties are primarily located in Dehradun and surrounding scenic areas in Uttarakhand, offering peaceful stays close to nature while remaining easily accessible from the city.",
    ],
  },
  {
    question: "Who can partner with AeraLiving?",
    answer: [
      "Any property owner with a suitable home, villa, or apartment can partner with AeraLiving.",
      "We work especially well with families who own homes in scenic locations, busy professionals with unused properties, and investors looking to convert properties into vacation rentals.",
      "We handle the design, listing, and management while sharing the profits with the owner.",
    ],
  },
  {
    question: "How can guests book an AeraLiving property?",
    answer: [
      "Guests can book through our official website, WhatsApp bookings, direct phone calls, and platforms like Airbnb, Goibibo, MakeMyTrip, and other relevant booking platforms.",
    ],
  },
  {
    question: "What types of properties does AeraLiving offer?",
    answer: [
      "We offer 2BHK stays, 4BHK stays, private villas, and flexible configurations where a 4BHK can be divided into 1BHK, 2BHK, or 3BHK stays depending on guest requirements.",
    ],
  },
  {
    question: "What amenities are included in your properties?",
    answer: [
      "All AeraLiving properties are fully furnished and equipped with essential amenities such as high-speed WiFi, kitchen facilities, a dedicated caretaker, parking space, and comfortable living areas.",
      "Each property also features a unique interior theme such as retro, boho, or cozy aesthetic designs.",
    ],
  },
  {
    question: "What are the check-in and check-out timings?",
    answer: [
      "Check-in is at 11:00 AM and check-out is at 11:00 AM.",
      "Early check-in or late check-out may be available depending on availability.",
    ],
  },
  {
    question: "What is the payment policy?",
    answer: [
      "To confirm a booking, we require a 50% advance payment. The remaining amount is typically paid before or at the time of check-in.",
    ],
  },
  {
    question: "What is your cancellation and refund policy?",
    answer: [
      "More than 7 days before check-in: full refund.",
      "3 to 7 days before check-in: 50% refund.",
      "Less than 3 days before check-in: no refund.",
      "Refund timelines may vary depending on the booking platform used.",
    ],
  },
  {
    question: "What are the house rules?",
    answer: [
      "Smoking is permitted and pets are not allowed.",
      "Housekeeping services are available on request, and our support team is available 24/7 to assist guests during their stay.",
    ],
  },
];

export const metadata: Metadata = {
  title: "FAQ | AeraLiving",
  description: "Frequently asked questions about AeraLiving stays, bookings, amenities, and partnerships.",
};

export default function FAQPage() {
  return (
    <main className="bg-[#fafaf8] text-[#2b2b28]">
      <section className="relative overflow-hidden border-b border-[#2b2b28]/10 bg-[radial-gradient(circle_at_top,_rgba(212,197,176,0.38),_transparent_45%),linear-gradient(180deg,#f7f4ee_0%,#fafaf8_100%)]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7a8773]">
            Support
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight md:text-7xl">
            Frequently asked questions for guests and partners
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#5f5e58] md:text-lg">
            Everything people usually ask before booking a stay, partnering a
            property, or planning a visit with AeraLiving.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-5">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="group rounded-[1.75rem] border border-[#2b2b28]/10 bg-white px-6 py-5 shadow-[0_20px_60px_rgba(43,43,40,0.05)] transition open:border-[#9ba896]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2eee6] text-sm font-semibold text-[#2b2b28]">
                    {index + 1}
                  </span>
                  <h2 className="text-left font-serif text-2xl leading-tight md:text-3xl">
                    {faq.question}
                  </h2>
                </div>
                <span className="text-2xl text-[#7a8773] transition group-open:rotate-45">
                  +
                </span>
              </summary>

              <div className="ml-14 mt-5 space-y-3 pr-4 text-sm leading-7 text-[#5f5e58] md:text-base">
                {faq.answer.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <AskQuestionForm />
      </section>
    </main>
  );
}
