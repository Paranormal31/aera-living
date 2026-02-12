"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  propertyName: string;
  images: string[];
  sections?: {
    id: string;
    title: string;
    images: string[];
  }[];
  buttonClassName?: string;
  showLabel?: boolean;
};

export default function SeeAllPhotos({
  propertyName,
  images,
  sections,
  buttonClassName,
  showLabel = true,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const allImages = useMemo(
    () => Array.from(new Set(images.filter(Boolean))),
    [images]
  );
  const hasSections = (sections?.length ?? 0) > 0;
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          buttonClassName ??
          "border border-gray-300 text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition"
        }
        aria-label={`View all ${propertyName} photos`}
      >
        {showLabel ? "See all photos" : null}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white h-full w-full md:max-w-6xl md:h-[90vh] md:mx-auto md:my-[5vh] md:rounded-3xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-end px-4 py-4 border-b">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-10 w-10 rounded-full hover:bg-gray-100 text-2xl leading-none"
                aria-label="Close photo gallery"
              >
                ×
              </button>
            </div>

            {hasSections && (
              <div className="px-6 py-3 border-b overflow-x-auto">
                <div className="flex gap-3 min-w-max">
                  {sections!.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => {
                        const target = sectionRefs.current[section.id];
                        if (target) {
                          target.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }}
                      className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {hasSections ? (
                <div className="space-y-10">
                  {sections!.map((section) => (
                    <div
                      key={section.id}
                      ref={(node) => {
                        sectionRefs.current[section.id] = node;
                      }}
                    >
                      <h3 className="text-2xl font-['Cormorant'] font-semibold text-foreground mb-4">
                        {section.title}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {section.images.map((image, index) => (
                          <div
                            key={`${section.id}-${index}`}
                            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden"
                          >
                            <Image
                              src={image}
                              alt={`${propertyName} ${section.title} ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {allImages.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`${propertyName} photo ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
