import Image from "next/image";
import BookingWidget from "@/components/BookingWidget";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

// Property data - in a real app, this would come from a database
const propertyData: Record<string, any> = {
  "retro-den": {
    name: "The Retro Den",
    city: "Dehradun, India",
    bedrooms: 4,
    guests: 12,
    bathrooms: 4,
    price: 10000,
    rating: 4.9,
    reviews: 128,
    description:
      "Experience the ultimate in retro-inspired luxury at The Retro Den. This architectural masterpiece features bold, artistic interiors that blend mid-century modern design with contemporary comfort. The space showcases premium materials, thoughtful details, and a seamless connection between indoor and outdoor living. Each room is carefully curated to create an unforgettable stay experience.",
    amenities: [
      { icon: "📶", name: "High-Speed WiFi" },
      { icon: "🏔️", name: "Hill View" },
      { icon: "🚗", name: "Free Parking" },
      { icon: "🍳", name: "Fully Equipped Kitchen" },
      { icon: "❄️", name: "Air Conditioning" },
      { icon: "📺", name: "Smart TV" },
    ],
    images: [
      "/locations/retro-den/1.jpg", // Main large image (left side of collage)
      "/locations/retro-den/2.jpg", // Top right image
      "/locations/retro-den/3.jpg", // Bottom right image
    ],
    bookedDates: [
      "2026-02-05",
      "2026-02-06",
      "2026-02-07",
      "2026-02-15",
      "2026-02-16",
      "2026-02-20",
      "2026-02-21",
      "2026-02-22",
      "2026-02-23",
    ],
  },
  "doons-den": {
    name: "Doon's Den",
    city: "Dehradun, India",
    bedrooms: 2,
    guests: 6,
    bathrooms: 2,
    price: 3400,
    rating: 5.0,
    reviews: 96,
    description:
      "A warm, cozy retreat nestled in the heart of the valley. Doon's Den offers a perfect blend of modern amenities and traditional charm, creating a serene escape for families and groups.",
    amenities: [
      { icon: "📶", name: "High-Speed WiFi" },
      { icon: "🏔️", name: "Mountain View" },
      { icon: "🚗", name: "Free Parking" },
      { icon: "🍳", name: "Fully Equipped Kitchen" },
    ],
    images: [
      "/locations/doons-den/1.jpg", // Main large image (left side of collage)
      "/locations/doons-den/2.jpg", // Top right image
      "/locations/doons-den/3.jpg", // Bottom right image
    ],
    bookedDates: [
      "2026-02-10",
      "2026-02-11",
      "2026-02-12",
      "2026-02-18",
      "2026-02-19",
      "2026-02-25",
      "2026-02-26",
      "2026-02-27",
      "2026-02-28",
    ],
  },
};

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const property = propertyData[slug] || propertyData["retro-den"];

  return (
    <main className="bg-[#fafaf8] min-h-screen">
      {/* Image Collage */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        <div className="grid grid-cols-3 gap-4 h-[500px]">
          {/* Main large image */}
          <div className="col-span-2 relative rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={property.images[0]}
              alt={property.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Two smaller images */}
          <div className="col-span-1 grid grid-rows-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={property.images[1]}
                alt={`${property.name} interior`}
                fill
                className="object-cover"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={property.images[2]}
                alt={`${property.name} view`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Property Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <div>
              <h1 className="text-5xl font-['Cormorant'] font-semibold text-foreground mb-4">
                {property.name}
              </h1>
              <div className="flex items-center gap-6 text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="text-lg">🛏️</span>
                  <span>{property.bedrooms} Bedrooms</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-lg">👥</span>
                  <span>Up to {property.guests} Guests</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-lg">🚿</span>
                  <span>{property.bathrooms} Bathrooms</span>
                </span>
              </div>
            </div>

            {/* About This Space */}
            <div>
              <h2 className="text-2xl font-['Cormorant'] font-semibold text-foreground mb-4">
                About This Space
              </h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-['Cormorant'] font-semibold text-foreground mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.amenities.map((amenity: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <span className="text-xl">{amenity.icon}</span>
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <BookingWidget
              price={property.price}
              reviews={property.reviews}
              maxGuests={property.guests}
              bookedDates={property.bookedDates || []}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
