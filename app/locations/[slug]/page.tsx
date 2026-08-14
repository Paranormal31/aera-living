import Image from "next/image";
import AmenitiesSection from "@/components/AmenitiesSection";
import BookingWidget from "@/components/BookingWidget";
import SeeAllPhotos from "@/components/SeeAllPhotos";
import { PROPERTY_DATA } from "@/lib/siteContent";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

import { getDb } from "@/lib/firebaseAdmin";

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const normalizedSlug = slug === "room-404" ? "room-4o4" : slug;
  const property = PROPERTY_DATA[normalizedSlug] || PROPERTY_DATA["room-4o4"] || PROPERTY_DATA["retro-den"];
  
  let dynamicBookedDates: string[] = [];
  try {
    const db = getDb();
    const blockedSnap = await db.collection("blockedDates").where("propertySlug", "==", normalizedSlug).get();
    dynamicBookedDates = blockedSnap.docs.map(doc => doc.data().date);
  } catch (error) {
    console.error("Failed to fetch dynamic blocked dates", error);
  }

  const allBookedDates = Array.from(new Set([...(property.bookedDates || []), ...dynamicBookedDates]));

  const sectionImages: string[] = (property.photoSections || []).flatMap(
    (section: { images: string[] }) => section.images,
  );
  const allPhotos = [...(property.collageImages || []), ...sectionImages];

  return (
    <main className="bg-[#fafaf8] min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 pb-6 sm:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 h-auto md:h-[500px]">
          <div className="col-span-1 md:col-span-2 relative h-[250px] sm:h-[350px] md:h-full rounded-2xl overflow-hidden shadow-md cursor-pointer">
            <Image src={property.collageImages[0]} alt={property.name} fill className="object-cover" priority />
            <SeeAllPhotos
              propertyName={property.name}
              images={allPhotos}
              sections={property.photoSections || []}
              buttonClassName="absolute inset-0"
              showLabel={false}
            />
          </div>
          <div className="col-span-1 grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-3 md:gap-4 h-[120px] sm:h-[180px] md:h-full">
            <div className="relative rounded-2xl overflow-hidden shadow-md cursor-pointer">
              <Image src={property.collageImages[1] || property.collageImages[0]} alt={`${property.name} interior`} fill className="object-cover" />
              <SeeAllPhotos
                propertyName={property.name}
                images={allPhotos}
                sections={property.photoSections || []}
                buttonClassName="absolute inset-0"
                showLabel={false}
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-md cursor-pointer">
              <Image src={property.collageImages[2] || property.collageImages[0]} alt={`${property.name} view`} fill className="object-cover" />
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
        <div className="mt-4 sm:mt-6 flex justify-end">
          <SeeAllPhotos propertyName={property.name} images={allPhotos} sections={property.photoSections || []} />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-['Cormorant'] font-semibold text-foreground mb-3 sm:mb-4">{property.name}</h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 font-medium">
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-base">🛏️</span>
                  <span>{property.bedrooms} {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}</span>
                </span>
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-base">👥</span>
                  <span>Up to {property.guests} Guests</span>
                </span>
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-base">🚿</span>
                  <span>{property.bathrooms} {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}</span>
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-['Cormorant'] font-semibold text-foreground mb-4">About This Space</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            <AmenitiesSection sections={property.amenitiesDetailed} simpleAmenities={property.amenities} />

            <div>
              <h2 className="text-2xl font-['Cormorant'] font-semibold text-foreground mb-4">Location</h2>
              <a
                href={property.map?.link}
                target="_blank"
                rel="noreferrer"
                className="block border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
                aria-label={`Open map for ${property.name}`}
              >
                <div className="relative w-full h-72">
                  <iframe
                    title={`${property.name} map`}
                    src={property.map?.embed}
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    style={{ pointerEvents: "none" }}
                  />
                </div>
                <div className="px-5 py-4 text-gray-800 font-medium">{property.map?.title}</div>
              </a>
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingWidget
              price={property.price}
              reviews={property.reviews}
              maxGuests={property.guests}
              bookedDates={allBookedDates}
              maxBedrooms={property.bedrooms}
              pricePerBedroom={property.pricePerBedroom}
              disableBedroomSelection={property.disableBedroomSelection}
              defaultBedrooms={property.defaultBedrooms}
              propertySlug={normalizedSlug}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
