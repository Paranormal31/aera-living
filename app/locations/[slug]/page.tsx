import Image from "next/image";
import AmenitiesSection from "@/components/AmenitiesSection";
import BookingWidget from "@/components/BookingWidget";
import SeeAllPhotos from "@/components/SeeAllPhotos";

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
    bathrooms: 3,
    price: 10000,
    rating: 4.9,
    reviews: "New Launch",
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
    amenitiesDetailed: [
      {
        title: "Bathroom",
        items: [
          { name: "Bath" },
          { name: "Hair dryer" },
          { name: "Cleaning products" },
          { name: "Shampoo" },
          { name: "Conditioner" },
          { name: "Body soap" },
          { name: "Bidet" },
          { name: "Hot water" },
          { name: "Shower gel" },
        ],
      },
      {
        title: "Bedroom and laundry",
        items: [
          { name: "Essentials", note: "Towels, bed sheets, soap and toilet paper" },
          { name: "Hangers" },
          { name: "Bed linen" },
          { name: "Cotton linen" },
          { name: "Extra pillows and blankets" },
          { name: "Room-darkening blinds" },
          { name: "Iron" },
          { name: "Clothes drying rack" },
          { name: "Clothes storage: wardrobe" },
        ],
      },
      {
        title: "Entertainment",
        items: [
          {
            name: "55-inch HDTV with Amazon Prime Video, Disney+, Netflix, standard cable/satellite",
          },
          { name: "Record player" },
          { name: "Sound system with Bluetooth and aux" },
          { name: "Books and reading material" },
          { name: "Cinema" },
        ],
      },
      {
        title: "Family",
        items: [{ name: "Board games" }],
      },
      {
        title: "Heating and cooling",
        items: [{ name: "Ceiling fan" }, { name: "Portable heater" }],
      },
      {
        title: "Home safety",
        items: [
          {
            name: "Exterior security cameras on property",
            note:
              "Exterior security cameras are installed at the main entrance and building entry points. These cameras monitor only outdoor areas for safety and security. There are no cameras inside the home or in any private areas.",
          },
          { name: "Fire extinguisher" },
          { name: "First aid kit" },
        ],
      },
      {
        title: "Internet and office",
        items: [{ name: "Wifi" }, { name: "Dedicated workspace" }],
      },
      {
        title: "Kitchen and dining",
        items: [
          { name: "Kitchen", note: "Space where guests can cook their own meals" },
          { name: "Samsung refrigerator" },
          { name: "Microwave" },
          { name: "Cooking basics", note: "Pots and pans, oil, salt and pepper" },
          { name: "Dishes and cutlery", note: "Bowls, chopsticks, plates, cups, etc." },
          { name: "Freezer" },
          { name: "Gas cooker" },
          { name: "Kettle" },
          { name: "Wine glasses" },
          { name: "Toaster" },
          { name: "Rice cooker" },
          { name: "Waste compactor" },
          { name: "Dining table" },
          { name: "Coffee" },
        ],
      },
      {
        title: "Location features",
        items: [{ name: "Private entrance", note: "Separate street or building entrance" }],
      },
      {
        title: "Outdoor",
        items: [{ name: "Firepit" }],
      },
      {
        title: "Parking and facilities",
        items: [
          { name: "Free parking on premises" },
          {
            name: "Lift",
            note:
              "The home or building has a lift that is at least 52 inches (132cm) deep and a doorway at least 32 inches (81cm) wide",
          },
        ],
      },
      {
        title: "Services",
        items: [
          {
            name: "Luggage drop-off allowed",
            note: "For guests' convenience when they are arriving early or departing late",
          },
          { name: "Smoking allowed" },
          { name: "Long-term stays allowed", note: "Allow stays of 28 days or more" },
          { name: "Self check-in" },
          { name: "Building staff", note: "Someone is available 24 hours a day to let guests in" },
          { name: "Housekeeping available 24 hours, every day" },
        ],
      },
      {
        title: "Not included",
        items: [
          { name: "Washing machine", unavailable: true },
          { name: "Dryer", unavailable: true },
          { name: "Air conditioning", unavailable: true },
          {
            name: "Smoke alarm",
            note:
              "This place may not have a smoke detector. Contact the host with any questions.",
            unavailable: true,
          },
          {
            name: "Carbon monoxide alarm",
            note:
              "This place may not have a carbon monoxide detector. Contact the host with any questions.",
            unavailable: true,
          },
        ],
      },
    ],

    collageImages: [
      "/locations/retro-den/1.jpg",
      "/locations/retro-den/2.jpg",
      "/locations/retro-den/3.jpg",
    ],
    photoSections: [
      {
        id: "living-room",
        title: "Living room",
        images: [
          "/locations/retro-den/living-room/1.jpg",
          "/locations/retro-den/living-room/2.jpg",
          "/locations/retro-den/living-room/3.jpg",
        ],
      },
      {
        id: "kitchen",
        title: "Full kitchen",
        images: [
          "/locations/retro-den/kitchen/1.jpg",
          "/locations/retro-den/kitchen/2.jpg",
          "/locations/retro-den/kitchen/3.jpg",
        ],
      },
      {
        id: "dining-area",
        title: "Dining area",
        images: [
          "/locations/retro-den/dining-area/1.jpg",
          "/locations/retro-den/dining-area/2.jpg",
        ],
      },
      {
        id: "bedroom-1",
        title: "Bedroom 1",
        images: [
          "/locations/retro-den/bedroom-1/1.jpg",
          "/locations/retro-den/bedroom-1/2.jpg",
          "/locations/retro-den/bedroom-1/3.jpg",
          "/locations/retro-den/bedroom-1/4.jpg",
        ],
      },
      {
        id: "bedroom-2",
        title: "Bedroom 2",
        images: [
          "/locations/retro-den/bedroom-2/1.jpg",
          "/locations/retro-den/bedroom-2/2.jpg",
          "/locations/retro-den/bedroom-2/3.jpg",
        ],
      },
      {
        id: "bedroom-3",
        title: "Bedroom 3",
        images: [
          "/locations/retro-den/bedroom-3/1.jpg",
          "/locations/retro-den/bedroom-3/2.jpg",
          "/locations/retro-den/bedroom-3/3.jpg",
        ],
      },
      {
        id: "bedroom-4",
        title: "Bedroom 4",
        images: [
          "/locations/retro-den/bedroom-4/1.jpg",
          "/locations/retro-den/bedroom-4/2.jpg",
          "/locations/retro-den/bedroom-4/3.jpg",
        ],
      },
      {
        id: "bathroom-1",
        title: "Full bathroom 1",
        images: [
          "/locations/retro-den/bathroom-1/1.jpg",
          "/locations/retro-den/bathroom-1/2.jpg",
        ],
      },
      {
        id: "bathroom-2",
        title: "Full bathroom 2",
        images: [
          "/locations/retro-den/bathroom-2/1.jpg",
          "/locations/retro-den/bathroom-2/2.jpg",
        ],
      },
      {
        id: "bathroom-3",
        title: "Full bathroom 3",
        images: [
          "/locations/retro-den/bathroom-3/1.jpg",
          "/locations/retro-den/bathroom-3/2.jpg",
        ],
      },
      {
        id: "balcony",
        title: "Balcony",
        images: [
          "/locations/retro-den/balcony/1.jpg",
          "/locations/retro-den/balcony/2.jpg",
          "/locations/retro-den/balcony/3.jpg",
        ],
      },
      {
        id: "additional-photos",
        title: "Additional photos",
        images: [
          "/locations/retro-den/additional-photos/1.jpg",
          "/locations/retro-den/additional-photos/2.jpg",
        ],
      },
    ],
    bookedDates: [],
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
    amenitiesDetailed: [
      {
        title: "Scenic views",
        items: [{ name: "Mountain view" }],
      },
      {
        title: "Bathroom",
        items: [
          { name: "Shampoo" },
          { name: "Conditioner" },
          { name: "Body soap" },
          { name: "Hot water" },
          { name: "Shower gel" },
        ],
      },
      {
        title: "Bedroom and laundry",
        items: [
          { name: "Essentials", note: "Towels, bed sheets, soap and toilet paper" },
          { name: "Hangers" },
          { name: "Bed linen" },
          { name: "Cotton linen" },
          { name: "Extra pillows and blankets" },
          { name: "Room-darkening blinds" },
          { name: "Iron" },
          { name: "Clothes drying rack" },
          { name: "Clothes storage" },
        ],
      },
      {
        title: "Entertainment",
        items: [
          { name: "TV" },
          { name: "Bluetooth sound system" },
          { name: "Books and reading material" },
        ],
      },
      {
        title: "Family",
        items: [{ name: "Board games" }],
      },
      {
        title: "Heating and cooling",
        items: [
          { name: "Air conditioning" },
          { name: "Ceiling fan" },
          { name: "Portable heater" },
        ],
      },
      {
        title: "Home safety",
        items: [
          { name: "Exterior security cameras on property", note: "Entire building" },
          { name: "Fire extinguisher" },
          { name: "First aid kit" },
        ],
      },
      {
        title: "Internet and office",
        items: [{ name: "Wifi" }, { name: "Dedicated workspace" }],
      },
      {
        title: "Kitchen and dining",
        items: [
          { name: "Kitchen", note: "Space where guests can cook their own meals" },
          { name: "LG refrigerator" },
          { name: "Microwave" },
          { name: "Cooking basics", note: "Pots and pans, oil, salt and pepper" },
          { name: "Freezer" },
          { name: "Prestige electric cooker" },
          { name: "Kettle" },
          { name: "Wine glasses" },
          { name: "Dining table" },
        ],
      },
      {
        title: "Location features",
        items: [
          { name: "Private entrance", note: "Separate street or building entrance" },
          { name: "Launderette nearby" },
        ],
      },
      {
        title: "Outdoor",
        items: [
          { name: "Private patio or balcony" },
          { name: "Firepit" },
          { name: "Outdoor furniture" },
          { name: "Outdoor dining area" },
        ],
      },
      {
        title: "Parking and facilities",
        items: [
          { name: "Free parking on premises" },
          { name: "Free on-street parking" },
        ],
      },
      {
        title: "Services",
        items: [
          { name: "Smoking allowed" },
          { name: "Long-term stays allowed", note: "Allow stays of 28 days or more" },
          { name: "Self check-in" },
          { name: "Building staff", note: "Someone is available 24 hours a day to let guests in" },
          { name: "Housekeeping", note: "Available at extra cost" },
        ],
      },
      {
        title: "Not included",
        items: [
          { name: "Washing machine", unavailable: true },
          { name: "Dryer", unavailable: true },
          {
            name: "Smoke alarm",
            note:
              "This place may not have a smoke detector. Contact the host with any questions.",
            unavailable: true,
          },
          {
            name: "Carbon monoxide alarm",
            note:
              "This place may not have a carbon monoxide detector. Contact the host with any questions.",
            unavailable: true,
          },
        ],
      },
    ],

    collageImages: [
      "/locations/doons-den/1.jpg",
      "/locations/doons-den/2.jpg",
      "/locations/doons-den/3.jpg",
    ],
    photoSections: [
      {
        id: "living-room",
        title: "Living room",
        images: [
          "/locations/doons-den/living-room/1.jpg",
          "/locations/doons-den/living-room/2.jpg",
          "/locations/doons-den/living-room/3.jpg",
          "/locations/doons-den/living-room/4.jpg",
          "/locations/doons-den/living-room/5.jpg",
          "/locations/doons-den/living-room/6.jpg",
          "/locations/doons-den/living-room/7.jpg",
          "/locations/doons-den/living-room/8.jpg",
        ],
      },
      {
        id: "full-kitchen",
        title: "Full kitchen",
        images: [
          "/locations/doons-den/full-kitchen/1.jpg",
          "/locations/doons-den/full-kitchen/2.jpg",
          "/locations/doons-den/full-kitchen/3.jpg",
          "/locations/doons-den/full-kitchen/4.jpg",
          "/locations/doons-den/full-kitchen/5.jpg",
          "/locations/doons-den/full-kitchen/6.jpg",
        ],
      },
      {
        id: "dining-area",
        title: "Dining area",
        images: [
          "/locations/doons-den/dinning-area/1.jpg",
          "/locations/doons-den/dinning-area/2.jpg",
        ],
      },
      {
        id: "bedroom-1",
        title: "Bedroom 1",
        images: [
          "/locations/doons-den/bedroom-1/1.jpg",
          "/locations/doons-den/bedroom-1/2.jpg",
          "/locations/doons-den/bedroom-1/3.jpg",
          "/locations/doons-den/bedroom-1/4.jpg",
          "/locations/doons-den/bedroom-1/5.jpg",
          "/locations/doons-den/bedroom-1/6.jpg",
        ],
      },
      {
        id: "bedroom-2",
        title: "Bedroom 2",
        images: [
          "/locations/doons-den/bedroom-2/1.jpg",
          "/locations/doons-den/bedroom-2/2.jpg",
          "/locations/doons-den/bedroom-2/3.jpg",
          "/locations/doons-den/bedroom-2/4.jpg",
          "/locations/doons-den/bedroom-2/5.jpg",
          "/locations/doons-den/bedroom-2/6.jpg",
        ],
      },
      {
        id: "bathroom-1",
        title: "Full bathroom 1",
        images: ["/locations/doons-den/bathroom-1/1.jpg"],
      },
      {
        id: "bathroom-2",
        title: "Full bathroom 2",
        images: ["/locations/doons-den/bathroom-2/1.jpg"],
      },
      {
        id: "balcony",
        title: "Balcony",
        images: ["/locations/doons-den/balcony/1.jpg"],
      },
      {
        id: "additional-photos",
        title: "Additional photos",
        images: [
          "/locations/doons-den/additional-photos/1.jpg",
          "/locations/doons-den/additional-photos/2.jpg",
          "/locations/doons-den/additional-photos/3.jpg",
        ],
      },
    ],
    bookedDates: [],
  },
};

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const property = propertyData[slug] || propertyData["retro-den"];
  const sectionImages: string[] = (property.photoSections || []).flatMap(
    (section: { images: string[] }) => section.images
  );
  const allPhotos = [...(property.collageImages || []), ...sectionImages];
  return (
    <main className="bg-[#fafaf8] min-h-screen">
      {/* Image Collage */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        <div className="grid grid-cols-3 gap-4 h-[500px]">
          {/* Main large image */}
          <div className="col-span-2 relative rounded-2xl overflow-hidden shadow-lg cursor-pointer">
            <Image
              src={property.collageImages[0]}
              alt={property.name}
              fill
              className="object-cover"
              priority
            />
            <SeeAllPhotos
              propertyName={property.name}
              images={allPhotos}
              sections={property.photoSections || []}
              buttonClassName="absolute inset-0"
              showLabel={false}
            />
          </div>
          {/* Two smaller images */}
          <div className="col-span-1 grid grid-rows-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer">
              <Image
                src={property.collageImages[1]}
                alt={`${property.name} interior`}
                fill
                className="object-cover"
              />
              <SeeAllPhotos
                propertyName={property.name}
                images={allPhotos}
                sections={property.photoSections || []}
                buttonClassName="absolute inset-0"
                showLabel={false}
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer">
              <Image
                src={property.collageImages[2]}
                alt={`${property.name} view`}
                fill
                className="object-cover"
              />
              <SeeAllPhotos
                propertyName={property.name}
                images={allPhotos}
                sections={property.photoSections || []}
                buttonClassName="absolute inset-0"
                showLabel={false}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <SeeAllPhotos
            propertyName={property.name}
            images={allPhotos}
            sections={property.photoSections || []}
          />
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
            <AmenitiesSection
              sections={property.amenitiesDetailed}
              simpleAmenities={property.amenities}
            />
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
