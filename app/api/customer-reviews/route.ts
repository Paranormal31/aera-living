import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getDb } from "@/lib/firebaseAdmin";

type ReviewPayload = {
  name?: string;
  rating?: number;
  review?: string;
  photoURL?: string | null;
};

type ReviewRecord = {
  id: string;
  name: string;
  rating?: number;
  yearsOnAirbnb: string;
  monthYear: string;
  message: string;
  status: "published" | "hidden";
};

function formatMonthYear(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function isAdminRequest(req: Request) {
  const token = req.headers.get("x-admin-token");
  const expected = process.env.CHATBOT_ADMIN_TOKEN || process.env.ADMIN_REVIEWS_TOKEN;
  return Boolean(expected && token && token === expected);
}

export async function GET() {
  try {
    const db = getDb();
    const snapshot = await db.collection("customerReviews").orderBy("createdAt", "desc").get();

    const reviews: ReviewRecord[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.() ?? new Date();
      return {
        id: doc.id,
        name: data.name ?? "Guest",
        rating: data.rating,
        yearsOnAirbnb: data.rating ? `${data.rating} star review` : "Guest review",
        monthYear: formatMonthYear(createdAt),
        message: data.review ?? "",
        status: data.status ?? "published",
      };
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Failed to load customer reviews:", error);
    return NextResponse.json({ error: "Unable to load reviews right now" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice("Bearer ".length);
    const decoded = await getAdminAuth().verifyIdToken(token);
    const body = (await req.json()) as ReviewPayload;
    const reviewText = body.review?.trim();

    if (!body.name?.trim() || !reviewText || !body.rating) {
      return NextResponse.json({ error: "Missing review fields" }, { status: 400 });
    }

    const db = getDb();
    const doc = await db.collection("customerReviews").add({
      uid: decoded.uid,
      name: body.name.trim(),
      email: decoded.email ?? null,
      rating: body.rating,
      review: reviewText,
      photoURL: body.photoURL ?? null,
      status: "published",
      createdAt: FieldValue.serverTimestamp(),
      source: "google-auth",
    });

    return NextResponse.json({ id: doc.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to store customer review:", error);
    return NextResponse.json({ error: "Unable to store review right now" }, { status: 500 });
  }
}
