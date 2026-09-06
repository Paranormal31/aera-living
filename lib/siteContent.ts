export type FAQItem = {
  question: string;
  answer: string[];
};

export type ListingLocation = {
  name: string;
  slug: string;
  city: string;
  price: string;
  rating: number;
  reviews: string | number;
  bedrooms: number;
  guests: number;
  bathrooms: number;
  image: string;
  tags: string[];
};

export type PropertyAmenity = {
  icon?: string;
  name: string;
};

export type PropertyAmenityItem = {
  name: string;
  note?: string;
  unavailable?: boolean;
};

export type PropertyAmenitySection = {
  title: string;
  items: PropertyAmenityItem[];
};

export type PropertyPhotoSection = {
  id: string;
  title: string;
  images: string[];
};

export type PropertyMap = {
  title: string;
  link: string;
  embed: string;
};

export type Property = {
  name: string;
  city: string;
  bedrooms: number;
  guests: number;
  bathrooms: number;
  price: number;
  pricePerBedroom?: number;
  disableBedroomSelection?: boolean;
  defaultBedrooms?: number;
  rating: number;
  reviews: string | number;
  description: string;
  amenities: PropertyAmenity[];
  amenitiesDetailed: PropertyAmenitySection[];
  collageImages: string[];
  photoSections: PropertyPhotoSection[];
  bookedDates: string[];
  map: PropertyMap;
};

export const FAQS: FAQItem[] = [
  {
    question: "What is AeraLiving?",
    answer: [
      "AeraLiving is a hospitality and property management company that develops and manages premium Airbnb-style stays.",
      "We partner with property owners to transform their homes into professionally designed vacation rentals and manage the entire operation while sharing profits with the owner.",
    ],
  },
  {
    question: "Where are AeraLiving properties located?",
    answer: [
      "Our properties are primarily located in Dehradun and surrounding scenic areas in Uttarakhand, offering peaceful stays close to nature while remaining easily accessible from the city.",
    ],
  },
  {
    question: "Who can partner with AeraLiving?",
    answer: [
      "Any property owner with a suitable home, villa, or apartment can partner with AeraLiving.",
      "We work especially well with families who own homes in scenic locations, busy professionals with unused properties, and investors looking to convert properties into vacation rentals.",
      "We handle the design, listing, and management while sharing the profits with the owner.",
    ],
  },
  {
    question: "How can guests book an AeraLiving property?",
    answer: [
      "Guests can book through our official website, WhatsApp bookings, direct phone calls, and platforms like Airbnb, Goibibo, MakeMyTrip, and other relevant booking platforms.",
    ],
  },
  {
    question: "What types of properties does AeraLiving offer?",
    answer: [
      "We offer 2BHK stays, 4BHK stays, private villas, and flexible configurations where a 4BHK can be divided into 1BHK, 2BHK, or 3BHK stays depending on guest requirements.",
    ],
  },
  {
    question: "What amenities are included in your properties?",
    answer: [
      "All AeraLiving properties are fully furnished and equipped with essential amenities such as high-speed WiFi, kitchen facilities, a dedicated caretaker, parking space, and comfortable living areas.",
      "Each property also features a unique interior theme such as retro, boho, or cozy aesthetic designs.",
    ],
  },
  {
    question: "What are the check-in and check-out timings?",
    answer: [
      "Check-in is at 11:00 AM and check-out is at 11:00 AM.",
      "Early check-in or late check-out may be available depending on availability.",
    ],
  },
  {
    question: "What is the payment policy?",
    answer: [
      "To confirm a booking, we require a 50% advance payment. The remaining amount is typically paid before or at the time of check-in.",
    ],
  },
  {
    question: "What is your cancellation and refund policy?",
    answer: [
      "More than 7 days before check-in: full refund.",
      "3 to 7 days before check-in: 50% refund.",
      "Less than 3 days before check-in: no refund.",
      "Refund timelines may vary depending on the booking platform used.",
    ],
  },
  {
    question: "What are the house rules?",
    answer: [
      "Smoking is permitted and pets are not allowed.",
      "Housekeeping services are available on request, and our support team is available 24/7 to assist guests during their stay.",
    ],
  },
];

export const LOCATION_LISTINGS: ListingLocation[] = [
  {
    name: "Room 4O4",
    slug: "room-4o4",
    city: "Dehradun, India",
    price: "₹2,499",
    rating: 5,
    reviews: "New Launch",
    bedrooms: 1,
    guests: 2,
    bathrooms: 1,
    image: "/locations/room-4o4/living-room/1.jpeg",
    tags: ["Designed by Aera", "Modern", "Workstation"],
  },
  {
    name: "Retro Den",
    slug: "retro-den",
    city: "Dehradun, India",
    price: "Starting from ₹2,499",
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
    price: "₹3,399",
    rating: 4.77,
    reviews: 13,
    bedrooms: 2,
    guests: 6,
    bathrooms: 2,
    image: "/images/doons-den.jpg",
    tags: ["Spacious", "Modern", "Family Friendly"],
  },
  {
    name: "Terra House",
    slug: "terra-house",
    city: "Dehradun, India",
    price: "Starting from ₹3,000",
    rating: 5,
    reviews: "New Launch",
    bedrooms: 2,
    guests: 4,
    bathrooms: 2,
    image: "/images/terra-house.jpg",
    tags: ["Nature Facing", "Spacious", "Family Friendly"],
  },
];

export const PROPERTY_DATA: Record<string, Property> = {
  "room-4o4": {
    name: "ROOM 4O4",
    city: "Dehradun, India",
    bedrooms: 1,
    guests: 2,
    bathrooms: 1,
    price: 2499,
    rating: 5.0,
    reviews: "New Launch",
    description:
      "Designed by Aera Living, ROOM 4O4 is a refined, aesthetic studio stay featuring clean lines, premium comfort, and modern convenience in Dehradun. Perfect for couples, solo travelers, and remote work.",
    amenities: [
      { icon: "📶", name: "High-Speed WiFi" },
      { icon: "🍳", name: "Kitchen" },
      { icon: "💻", name: "Dedicated Workspace" },
      { icon: "🚗", name: "Free Parking" },
      { icon: "📺", name: "Smart TV" },
      { icon: "❄️", name: "Air Conditioning" },
    ],
    amenitiesDetailed: [
      {
        title: "Popular Amenities",
        items: [
          { name: "Kitchen" },
          { name: "Wifi" },
          { name: "Dedicated workspace" },
          { name: "Free parking on premises" },
          { name: "TV" },
          { name: "Air conditioning" },
          { name: "Fridge" },
        ],
      },
      {
        title: "Bathroom & Essentials",
        items: [
          { name: "Hot water" },
          { name: "Shampoo" },
          { name: "Body soap" },
          { name: "Shower gel" },
          { name: "Essentials", note: "Towels, bed sheets, soap and toilet paper" },
          { name: "Hangers" },
        ],
      },
    ],
    collageImages: [
      "/locations/room-4o4/living-room/1.jpeg",
      "/locations/room-4o4/bedroom/1.jpeg",
      "/locations/room-4o4/kitchenette/1.jpeg",
    ],
    photoSections: [
      { id: "living-room", title: "Living room", images: ["/locations/room-4o4/living-room/1.jpeg", "/locations/room-4o4/living-room/2.jpeg"] },
      { id: "kitchenette", title: "Kitchenette", images: ["/locations/room-4o4/kitchenette/1.jpeg", "/locations/room-4o4/kitchenette/2.jpeg", "/locations/room-4o4/kitchenette/3.jpeg", "/locations/room-4o4/kitchenette/4.jpeg"] },
      { id: "bedroom", title: "Bedroom", images: ["/locations/room-4o4/bedroom/1.jpeg", "/locations/room-4o4/bedroom/2.jpeg", "/locations/room-4o4/bedroom/3.jpeg", "/locations/room-4o4/bedroom/4.jpeg", "/locations/room-4o4/bedroom/5.jpeg"] },
      { id: "bathroom", title: "Full bathroom", images: ["/locations/room-4o4/bathroom/1.jpeg", "/locations/room-4o4/bathroom/2.jpeg"] },
      { id: "workspace", title: "Workspace", images: ["/locations/room-4o4/workspace/1.jpeg"] },
      { id: "balcony", title: "Balcony", images: ["/locations/room-4o4/balcony/1.jpeg"] },
      { id: "additional-photos", title: "Additional photos", images: ["/locations/room-4o4/additional-photos/1.jpeg", "/locations/room-4o4/additional-photos/2.jpeg"] },
    ],
    bookedDates: [
      "2026-08-01",
      "2026-08-02",
      "2026-08-03",
      "2026-08-04",
      "2026-08-05",
      "2026-08-06",
      "2026-08-07",
      "2026-08-08",
      "2026-08-10",
      "2026-08-11",
      "2026-08-12",
      "2026-08-13",
    ],
    map: {
      title: "ROOM 4O4 — Designed by Aera Living",
      link: "https://www.google.com/maps/place/ROOM+4O4+%E2%80%94+Designed+by+Aera+Living/@30.3700727,77.9783418,19z/data=!4m6!3m5!1s0x3908d5d16c712a61:0x2ab890e7bcf1b965!8m2!3d30.3700489!4d77.9785794!16s%2Fg%2F11zdncdndy?hl=en-us&entry=ttu&g_ep=EgoyMDI2MDgxMS4wIKXMDSoASAFQAw%3D%3D",
      embed: "https://maps.google.com/maps?q=30.3700727,77.9783418&z=19&output=embed",
    },
  },
  "retro-den": {
    name: "The Retro Den",
    city: "Dehradun, India",
    bedrooms: 4,
    guests: 12,
    bathrooms: 3,
    price: 9999,
    pricePerBedroom: 2499,
    disableBedroomSelection: true,
    defaultBedrooms: 4,
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
          { name: "55-inch HDTV with Amazon Prime Video, Disney+, Netflix, standard cable/satellite" },
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
          { name: "Luggage drop-off allowed", note: "For guests' convenience when they are arriving early or departing late" },
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
          { name: "Smoke alarm", note: "This place may not have a smoke detector. Contact the host with any questions.", unavailable: true },
          { name: "Carbon monoxide alarm", note: "This place may not have a carbon monoxide detector. Contact the host with any questions.", unavailable: true },
        ],
      },
    ],
    collageImages: ["/locations/retro-den/1.jpg", "/locations/retro-den/2.jpg", "/locations/retro-den/3.jpg"],
    photoSections: [
      { id: "living-room", title: "Living room", images: ["/locations/retro-den/living-room/1.jpg", "/locations/retro-den/living-room/2.jpg", "/locations/retro-den/living-room/3.jpg"] },
      { id: "kitchen", title: "Full kitchen", images: ["/locations/retro-den/kitchen/1.jpg", "/locations/retro-den/kitchen/2.jpg", "/locations/retro-den/kitchen/3.jpg"] },
      { id: "dining-area", title: "Dining area", images: ["/locations/retro-den/dining-area/1.jpg", "/locations/retro-den/dining-area/2.jpg"] },
      { id: "bedroom-1", title: "Bedroom 1", images: ["/locations/retro-den/bedroom-1/1.jpg", "/locations/retro-den/bedroom-1/2.jpg", "/locations/retro-den/bedroom-1/3.jpg", "/locations/retro-den/bedroom-1/4.jpg"] },
      { id: "bedroom-2", title: "Bedroom 2", images: ["/locations/retro-den/bedroom-2/1.jpg", "/locations/retro-den/bedroom-2/2.jpg", "/locations/retro-den/bedroom-2/3.jpg"] },
      { id: "bedroom-3", title: "Bedroom 3", images: ["/locations/retro-den/bedroom-3/1.jpg", "/locations/retro-den/bedroom-3/2.jpg", "/locations/retro-den/bedroom-3/3.jpg"] },
      { id: "bedroom-4", title: "Bedroom 4", images: ["/locations/retro-den/bedroom-4/1.jpg", "/locations/retro-den/bedroom-4/2.jpg", "/locations/retro-den/bedroom-4/3.jpg"] },
      { id: "bathroom-1", title: "Full bathroom 1", images: ["/locations/retro-den/bathroom-1/1.jpg", "/locations/retro-den/bathroom-1/2.jpg"] },
      { id: "bathroom-2", title: "Full bathroom 2", images: ["/locations/retro-den/bathroom-2/1.jpg", "/locations/retro-den/bathroom-2/2.jpg"] },
      { id: "bathroom-3", title: "Full bathroom 3", images: ["/locations/retro-den/bathroom-3/1.jpg", "/locations/retro-den/bathroom-3/2.jpg"] },
      { id: "balcony", title: "Balcony", images: ["/locations/retro-den/balcony/1.jpg", "/locations/retro-den/balcony/2.jpg", "/locations/retro-den/balcony/3.jpg"] },
      { id: "additional-photos", title: "Additional photos", images: ["/locations/retro-den/additional-photos/1.jpg", "/locations/retro-den/additional-photos/2.jpg"] },
    ],
    bookedDates: [],
    map: {
      title: "The Retro Den – AERA Living",
      link: "https://www.google.com/maps/place/The+Retro+Den+%E2%80%93+AERA+Living/@30.299096,78.0299097,17z/data=!3m1!4b1!4m6!3m5!1s0x3909299dafd04799:0x1740e73e948e47c0!8m2!3d30.299096!4d78.0299097!16s%2Fg%2F11ywbxt694?hl=en&entry=ttu&g_ep=EgoyMDI2MDIwOS4wIKXMDSoASAFQAw%3D%3D",
      embed: "https://www.google.com/maps?q=30.299096,78.0299097&z=16&output=embed",
    },
  },
  "doons-den": {
    name: "Doon's Den",
    city: "Dehradun, India",
    bedrooms: 2,
    guests: 6,
    bathrooms: 2,
    price: 3399,
    rating: 5,
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
      { title: "Scenic views", items: [{ name: "Mountain view" }] },
      { title: "Bathroom", items: [{ name: "Shampoo" }, { name: "Conditioner" }, { name: "Body soap" }, { name: "Hot water" }, { name: "Shower gel" }] },
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
      { title: "Entertainment", items: [{ name: "TV" }, { name: "Bluetooth sound system" }, { name: "Books and reading material" }] },
      { title: "Family", items: [{ name: "Board games" }] },
      { title: "Heating and cooling", items: [{ name: "Air conditioning" }, { name: "Ceiling fan" }, { name: "Portable heater" }] },
      { title: "Home safety", items: [{ name: "Exterior security cameras on property", note: "Entire building" }, { name: "Fire extinguisher" }, { name: "First aid kit" }] },
      { title: "Internet and office", items: [{ name: "Wifi" }, { name: "Dedicated workspace" }] },
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
      { title: "Location features", items: [{ name: "Private entrance", note: "Separate street or building entrance" }, { name: "Launderette nearby" }] },
      { title: "Outdoor", items: [{ name: "Private patio or balcony" }, { name: "Firepit" }, { name: "Outdoor furniture" }, { name: "Outdoor dining area" }] },
      { title: "Parking and facilities", items: [{ name: "Free parking on premises" }, { name: "Free on-street parking" }] },
      { title: "Services", items: [{ name: "Smoking allowed" }, { name: "Long-term stays allowed", note: "Allow stays of 28 days or more" }, { name: "Self check-in" }, { name: "Building staff", note: "Someone is available 24 hours a day to let guests in" }, { name: "Housekeeping", note: "Available at extra cost" }] },
      {
        title: "Not included",
        items: [
          { name: "Washing machine", unavailable: true },
          { name: "Dryer", unavailable: true },
          { name: "Smoke alarm", note: "This place may not have a smoke detector. Contact the host with any questions.", unavailable: true },
          { name: "Carbon monoxide alarm", note: "This place may not have a carbon monoxide detector. Contact the host with any questions.", unavailable: true },
        ],
      },
    ],
    collageImages: ["/locations/doons-den/1.jpg", "/locations/doons-den/2.jpg", "/locations/doons-den/3.jpg"],
    photoSections: [
      { id: "living-room", title: "Living room", images: ["/locations/doons-den/living-room/1.jpg", "/locations/doons-den/living-room/2.jpg", "/locations/doons-den/living-room/3.jpg", "/locations/doons-den/living-room/4.jpg", "/locations/doons-den/living-room/5.jpg", "/locations/doons-den/living-room/6.jpg", "/locations/doons-den/living-room/7.jpg", "/locations/doons-den/living-room/8.jpg"] },
      { id: "full-kitchen", title: "Full kitchen", images: ["/locations/doons-den/full-kitchen/1.jpg", "/locations/doons-den/full-kitchen/2.jpg", "/locations/doons-den/full-kitchen/3.jpg", "/locations/doons-den/full-kitchen/4.jpg", "/locations/doons-den/full-kitchen/5.jpg", "/locations/doons-den/full-kitchen/6.jpg"] },
      { id: "dining-area", title: "Dining area", images: ["/locations/doons-den/dinning-area/1.jpg", "/locations/doons-den/dinning-area/2.jpg"] },
      { id: "bedroom-1", title: "Bedroom 1", images: ["/locations/doons-den/bedroom-1/1.jpg", "/locations/doons-den/bedroom-1/2.jpg", "/locations/doons-den/bedroom-1/3.jpg", "/locations/doons-den/bedroom-1/4.jpg", "/locations/doons-den/bedroom-1/5.jpg", "/locations/doons-den/bedroom-1/6.jpg"] },
      { id: "bedroom-2", title: "Bedroom 2", images: ["/locations/doons-den/bedroom-2/1.jpg", "/locations/doons-den/bedroom-2/2.jpg", "/locations/doons-den/bedroom-2/3.jpg", "/locations/doons-den/bedroom-2/4.jpg", "/locations/doons-den/bedroom-2/5.jpg", "/locations/doons-den/bedroom-2/6.jpg"] },
      { id: "bathroom-1", title: "Full bathroom 1", images: ["/locations/doons-den/bathroom-1/1.jpg"] },
      { id: "bathroom-2", title: "Full bathroom 2", images: ["/locations/doons-den/bathroom-2/1.jpg"] },
      { id: "balcony", title: "Balcony", images: ["/locations/doons-den/balcony/1.jpg"] },
      { id: "additional-photos", title: "Additional photos", images: ["/locations/doons-den/additional-photos/1.jpg", "/locations/doons-den/additional-photos/2.jpg", "/locations/doons-den/additional-photos/3.jpg"] },
    ],
    bookedDates: [],
    map: {
      title: "Doon's Den – AERA Living",
      link: "https://www.google.com/maps?hl=en&gl=in&um=1&ie=UTF-8&fb=1&sa=X&ftid=0x3908d5775cebf083:0x97701f5a5586f717",
      embed: "https://www.google.com/maps?q=Doon%27s%20Den%20AERA%20Living%20Dehradun&z=16&output=embed",
    },
  },
  "terra-house": {
    name: "Terra House",
    city: "Dehradun, India",
    bedrooms: 2,
    guests: 4,
    bathrooms: 2,
    price: 6499,
    rating: 5,
    reviews: "New Launch",
    description:
      "The Terra House is a peaceful 2BHK villa in Sahastradhara with mountain views, a private balcony swing, and a cozy lawn seating area. Featuring spacious bedrooms, a warm living space, and dedicated work & workout corners, it's perfect for relaxing getaways, workations, and small groups seeking comfort, privacy, and a calm escape.",
    amenities: [
      { icon: "📶", name: "High-Speed WiFi" },
      { icon: "🔥", name: "Firepit" },
      { icon: "🚗", name: "Free Parking" },
      { icon: "🚬", name: "Smoking Allowed" },
      { icon: "🔑", name: "Self Check-in" },
      { icon: "🛡️", name: "Home Safety" },
    ],
    amenitiesDetailed: [
      {
        title: "Home safety",
        items: [
          { name: "Exterior security cameras on property", note: "Camera at the premise to track entry" },
          { name: "Fire extinguisher" },
          { name: "First aid kit" },
        ],
      },
      {
        title: "Internet and office",
        items: [{ name: "Wifi" }],
      },
      {
        title: "Outdoor",
        items: [{ name: "Firepit" }, { name: "Outdoor dining area" }],
      },
      {
        title: "Parking and facilities",
        items: [{ name: "Free parking on premises" }],
      },
      {
        title: "Services",
        items: [
          { name: "Smoking allowed" },
          { name: "Self check-in" },
          { name: "Building staff", note: "Someone is available 24 hours a day to let guests in" },
        ],
      },
      {
        title: "Not included",
        items: [
          { name: "Kitchen", unavailable: true },
          { name: "TV", unavailable: true },
          { name: "Washing machine", unavailable: true },
          { name: "Tumble dryer", unavailable: true },
          { name: "Air conditioning", unavailable: true },
          { name: "Essentials", unavailable: true },
          {
            name: "Smoke alarm",
            note: "This place may not have a smoke detector. Contact the host with any questions.",
            unavailable: true,
          },
          {
            name: "Carbon monoxide alarm",
            note: "This place may not have a carbon monoxide detector. Contact the host with any questions.",
            unavailable: true,
          },
          { name: "Heating", unavailable: true },
          { name: "Hot water", unavailable: true },
        ],
      },
    ],
    collageImages: [
      "/locations/terra-house/1.jpg",
      "/locations/terra-house/2.jpg",
      "/locations/terra-house/3.jpg",
    ],
    photoSections: [
      {
        id: "living-room",
        title: "Living room",
        images: [
          "/locations/terra-house/living-room/1.jpg",
          "/locations/terra-house/living-room/2.jpg",
          "/locations/terra-house/living-room/3.jpg",
          "/locations/terra-house/living-room/4.jpg",
        ],
      },
      {
        id: "bedroom-1",
        title: "Bedroom 1",
        images: [
          "/locations/terra-house/bedroom-1/1.jpg",
          "/locations/terra-house/bedroom-1/2.jpg",
          "/locations/terra-house/bedroom-1/3.jpg",
          "/locations/terra-house/bedroom-1/4.jpg",
        ],
      },
      {
        id: "bedroom-2",
        title: "Bedroom 2",
        images: [
          "/locations/terra-house/bedroom-2/1.jpg",
          "/locations/terra-house/bedroom-2/2.jpg",
          "/locations/terra-house/bedroom-2/3.jpg",
        ],
      },
      {
        id: "bathroom-1",
        title: "Full bathroom 1",
        images: ["/locations/terra-house/bathroom-1/1.jpg"],
      },
      {
        id: "bathroom-2",
        title: "Full bathroom 2",
        images: ["/locations/terra-house/bathroom-2/1.jpg"],
      },
      {
        id: "outdoor",
        title: "Outdoor",
        images: [
          "/locations/terra-house/outdoor/1.jpg",
          "/locations/terra-house/outdoor/2.jpg",
          "/locations/terra-house/outdoor/3.jpg",
          "/locations/terra-house/outdoor/4.jpg",
          "/locations/terra-house/outdoor/5.jpg",
        ],
      },
      {
        id: "additional-photos",
        title: "Additional photos",
        images: [
          "/locations/terra-house/additional-photos/1.png",
          "/locations/terra-house/additional-photos/2.jpg",
          "/locations/terra-house/additional-photos/3.jpg",
          "/locations/terra-house/additional-photos/4.jpg",
          "/locations/terra-house/additional-photos/5.jpg",
          "/locations/terra-house/additional-photos/6.jpg",
        ],
      },
    ],
    bookedDates: [],
    map: {
      title: "The Terra House – Curated Stay by AERA Living",
      link: "https://www.google.com/maps/place/The+Terra+House+%7C+Curated+Stay+by+AERA+Living/@30.3631543,78.1137644,17z/data=!3m1!4b1!4m6!3m5!1s0x3908d957f8fd7d09:0x537debe5f9cd8994!8m2!3d30.3631543!4d78.1137644!16s%2Fg%2F11nhlmky1y!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MDQyMi4wIKXMDSoASAFQAw%3D%3D",
      embed: "https://www.google.com/maps?q=30.3631543,78.1137644&z=17&output=embed",
    },
  },
};
