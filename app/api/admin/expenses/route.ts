import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    if (!(await verifyAuth("expenses_session"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const snapshot = await db.collection("expenses").get();

    const expenses = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        amount: data.amount || 0,
        merchant: data.merchant || "",
        category: data.category || "",
        location: data.location || "",
        paymentMethod: data.paymentMethod || "Cash",
        spender: data.spender || "Ekaagra",
        property: data.property || "Doons Den",
        date: data.date || "",
        createdAt: data.createdAt || "",
        receiptUrl: data.receiptUrl || "",
      };
    });

    // Sort by date (descending), then by createdAt (descending)
    expenses.sort((a, b) => {
      if (b.date !== a.date) {
        return b.date.localeCompare(a.date);
      }
      return b.createdAt.localeCompare(a.createdAt);
    });

    return NextResponse.json({ expenses });
  } catch (error: any) {
    console.error("Fetch expenses failed", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await verifyAuth("expenses_session"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { amount, merchant, category, location, paymentMethod, spender, property, date, receiptUrl } = body;

    if (!amount || !merchant || !category || !location || !paymentMethod || !spender || !property || !date) {
      return NextResponse.json({ error: "Missing required expense details" }, { status: 400 });
    }

    const db = getDb();
    const docRef = await db.collection("expenses").add({
      amount: Number(amount),
      merchant,
      category,
      location,
      paymentMethod,
      spender,
      property,
      date,
      receiptUrl: receiptUrl || "",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error("Create expense failed", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await verifyAuth("expenses_session"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const db = getDb();
    await db.collection("expenses").doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete expense failed", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
