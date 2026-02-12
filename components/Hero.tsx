import Image from "next/image";
import Link from "next/link";

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
          <h1 className="font-['Cormorant'] text-4xl sm:text-5xl md:text-7xl font-semibold text-white tracking-[-0.02em] leading-tight">
            Elevated Living,
            <br />
            Curated Experiences
          </h1>

          <p className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-white/90 leading-relaxed">
            Discover thoughtfully designed properties in the world&apos;s most
            breathtaking locations. Where luxury meets tranquility.
          </p>

          <div className="mt-8 sm:mt-12 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
            <Link
              href="/locations"
              className="w-full rounded-full bg-white px-6 py-3 text-sm font-medium tracking-wide text-foreground sm:w-auto sm:text-base"
            >
              Explore Stays
            </Link>

            <Link
              href="/interior-design"
              className="w-full rounded-full border border-white/60 px-6 py-3 text-sm font-medium tracking-wide text-white sm:w-auto sm:text-base"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
