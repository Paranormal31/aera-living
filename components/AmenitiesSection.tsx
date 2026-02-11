"use client";

import { useMemo, useState } from "react";

type AmenityItem = {
  name: string;
  note?: string;
  unavailable?: boolean;
};

type AmenitySection = {
  title: string;
  items: AmenityItem[];
};

type Props = {
  sections?: AmenitySection[];
  simpleAmenities?: { name: string }[];
  initialCount?: number;
};

export default function AmenitiesSection({
  sections,
  simpleAmenities,
  initialCount = 6,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const getAmenityIcon = (name: string) => {
    const value = name.toLowerCase();
    if (value.includes("wifi")) return "📶";
    if (value.includes("workspace")) return "💻";
    if (value.includes("kitchen")) return "🍳";
    if (value.includes("refrigerator") || value.includes("fridge")) return "🧊";
    if (value.includes("microwave")) return "📡";
    if (value.includes("cooker") || value.includes("cooking")) return "🍲";
    if (value.includes("kettle")) return "🫖";
    if (value.includes("toaster")) return "🍞";
    if (value.includes("rice")) return "🍚";
    if (value.includes("wine")) return "🍷";
    if (value.includes("coffee")) return "☕";
    if (value.includes("dining")) return "🍽️";
    if (value.includes("bath") || value.includes("shower")) return "🛁";
    if (value.includes("hair dryer")) return "💨";
    if (value.includes("shampoo") || value.includes("conditioner") || value.includes("soap"))
      return "🧴";
    if (value.includes("bidet")) return "🚿";
    if (value.includes("hot water")) return "♨️";
    if (value.includes("bed")) return "🛏️";
    if (value.includes("linen") || value.includes("towels")) return "🧺";
    if (value.includes("hangers") || value.includes("wardrobe") || value.includes("storage"))
      return "👚";
    if (value.includes("iron")) return "⚙️";
    if (value.includes("dryer")) return "🌬️";
    if (value.includes("tv") || value.includes("hdtv")) return "📺";
    if (value.includes("record player")) return "🎵";
    if (value.includes("sound")) return "🔊";
    if (value.includes("books")) return "📚";
    if (value.includes("cinema")) return "🎬";
    if (value.includes("board games")) return "🎲";
    if (value.includes("air conditioning") || value.includes("ceiling fan"))
      return "🌀";
    if (value.includes("heater")) return "🔥";
    if (value.includes("security cameras")) return "📹";
    if (value.includes("fire extinguisher")) return "🧯";
    if (value.includes("first aid")) return "🩹";
    if (value.includes("private entrance")) return "🚪";
    if (value.includes("mountain") || value.includes("scenic")) return "⛰️";
    if (value.includes("balcony") || value.includes("patio")) return "🌿";
    if (value.includes("firepit")) return "🔥";
    if (value.includes("parking")) return "🅿️";
    if (value.includes("lift")) return "🛗";
    if (value.includes("smoking")) return "🚬";
    if (value.includes("long-term")) return "🗓️";
    if (value.includes("self check-in")) return "🔑";
    if (value.includes("housekeeping")) return "🧹";
    if (value.includes("launderette")) return "🧼";
    if (value.includes("smoke alarm")) return "🚨";
    if (value.includes("carbon monoxide")) return "⚠️";
    return "•";
  };

  const flattenedItems = useMemo(() => {
    if (sections && sections.length > 0) {
      return sections.flatMap((section) => section.items);
    }
    return (simpleAmenities || []).map((item) => ({ name: item.name }));
  }, [sections, simpleAmenities]);

  const totalCount = flattenedItems.length;
  const previewItems = flattenedItems.slice(0, initialCount);

  return (
    <div>
      <h2 className="text-2xl font-['Cormorant'] font-semibold text-foreground mb-4">
        What this place offers
      </h2>

      {!expanded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {previewItems.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="text-gray-700 flex items-start gap-3"
            >
              <span className="text-lg leading-6">{getAmenityIcon(item.name)}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="border border-gray-300 text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition"
        >
          {`Show all ${totalCount} amenities`}
        </button>
      </div>

      {expanded && (
        <div className="fixed inset-0 z-50 bg-black/70">
          <div className="absolute inset-0" onClick={() => setExpanded(false)} />
          <div className="relative bg-white h-full w-full md:max-w-5xl md:h-[90vh] md:mx-auto md:my-[5vh] md:rounded-3xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-end px-4 py-4 border-b">
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="h-10 w-10 rounded-full hover:bg-gray-100 text-2xl leading-none"
                aria-label="Close amenities"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {sections && sections.length > 0 ? (
                <div className="space-y-8">
                  {sections.map((section) => (
                    <div key={section.title}>
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        {section.title}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.items.map((item, index) => {
                          const displayName = item.unavailable
                            ? item.name.replace(/^Unavailable:\\s*/i, "")
                            : item.name;
                          return (
                            <div
                              key={`${section.title}-${item.name}-${index}`}
                              className={
                                item.unavailable
                                  ? "text-gray-400 line-through flex items-start gap-3"
                                  : "text-gray-700 flex items-start gap-3"
                              }
                            >
                              <span className="text-lg leading-6">
                                {getAmenityIcon(displayName)}
                              </span>
                              <div>
                                <div>{displayName}</div>
                                {item.note ? (
                                  <div
                                    className={
                                      item.unavailable
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }
                                  >
                                    {item.note}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(simpleAmenities || []).map((item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="text-gray-700 flex items-start gap-3"
                    >
                      <span className="text-lg leading-6">
                        {getAmenityIcon(item.name)}
                      </span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
