"use client";

import { useEffect, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  getAuth,
  type User,
} from "firebase/auth";

export type SavedReview = {
  name: string;
  yearsOnAirbnb: string;
  monthYear: string;
  message: string;
};

type GoogleReviewFormProps = {
  onSaved?: (review: SavedReview) => void;
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseApp() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  return getApps()[0];
}

function getAuthInstance() {
  return getAuth(getFirebaseApp());
}

export default function GoogleReviewForm({ onSaved }: GoogleReviewFormProps) {
  const [user, setUser] = useState<User | null>(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const ratingOptions = [1, 2, 3, 4, 5];

  useEffect(() => {
    const auth = getAuthInstance();
    return onAuthStateChanged(auth, setUser);
  }, []);

  const signIn = async () => {
    setStatus("");
    const auth = getAuthInstance();
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const submitReview = async () => {
    if (!user) {
      setStatus("Please sign in with Google first.");
      return;
    }
    if (!review.trim()) {
      setStatus("Please write a review before submitting.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/customer-reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.displayName || user.email || "Guest",
          rating,
          review,
          photoURL: user.photoURL,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save review");
      }

      onSaved?.({
        name: user.displayName || user.email || "Guest",
        yearsOnAirbnb: "New review",
        monthYear: new Date().toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        message: review,
      });

      setReview("");
      setStatus("Review saved successfully.");
    } catch (error) {
      setStatus("Could not save review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border p-6 shadow-sm">
      <h2 className="text-lg font-medium text-foreground">Post a Review</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        Sign in with Google to share your review securely.
      </p>

      {!user ? (
        <button
          type="button"
          onClick={signIn}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
        >
          Continue with Google
        </button>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-neutral-50 p-4 text-sm text-foreground">
            Signed in as <span className="font-medium">{user.displayName || user.email}</span>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-foreground">Rating</span>
            <div className="mt-2 flex items-center gap-2">
              {ratingOptions.map((value) => {
                const active = value <= rating;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="text-2xl leading-none text-gray-400 transition-colors hover:text-amber-500"
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    aria-pressed={rating === value}
                  >
                    <span className={active ? "text-amber-500" : "text-gray-400"}>
                      ★
                    </span>
                  </button>
                );
              })}
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-foreground">Your review</span>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={5}
              className="mt-2 w-full rounded-xl border border-border px-4 py-3"
              placeholder="Tell us about your stay"
            />
          </label>

          <button
            type="button"
            onClick={submitReview}
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Review"}
          </button>
        </div>
      )}

      {status && <p className="mt-4 text-sm text-muted-foreground">{status}</p>}
    </div>
  );
}
