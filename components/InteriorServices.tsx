import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";

export default function InteriorServices() {
  return (
    <section className="bg-[#faf9f7] py-32">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left Content */}
        <div>
          <h2 className="font-serif text-4xl lg:text-5xl text-neutral-900 leading-tight">
            Bespoke Interior Design Services
          </h2>

          <p className="mt-6 text-neutral-600 max-w-xl leading-relaxed">
            Our award-winning design team creates stunning, nature-inspired
            interiors that blend luxury with tranquility. From concept to
            completion, we craft spaces that tell your story.
          </p>

          <ul className="mt-10 space-y-6">
            {[
              {
                title: "Full-Service Design",
                desc: "Complete transformation from planning to installation",
              },
              {
                title: "Premium Materials",
                desc: "Sustainable, high-quality materials sourced globally",
              },
              {
                title: "Signature Aesthetic",
                desc: "Calm, minimal, nature-inspired designs tailored to you",
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#9aaa94] flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{item.title}</p>
                  <p className="text-sm text-neutral-600">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <button className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#9aaa94] px-7 py-3 text-white font-medium hover:bg-[#88977f] transition">
            Explore Our Work
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Right Images */}
        <div className="relative h-[420px]">
          <div className="absolute left-0 top-0 w-[60%] h-[300px] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/interior-design/interior-1.jpg"
              alt="Interior design room"
              fill
              className="object-cover"
            />
          </div>

          <div className="absolute right-0 bottom-0 w-[55%] h-[280px] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/interior-design/interior-2.jpg"
              alt="Interior design decor"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
