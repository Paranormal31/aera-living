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
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
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
          <div
            aria-label="New location coming soon"
            className="group block overflow-hidden rounded-2xl border border-foreground/10 bg-gradient-to-br from-foreground/5 via-foreground/0 to-foreground/10"
          >
            <div className="relative h-[420px]">
              <div className="absolute inset-0">
                <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-foreground/10 blur-3xl" />
                <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-foreground/10 blur-3xl" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                <div className="text-xs uppercase tracking-[0.35em] text-foreground/70">
                  Coming Soon
                </div>
                <h3 className="mt-3 font-['Cormorant'] text-3xl font-semibold text-foreground">
                  New Destination
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  A fresh escape is being prepared with the same signature
                  detail and warmth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
