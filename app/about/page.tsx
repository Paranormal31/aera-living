import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BedDouble, Handshake, Palette, ShieldCheck } from "lucide-react";

const principles = [
  {
    title: "Designed Stays",
    description:
      "Every home is shaped with a clear visual identity, comfortable layouts, and the essentials guests expect for relaxed short stays.",
    icon: Palette,
  },
  {
    title: "Guest-Ready Operations",
    description:
      "From listing presentation to guest support, our process is built around dependable hospitality and smooth communication.",
    icon: BedDouble,
  },
  {
    title: "Owner Partnerships",
    description:
      "We work with property owners to transform underused homes into professionally managed stays with shared upside.",
    icon: Handshake,
  },
  {
    title: "Trusted Care",
    description:
      "Our team coordinates caretaking, housekeeping, safety basics, and booking follow-ups so each property is looked after.",
    icon: ShieldCheck,
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#fafaf8] text-foreground">
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-28 lg:pt-24">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            About AeraLiving
          </p>
          <h1 className="mt-5 max-w-3xl font-['Cormorant'] text-5xl font-semibold leading-tight md:text-6xl">
            Curated homes for guests, thoughtful returns for owners.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            AeraLiving develops and manages premium Airbnb-style stays in Dehradun
            and nearby scenic neighborhoods. We combine interior design,
            hospitality operations, and booking support to turn distinctive homes
            into memorable guest experiences.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/locations"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:bg-foreground/90"
            >
              Explore Stays <ArrowRight size={16} />
            </Link>
            <Link
              href="/interior-design#start-project"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:border-foreground/30 hover:bg-white"
            >
              Partner With Us
            </Link>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-2xl bg-neutral-200 shadow-sm">
          <Image
            src="/hero/retro-den-v2.jpg"
            alt="AeraLiving designed interior"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
            <p className="max-w-md text-sm leading-6 text-white/85">
              Spaces are selected, styled, photographed, and managed for guests
              who want more than a standard stay.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-border px-6 md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            ["3", "Premium properties"],
            ["50+", "Guest stays hosted"],
            ["Dehradun", "Primary location"],
          ].map(([value, label]) => (
            <div key={label} className="py-10 text-center">
              <p className="font-['Cormorant'] text-4xl font-semibold">{value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            How We Work
          </p>
          <h2 className="mt-4 font-['Cormorant'] text-4xl font-semibold md:text-5xl">
            A hospitality layer for homes with character.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {principles.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded-xl border border-border bg-white p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-muted text-foreground">
                <Icon size={20} />
              </div>
              <h3 className="font-['Cormorant'] text-2xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
