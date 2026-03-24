"use client";

import { useEffect, useState } from "react";
import GoogleReviewForm, { type SavedReview } from "@/components/GoogleReviewForm";

const AIRBNB_REVIEW_URL =
  "https://www.airbnb.co.in/rooms/1348558040063059763?search_mode=regular_search&adults=1&check_in=2026-02-16&check_out=2026-02-21&children=0&infants=0&pets=0&source_impression_id=p3_1770881131_P3OwD4VCIb4hRRlH&previous_page_section_name=1000&federated_search_id=c4e55db4-af29-41f1-858b-0d796d07bc2d&scroll_to_review=1584600739553119948";

type FeaturedReview = SavedReview;

const INITIAL_FEATURED_REVIEWS: FeaturedReview[] = [
  {
    name: "Vandan",
    yearsOnAirbnb: "4 months on Airbnb",
    monthYear: "January 2026",
    message:
      "\"Excellent value for money. The property is well-maintained, the staff is friendly,It's rare to find this level of comfort at such an affordable price point. Definitely exceeded my expectations!\"",
  },
  {
    name: "Kaustubh",
    yearsOnAirbnb: "1 year on Airbnb",
    monthYear: "December 2025",
    message:
      "We had a wonderful stay here for 2 days and honestly didn't feel like leaving. The hospitality was truly heartwarming - the hosts were kind, attentive, and always available whenever we needed anything, yet they respected our privacy completely.\nThe interiors are beautifully done, with a perfect blend of comfort and aesthetics. Every corner feels thoughtfully designed, clean, and welcoming, making the place feel more like a cozy home than a rental. The ambience is calm and relaxing, exactly what we were looking for.\nOverall, it was a peaceful, comfortable, and memorable experience. Highly recommend this place to anyone looking for a well-maintained stay with great hospitality. Would definitely love to come back again!",
  },
  {
    name: "Sourish",
    yearsOnAirbnb: "3 years on Airbnb",
    monthYear: "June 2025",
    message:
      "It's a very nice and cozy place. Very beautiful furnished and decorated interiors with helpful caretakers and responsive owner. The place was far off from the city and peaceful and yet food delivery and blinkit were available. It takes a little longer to book cabs but eventually we got a ride everytime. Overall, a very nice stay and definitely recommended if you want some peaceful and an off beat stay!",
  },
  {
    name: "Sneha",
    yearsOnAirbnb: "3 years on Airbnb",
    monthYear: "May 2025",
    message:
      "I had a wonderful stay at this Airbnb! The place was cozy, very well-maintained, and offered a stunning view that made the experience even more enjoyable. Ekaagra was a fantastic host-responsive, friendly, and ensured everything was perfect for my stay. Highly recommended and would definitely love to return!",
  },
  {
    name: "Karan",
    yearsOnAirbnb: "2 years on Airbnb",
    monthYear: "October 2025",
    message:
      "Artistically done up apartment. Has all the amenities. Quiet area with nice views. Just 5 minutes from the Doon International school campus at Riverside.",
  },
  {
    name: "Pihu",
    yearsOnAirbnb: "11 months on Airbnb",
    monthYear: "June 2025",
    message:
      "\"I recently stayed at Doon's Den in Dehradun with my friends during our all-women's trip to Chakrata and other destinations. The Airbnb exceeded our expectations! The bedrooms, washrooms, and kitchen were well-maintained and fully equipped. If you're looking for a serene stay in Dehradun, I highly recommend Doon's Den for a peaceful retreat!\"",
  },
  {
    name: "Anoop",
    yearsOnAirbnb: "5 years on Airbnb",
    monthYear: "April 2025",
    message:
      "our stay at the bnb was very comfortable, and easy. we were looking for a place to chill out on the weekend, and doon's den was a perfect find. every penny spent here is worth it!",
  },
  {
    name: "Deepanshu",
    yearsOnAirbnb: "4 years on Airbnb",
    monthYear: "March 2025",
    message:
      "This Airbnb flat was absolutely perfect! It's cozy, stylish, and has such a warm, inviting atmosphere. The decor is beautiful, making it a great place to relax and unwind. A fantastic spot to chill and feel right at home. Highly recommend!",
  },
];

export default function CustomerReviewPage() {
  const [featuredReviews, setFeaturedReviews] = useState<FeaturedReview[]>(INITIAL_FEATURED_REVIEWS);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      try {
        const response = await fetch("/api/customer-reviews", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load reviews");
        }

        const data = (await response.json()) as { reviews?: FeaturedReview[] };
        if (!cancelled && data.reviews?.length) {
          setFeaturedReviews((current) => {
            const merged = [...current];
            const seen = new Set(current.map((review) => `${review.name}-${review.monthYear}-${review.message}`));

            for (const review of data.reviews ?? []) {
              const key = `${review.name}-${review.monthYear}-${review.message}`;
              if (!seen.has(key)) {
                merged.unshift({
                  name: review.name,
                  yearsOnAirbnb: review.yearsOnAirbnb,
                  monthYear: review.monthYear,
                  message: review.message,
                });
                seen.add(key);
              }
            }

            return merged;
          });
        }
      } catch {
        if (!cancelled) {
          setLoadError("Saved reviews could not be loaded right now.");
        }
      } finally {
        if (!cancelled) {
          setLoadingReviews(false);
        }
      }
    }

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSavedReview = (review: FeaturedReview) => {
    setFeaturedReviews((current) => [review, ...current]);
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-16">
        <div className="max-w-3xl">
          <h1 className="font-['Cormorant'] text-5xl font-semibold text-foreground leading-tight">
            Customer Review
          </h1>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Verified guest feedback from our Airbnb listing.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <GoogleReviewForm onSaved={handleSavedReview} />
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium text-foreground">Featured Reviews</h2>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Handpicked guest feedback from Airbnb stays.
                  </p>
                </div>
                <a
                  href={AIRBNB_REVIEW_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground"
                >
                  Open Listing
                </a>
              </div>

              <div className="mt-6 max-h-[75vh] space-y-6 overflow-y-auto pr-2">
                {loadError && (
                  <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {loadError}
                  </p>
                )}
                {loadingReviews && (
                  <p className="text-sm text-muted-foreground">Loading saved reviews...</p>
                )}
                {featuredReviews.map((review) => (
                  <article key={`${review.name}-${review.monthYear}-${review.message}`} className="rounded-xl border border-border p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 shrink-0 rounded-full bg-neutral-200 text-center text-xl font-semibold leading-[56px] text-foreground">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-foreground">{review.name}</h3>
                        <p className="text-sm text-muted-foreground">{review.yearsOnAirbnb}</p>
                      </div>
                    </div>

                    <p className="mt-4 text-xl font-semibold text-foreground">
                      ***** <span className="text-base">. {review.monthYear}</span>
                    </p>
                    <p className="mt-3 whitespace-pre-line text-lg leading-relaxed text-foreground">
                      {review.message}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
