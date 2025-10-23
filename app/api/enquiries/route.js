import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// We will add a secret key to protect this endpoint
const SECRET_KEY = process.env.DASHBOARD_SECRET_KEY;

export async function GET(request) {
  // IMPORTANT: Protect your API route
  const authHeader = request.headers.get('authorization');
  if (!SECRET_KEY || authHeader !== `Bearer ${SECRET_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb("supershield");
    const collection = db.collection("enquire-management");

    // Fetch all documents, sorted by newest first
    const enquiries = await collection.find({})
                                      .sort({ createdAt: -1 })
                                      .toArray();

    return NextResponse.json(enquiries);

  } catch (error) {
    console.error("Failed to fetch enquiries:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}