"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export type PhotoSection = {
  id: string;
  title: string;
  images: string[];
};

type Props = {
  propertyName: string;
  collageImages: string[];
  sections: PhotoSection[];
};

export default function PhotoTour({ propertyName, collageImages, sections }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState("all");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const allPhotos = useMemo(
    () => sections.flatMap((section) => section.images),
    [sections]
  );

  const modalSections = useMemo(() => {
    const base = [{ id: "all", title: "All photos", images: allPhotos }];
    return base.concat(sections);
  }, [allPhotos, sections]);

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
    const target = sectionRefs.current[activeSectionId];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeSectionId, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const openModal = (sectionId: string) => {
    setActiveSectionId(sectionId);
    setIsOpen(true);
  };

  const collageMain = collageImages[0];
  const collageSideA = collageImages[1];
  const collageSideB = collageImages[2];

  return (
    <section className="max-w-7xl mx-auto px-6 pt-8 pb-12">
      <div className="grid grid-cols-3 gap-4 h-[500px]">
        <button
          type="button"
          onClick={() => openModal("all")}
          className="col-span-2 relative rounded-2xl overflow-hidden shadow-lg group"
          aria-label={`Open ${propertyName} photos`}
        >
          {collageMain && (
            <Image
              src={collageMain}
              alt={propertyName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority
            />
          )}
        </button>
        <div className="col-span-1 grid grid-rows-2 gap-4">
          <button
            type="button"
            onClick={() => openModal("all")}
            className="relative rounded-2xl overflow-hidden shadow-lg group"
            aria-label={`Open ${propertyName} photos`}
          >
            {collageSideA && (
              <Image
                src={collageSideA}
                alt={`${propertyName} interior`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => openModal("all")}
            className="relative rounded-2xl overflow-hidden shadow-lg group"
            aria-label={`Open ${propertyName} photos`}
          >
            {collageSideB && (
              <Image
                src={collageSideB}
                alt={`${propertyName} view`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => openModal("all")}
          className="border border-gray-300 text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition"
        >
          Show all photos
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-3xl font-['Cormorant'] font-semibold text-foreground mb-6">
          Photo tour
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => openModal(section.id)}
              className="text-left group"
              aria-label={`Open ${section.title} photos`}
            >
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow">
                {section.images[0] && (
                  <Image
                    src={section.images[0]}
                    alt={section.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <div className="mt-2 text-gray-800 font-medium">{section.title}</div>
            </button>
          ))}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white h-full w-full md:max-w-5xl md:h-[90vh] md:mx-auto md:my-[5vh] md:rounded-3xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="text-lg font-semibold">{propertyName} photos</div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 rounded-full hover:bg-gray-100"
                aria-label="Close photo tour"
              >
                Close
              </button>
            </div>

            <div className="px-6 py-3 border-b overflow-x-auto">
              <div className="flex gap-3 min-w-max">
                {modalSections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSectionId(section.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                      activeSectionId === section.id
                        ? "bg-gray-900 text-white border-gray-900"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
              {modalSections.map((section) => (
                <div
                  key={section.id}
                  ref={(node) => {
                    sectionRefs.current[section.id] = node;
                  }}
                  className="mb-10"
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
          </div>
        </div>
      )}
    </section>
  );
}
