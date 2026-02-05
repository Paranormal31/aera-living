"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Review = {
  id: string;
  name: string;
  rating: number;
  message: string;
  photoDataUrl?: string | null;
  createdAt: string;
};

const STORAGE_KEY = "aeraLivingReviews";

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });

export default function CustomerReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as Review[];
      if (Array.isArray(parsed)) setReviews(parsed);
    } catch {
      // Ignore malformed storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const sortedReviews = useMemo(() => {
    return [...reviews].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [reviews]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const photoDataUrl = photo ? await readFileAsDataUrl(photo) : null;
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now());
      const newReview: Review = {
        id,
        name: name.trim(),
        rating,
        message: message.trim(),
        photoDataUrl,
        createdAt: new Date().toISOString(),
      };

      setReviews((prev) => [newReview, ...prev]);
      setName("");
      setRating(5);
      setMessage("");
      setPhoto(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-16">
        <div className="max-w-3xl">
          <h1 className="font-['Cormorant'] text-5xl font-semibold text-foreground leading-tight">
            Customer Review
          </h1>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Share your experience with AeraLiving. Add a short review and an
            optional photo, and your feedback will show up below.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-10">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 rounded-2xl border border-border p-6 shadow-sm"
          >
            <h2 className="text-lg font-medium text-foreground">
              Post a Review
            </h2>

            <label className="mt-6 block text-sm font-medium text-foreground">
              Name
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm"
              required
            />

            <label className="mt-5 block text-sm font-medium text-foreground">
              Rating
            </label>
            <div
              className="mt-2 flex items-center gap-2"
              role="radiogroup"
              aria-label="Rating"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  role="radio"
                  aria-checked={rating === star}
                  onClick={() => setRating(star)}
                  className="text-2xl leading-none text-foreground transition-transform hover:scale-110"
                >
                  {star <= rating ? "★" : "☆"}
                </button>
              ))}
            </div>

            <label className="mt-5 block text-sm font-medium text-foreground">
              Review
            </label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Share your experience..."
              rows={5}
              className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm"
              required
            />

            <label className="mt-5 block text-sm font-medium text-foreground">
              Photo (optional)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(event) =>
                setPhoto(event.target.files ? event.target.files[0] : null)
              }
              className="mt-2 w-full text-sm"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Posting..." : "Post Review"}
            </button>
          </form>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-foreground">
                Recent Reviews
              </h2>
              <span className="text-sm text-muted-foreground">
                {sortedReviews.length} total
              </span>
            </div>

            {sortedReviews.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-sm text-muted-foreground">
                No reviews yet. Be the first to share your experience.
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-6">
                {sortedReviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-2xl border border-border p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-medium text-foreground">
                          {review.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        Rating: {review.rating} / 5
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                      {review.message}
                    </p>

                    {review.photoDataUrl ? (
                      <div className="mt-4 overflow-hidden rounded-xl border border-border">
                        <img
                          src={review.photoDataUrl}
                          alt={`${review.name} review`}
                          className="h-56 w-full object-cover"
                        />
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
