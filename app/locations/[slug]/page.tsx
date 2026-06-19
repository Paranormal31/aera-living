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
  const property = PROPERTY_DATA[slug] || PROPERTY_DATA["retro-den"];
  
  let dynamicBookedDates: string[] = [];
  try {
    const db = getDb();
    const blockedSnap = await db.collection("blockedDates").where("propertySlug", "==", slug).get();
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
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        <div className="grid grid-cols-3 gap-4 h-[500px]">
          <div className="col-span-2 relative rounded-2xl overflow-hidden shadow-lg cursor-pointer">
            <Image src={property.collageImages[0]} alt={property.name} fill className="object-cover" priority />
            <SeeAllPhotos
              propertyName={property.name}
              images={allPhotos}
              sections={property.photoSections || []}
              buttonClassName="absolute inset-0"
              showLabel={false}
            />
          </div>
          <div className="col-span-1 grid grid-rows-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer">
              <Image src={property.collageImages[1]} alt={`${property.name} interior`} fill className="object-cover" />
              <SeeAllPhotos
                propertyName={property.name}
                images={allPhotos}
                sections={property.photoSections || []}
                buttonClassName="absolute inset-0"
                showLabel={false}
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer">
              <Image src={property.collageImages[2]} alt={`${property.name} view`} fill className="object-cover" />
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
          <SeeAllPhotos propertyName={property.name} images={allPhotos} sections={property.photoSections || []} />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-5xl font-['Cormorant'] font-semibold text-foreground mb-4">{property.name}</h1>
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
              propertySlug={slug}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
