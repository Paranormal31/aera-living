import Image from "next/image";
import Link from "next/link";

export default function CuratedLocations() {
  const locations = [
    {
      name: "The Retro Den",
      city: "Dehradun",
      slug: "retro-den",
      image: "/locations/retro-den.jpg",
      description: "A bold, retro-inspired stay with artistic interiors.",
      price: "₹10,000 / night",
    },
    {
      name: "Doon’s Den",
      city: "Dehradun",
      slug: "doons-den",
      image: "/locations/doons-den.jpg",
      description: "A warm, cozy retreat nestled in the heart of the valley.",
      price: "₹3,400 / night",
    },
  ];

  return (
    <section className="bg-background">
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-['Cormorant'] text-4xl font-semibold text-foreground">
            Our Curated Locations
          </h2>
          <p className="mt-4 text-muted-foreground">
            Each property is handpicked and meticulously designed to offer an
            unparalleled stay experience.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          {locations.map((location) => (
            <Link
              key={location.slug}
              href={`/locations/${location.slug}`}
              aria-label={`View details for ${location.name}`}
              className="group block overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="relative h-[420px]">
                <Image
                  src={location.image}
                  alt={location.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Text */}
                <div className="absolute bottom-0 p-6 text-white select-none">
                  <div className="text-xs uppercase tracking-widest opacity-80">
                    {location.city}
                  </div>
                  <h3 className="mt-1 font-['Cormorant'] text-2xl font-semibold">
                    {location.name}
                  </h3>
                  <p className="mt-2 text-sm text-white/85">
                    {location.description}
                  </p>
                  <div className="mt-4 font-medium">{location.price}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
