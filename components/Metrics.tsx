import Image from "next/image";

export default function Metrics() {
  const items = [
    {
      icon: "/icons/properties.png",
      value: "2",
      label: "Premium Properties",
    },
    {
      icon: "/icons/guests.png",
      value: "50+",
      label: "Happy Guests",
    },
    {
      icon: "/icons/locations.png",
      value: "Dehradun",
      label: "Locations",
    },
    {
      icon: "/icons/rating.png",
      value: "4.77",
      label: "Airbnb Rating",
    },
  ];

  return (
    <section className="w-full bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              {/* Icon */}
              <div className="mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-muted">
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={32}
                  height={32}
                />
              </div>

              {/* Value */}
              <div className="text-[32px] font-['Cormorant'] font-semibold tracking-tight text-foreground">
                {item.value}
              </div>

              {/* Label */}
              <div className="mt-1.5 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
