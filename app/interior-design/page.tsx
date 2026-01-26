import Image from "next/image";
import DesignPhilosophy from "@/components/DesignPhilosophy";

export default function InteriorDesignPage() {
return (
  <>
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

        {/* Right column images */}
        <div className="relative h-[460px]">
          {/* Image 1 */}
          <div className="absolute left-0 top-0 w-[55%] h-[300px] rounded-2xl overflow-hidden shadow-sm">
            <Image
              src="/interior-design/interior-1.jpg"
              alt="Interior design detail"
              fill
              className="object-cover"
            />
          </div>

          {/* Image 2 */}
          <div className="absolute right-0 bottom-0 w-[55%] h-[320px] rounded-2xl overflow-hidden shadow-sm">
            <Image
              src="/interior-design/interior-2.jpg"
              alt="Interior design space"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
    
    <DesignPhilosophy />
  </>
);
}
