import TransformationCard from "@/components/TransformationCard";

export default function Transformations() {
  return (
    <section id="transformations" className="bg-[#faf9f7] py-32">
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
          beforeImage="/transformations/before-1.jpeg"
          afterImage="/transformations/after-1.jpeg"
          title="Kitchen Transformation"
          description="From cluttered to clean, efficient flow"
        />

        <TransformationCard
          beforeImage="/transformations/before-2.jpeg"
          afterImage="/transformations/after-2.jpeg"
          title="Living Room Redesign"
          description="A warm, modern space for everyday living"
        />

        <TransformationCard
          beforeImage="/transformations/before-3.jpeg"
          afterImage="/transformations/after-3.jpeg"
          title="Bedroom Refresh"
          description="A calm retreat with soft textures"
        />
      </div>
    </section>
  );
}
