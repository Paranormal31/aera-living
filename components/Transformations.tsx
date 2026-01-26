import TransformationCard from "@/components/TransformationCard";

export default function Transformations() {
  return (
    <section className="bg-[#faf9f7] py-32">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-neutral-900">
          Transformations
        </h2>

        <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
          See how we&apos;ve transformed spaces into stunning, functional
          environments
        </p>
      </div>

      <div className="mt-24 space-y-24">
        <TransformationCard
          beforeImage="/transformations/before-1.jpg"
          afterImage="/transformations/after-1.jpg"
          title="Coastal Bedroom Transformation"
          description="From dated to serene minimalism"
        />

        <TransformationCard
          beforeImage="/transformations/before-2.jpg"
          afterImage="/transformations/after-2.jpg"
          title="Urban Living Room Redesign"
          description="A warm, modern space designed for everyday living"
        />

        <TransformationCard
          beforeImage="/transformations/before-3.jpg"
          afterImage="/transformations/after-3.jpg"
          title="Minimalist Kitchen Upgrade"
          description="Clean lines, improved functionality, timeless appeal"
        />
      </div>
    </section>
  );
}
