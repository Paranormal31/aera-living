import Image from "next/image";
import Link from "next/link";
import { LOCATION_LISTINGS } from "@/lib/siteContent";

export default function LocationsPage() {
  return (
    <main className="bg-[#fafaf8]">
      {/* Header */}
      <section className="text-center pt-12 pb-10 sm:pt-16 sm:pb-16 px-4 sm:px-6">
        <h2 className="text-3xl sm:text-5xl font-serif mb-3 sm:mb-4 text-foreground">A Little About Us</h2>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600 leading-relaxed mb-10 sm:mb-14">
          We are a premium Airbnb hosting and property management company. Explore our curated selection of top property picks designed for comfort and memorable stays.
        </p>

        <h1 className="text-3xl sm:text-5xl font-serif mb-3 sm:mb-4 text-foreground">Our Locations</h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600 leading-relaxed">
          Handpicked properties in the world&apos;s most desirable destinations.
          Each space is thoughtfully designed to provide an unforgettable
          experience.
        </p>
      </section>

      {/* Listings */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-12 pb-16 sm:pb-24">
        {LOCATION_LISTINGS.map((loc) => (
          <Link
            key={loc.slug}
            href={`/locations/${loc.slug}`}
            className="block bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 border border-gray-100"
            aria-label={`View details for ${loc.name}`}
          >
            {/* Image */}
            <div className="relative w-full md:w-1/2 h-56 sm:h-72 md:h-auto min-h-[220px] sm:min-h-[280px]">
              <Image
                src={loc.image}
                alt={loc.name}
                fill
                className="object-cover"
                priority
              />

              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow-sm text-gray-800">
                ⭐ {loc.rating}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-8 flex flex-col justify-between w-full md:w-1/2">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1 flex items-center gap-1">📍 {loc.city}</p>

                <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-3">{loc.name}</h2>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                  {loc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] sm:text-xs bg-gray-100 px-2.5 sm:px-3 py-1 rounded-full text-gray-600 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-600 mb-3 font-medium">
                  <span className="whitespace-nowrap flex items-center gap-1">
                    <span>🛏</span>
                    <span>{loc.bedrooms} {loc.bedrooms === 1 ? "Bedroom" : "Bedrooms"}</span>
                  </span>
                  <span className="whitespace-nowrap flex items-center gap-1">
                    <span>👥</span>
                    <span>Up to {loc.guests} Guests</span>
                  </span>
                  <span className="whitespace-nowrap flex items-center gap-1">
                    <span>🚿</span>
                    <span>{loc.bathrooms} {loc.bathrooms === 1 ? "Bathroom" : "Bathrooms"}</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-500">
                  {typeof loc.reviews === "string"
                    ? loc.reviews
                    : `${loc.reviews} reviews`}
                </p>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <p className="text-lg sm:text-xl font-semibold text-gray-900">{loc.price}</p>

                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground group-hover:translate-x-1 transition-transform">
                  View Details →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
