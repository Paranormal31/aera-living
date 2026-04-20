import { FAQS, LOCATION_LISTINGS, PROPERTY_DATA } from "@/lib/siteContent";

export type KnowledgeDoc = {
  id: string;
  title: string;
  section: string;
  urlPath: string;
  content: string;
  tags: string[];
};

const MANUAL_OVERRIDES = {
  brandName: "AeraLiving",
  assistantName: "Blink - The AeraLiving Assistant",
  supportEmail: "aeraliving.llp@gmail.com",
  supportPhone: "+91 8234079482",
  instagram: "https://www.instagram.com/aeraliving.in/",
};

function dedupe(values: string[]) {
  return [...new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean))];
}

function safeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function buildKnowledgeIndex(): KnowledgeDoc[] {
  const docs: KnowledgeDoc[] = [];

  docs.push({
    id: "brand-overview",
    title: "AeraLiving Brand and Support",
    section: "brand",
    urlPath: "/",
    content: [
      `${MANUAL_OVERRIDES.brandName} is a hospitality and property management brand focused on curated stays and interior design.`,
      `Assistant name: ${MANUAL_OVERRIDES.assistantName}.`,
      `Support email: ${MANUAL_OVERRIDES.supportEmail}.`,
      `Guest operations contact: ${MANUAL_OVERRIDES.supportPhone}.`,
      `Instagram: ${MANUAL_OVERRIDES.instagram}.`,
      "Common intents: location discovery, stay details, amenities, booking help, partnership inquiries.",
    ].join(" "),
    tags: ["brand", "contact", "support", "booking", "partnership"],
  });

  docs.push({
    id: "booking-policy-core",
    title: "Booking, Payment, and Refund Policy",
    section: "policy",
    urlPath: "/faq",
    content: [
      "Bookings can be made via website, WhatsApp, direct phone calls, and platforms like Airbnb, Goibibo, and MakeMyTrip.",
      "To confirm booking: 50% advance payment is required.",
      "Cancellation policy: full refund if more than 7 days before check-in, 50% refund for 3 to 7 days, no refund for less than 3 days.",
      "Check-in is 11:00 AM and check-out is 11:00 AM; early/late timing depends on availability.",
    ].join(" "),
    tags: ["booking", "payment", "refund", "check-in", "check-out", "policy"],
  });

  FAQS.forEach((faq, index) => {
    docs.push({
      id: `faq-${index + 1}`,
      title: faq.question,
      section: "faq",
      urlPath: "/faq",
      content: faq.answer.join(" "),
      tags: dedupe(["faq", ...faq.question.split(/[^a-zA-Z0-9]+/), ...faq.answer.join(" ").split(/[^a-zA-Z0-9]+/)]),
    });
  });

  LOCATION_LISTINGS.forEach((location) => {
    docs.push({
      id: `listing-${location.slug}`,
      title: `${location.name} Listing Summary`,
      section: "locations",
      urlPath: `/locations/${location.slug}`,
      content: [
        `${location.name} in ${location.city}.`,
        `Price shown on listing: ${location.price}.`,
        `${location.bedrooms} bedrooms, up to ${location.guests} guests, ${location.bathrooms} bathrooms.`,
        `Tags: ${location.tags.join(", ")}.`,
      ].join(" "),
      tags: dedupe(["location", "listing", location.slug, location.name, location.city, ...location.tags]),
    });
  });

  Object.entries(PROPERTY_DATA).forEach(([slug, property]) => {
    const simpleAmenities = property.amenities.map((item) => item.name).join(", ");
    const detailedAmenities = property.amenitiesDetailed
      .map((section) => `${section.title}: ${section.items.map((item) => item.name).join(", ")}`)
      .join(" | ");

    docs.push({
      id: `property-${slug}`,
      title: `${property.name} Property Details`,
      section: "property",
      urlPath: `/locations/${slug}`,
      content: [
        `${property.name} in ${property.city}.`,
        `${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, up to ${property.guests} guests.`,
        `Base price: INR ${property.price}.`,
        property.pricePerBedroom ? `Price per bedroom: INR ${property.pricePerBedroom}.` : "",
        safeText(property.description),
      ]
        .filter(Boolean)
        .join(" "),
      tags: dedupe([
        "property",
        "location",
        slug,
        property.name,
        property.city,
        "price",
        "guests",
        "bedrooms",
        "bathrooms",
      ]),
    });

    docs.push({
      id: `amenities-${slug}`,
      title: `${property.name} Amenities`,
      section: "amenities",
      urlPath: `/locations/${slug}`,
      content: `Top amenities: ${simpleAmenities}. Detailed amenities: ${detailedAmenities}.`,
      tags: dedupe([
        "amenities",
        "wifi",
        "kitchen",
        "parking",
        "housekeeping",
        slug,
        property.name,
      ]),
    });
  });

  docs.push({
    id: "interior-design-services",
    title: "Interior Design Services",
    section: "services",
    urlPath: "/interior-design",
    content:
      "AeraLiving offers interior design from concept to final execution with thoughtful, refined interiors balancing luxury, comfort, and timeless design. Users can start projects from the interior design page and explore portfolio transformations.",
    tags: ["interior", "design", "services", "portfolio", "start project"],
  });

  docs.push({
    id: "terms-privacy-summary",
    title: "Terms, Privacy, and Communication",
    section: "policy",
    urlPath: "/terms-of-service",
    content:
      "Aera Living collects guest details needed for booking and legal compliance, does not sell personal data, and may coordinate bookings via website, WhatsApp, phone, Instagram, and external booking platforms. For data rights and policy questions, direct users to Terms of Service and support contact.",
    tags: ["terms", "privacy", "legal", "policy", "whatsapp", "booking"],
  });

  return docs;
}

export const WEBSITE_KNOWLEDGE_INDEX = buildKnowledgeIndex();

export const CONTACT_CTA = `For booking or account-specific help, contact ${MANUAL_OVERRIDES.supportPhone} or ${MANUAL_OVERRIDES.supportEmail}.`;
