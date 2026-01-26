import { Check } from "lucide-react";

export default function DesignPhilosophy() {
  const items = [
    {
      title: "Nature-Inspired",
      description:
        "Organic materials, neutral palettes, and biophilic design principles create calming, restorative spaces.",
    },
    {
      title: "Timeless Elegance",
      description:
        "We prioritize quality over trends, ensuring your space remains beautiful for years to come.",
    },
    {
      title: "Functional Beauty",
      description:
        "Every design decision serves both aesthetic and practical purposes, maximizing your space.",
    },
  ];

  return (
    <section className="bg-background">
      <div className="max-w-7xl mx-auto px-6 py-28">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-['Cormorant'] text-4xl font-semibold text-foreground">
            Our Design Philosophy
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            We believe great design is timeless, sustainable, and deeply
            personal. Every project begins with understanding your lifestyle,
            aesthetic preferences, and functional needs.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-6">
                <Check className="w-5 h-5 text-foreground/70" />
              </div>

              <h3 className="font-['Cormorant'] text-xl font-semibold text-foreground">
                {item.title}
              </h3>

              <p className="mt-4 text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
