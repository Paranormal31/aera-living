import Image from "next/image";
import Link from "next/link";

const locations = [
  {
    name: "Retro Den",
    slug: "retro-den",
    city: "Dehradun, India",
    price: 10000,
    rating: 5,
    reviews: "New Launch",
    bedrooms: 4,
    guests: 12,
    bathrooms: 3,
    image: "/images/retro-den.jpg",
    tags: ["Hill View", "Cozy", "Central"],
  },
  {
    name: "Doon’s Den",
    slug: "doons-den",
    city: "Dehradun, India",
    price: 3400,
    rating: 4.77,
    reviews: 13,
    bedrooms: 2,
    guests: 6,
    bathrooms: 2,
    image: "/images/doons-den.jpg",
    tags: ["Spacious", "Modern", "Family Friendly"],
  },
];

export default function LocationsPage() {
  return (
    <main className="bg-[#fafaf8]">
      {/* Header */}
      <section className="text-center py-20 px-6">
        <h1 className="text-5xl font-serif mb-4">Our Locations</h1>
        <p className="max-w-2xl mx-auto text-gray-600">
          Handpicked properties in the world&apos;s most desirable destinations.
          Each space is thoughtfully designed to provide an unforgettable
          experience.
        </p>
      </section>

      {/* Listings */}
      <section className="max-w-6xl mx-auto px-6 space-y-12 pb-24">
        {locations.map((loc) => (
          <Link
            key={loc.slug}
            href={`/locations/${loc.slug}`}
            className="block bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            aria-label={`View details for ${loc.name}`}
          >
            {/* Image */}
            <div className="relative w-full md:w-1/2 h-72 md:h-auto">
              <Image
                src={loc.image}
                alt={loc.name}
                fill
                className="object-cover"
                priority
              />

              <div className="absolute top-4 right-4 bg-white text-sm px-3 py-1 rounded-full shadow">
                ⭐ {loc.rating}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col justify-between w-full md:w-1/2">
              <div>
                <p className="text-sm text-gray-500 mb-1">📍 {loc.city}</p>

                <h2 className="text-2xl font-serif mb-4">{loc.name}</h2>

                <div className="flex flex-wrap gap-2 mb-4">
                  {loc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-6 text-sm text-gray-600 mb-3">
                  <span>🛏 {loc.bedrooms} Bedrooms</span>
                  <span>👥 Up to {loc.guests} Guests</span>
                  <span>🚿 {loc.bathrooms} Bathrooms</span>
                </div>

                <p className="text-sm text-gray-500">
                  {typeof loc.reviews === "string"
                    ? loc.reviews
                    : `${loc.reviews} reviews`}
                </p>
              </div>

              <div className="flex items-center justify-between mt-6">
                <p className="text-xl font-semibold">
                  ₹{loc.price}
                  <span className="text-sm text-gray-500"> / night</span>
                </p>

                <span className="flex items-center gap-2 text-sm font-medium">
                  View Details →
                </span>
              </div>
            </div>
          </Link>
        ))}
        <div
          aria-label="New location coming soon"
          className="block bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row border border-gray-100"
        >
          <div className="relative w-full md:w-1/2 h-72 md:h-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-gray-50" />
            <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-gray-200/60 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-gray-200/60 blur-3xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs uppercase tracking-[0.35em] text-gray-500">
                Coming Soon
              </span>
            </div>
          </div>
          <div className="p-8 flex flex-col justify-between w-full md:w-1/2">
            <div>
              <p className="text-sm text-gray-500 mb-1">New Destination</p>
              <h2 className="text-2xl font-serif mb-4">
                Next Location Reveal
              </h2>
              <p className="text-sm text-gray-500">
                We&apos;re crafting a fresh retreat with the same signature
                comfort and detail. Stay tuned.
              </p>
            </div>
            <div className="flex items-center justify-between mt-6">
              <p className="text-xl font-semibold text-gray-700">Coming Soon</p>
              <span className="flex items-center gap-2 text-sm font-medium text-gray-500">
                Details Soon
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
