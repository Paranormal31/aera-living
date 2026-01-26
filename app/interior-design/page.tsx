import Image from "next/image";

export default function InteriorDesignPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-32 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left content */}
        <div>
          <h1 className="font-['Cormorant'] text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
            Bespoke Interior Design
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground text-lg leading-relaxed">
            Our award-winning design team brings your vision to life with
            nature-inspired, minimalist aesthetics that create calm,
            sophisticated spaces.
          </p>
          {/* CTA placeholder */}
          <div className="mt-10 flex gap-4">
            <button className="px-6 py-3 rounded-full bg-foreground text-background font-medium">
              Start Your Project
            </button>

            <button className="px-6 py-3 rounded-full border border-border text-foreground font-medium">
              View Portfolio
            </button>
          </div>
        </div>

        {/* Right column placeholder (images next step) */}
        <div className="relative h-[420px] bg-muted rounded-2xl" />
      </div>
    </section>
  );
}
