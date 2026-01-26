import { Palette, Sparkles, Award } from "lucide-react";

export default function OurServices() {
  return (
    <section className="bg-[#faf9f7] py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-center text-4xl md:text-5xl font-serif text-neutral-900">
          Our Services
        </h2>

        {/* Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
              <Palette className="w-6 h-6 text-neutral-600" />
            </div>

            <h3 className="mt-6 text-xl font-serif text-neutral-900">
              Full Interior Design
            </h3>

            <p className="mt-4 text-neutral-600 text-sm leading-relaxed">
              Complete space transformation from concept to installation,
              including furniture selection, color palettes, and spatial
              planning.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-neutral-600" />
            </div>

            <h3 className="mt-6 text-xl font-serif text-neutral-900">
              Styling & Staging
            </h3>

            <p className="mt-4 text-neutral-600 text-sm leading-relaxed">
              Professional staging for property listings or special events,
              maximizing visual appeal and market value.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
              <Award className="w-6 h-6 text-neutral-600" />
            </div>

            <h3 className="mt-6 text-xl font-serif text-neutral-900">
              Consultation Services
            </h3>

            <p className="mt-4 text-neutral-600 text-sm leading-relaxed">
              Expert design guidance for DIY projects, including mood boards,
              material selection, and layout recommendations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
