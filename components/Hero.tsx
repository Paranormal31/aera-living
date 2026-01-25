import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      {/* Background image */}
      <Image
        src="/hero/retro-den-v2.jpg"
        alt="Aera Living luxury interior"
        fill
        priority
        className="object-cover"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <div className="max-w-3xl">
          <h1 className="font-['Cormorant'] text-6xl md:text-7xl font-semibold text-white tracking-[-0.02em] leading-tight">
            Elevated Living,
            <br />
            Curated Experiences
          </h1>

          <p className="mt-8 text-base md:text-lg text-white/90 leading-relaxed">
            Discover thoughtfully designed properties in the world&apos;s most
            breathtaking locations. Where luxury meets tranquility.
          </p>

          <div className="mt-12 flex items-center justify-center gap-5">
            <button className="px-6 py-3 rounded-full bg-white text-foreground font-medium tracking-wide">
              Explore Stays
            </button>

            <button className="px-6 py-3 rounded-full border border-white/60 text-white font-medium tracking-wide">
              Partner With Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
