import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "@/utils/db";

export async function GET(req: Request, { params }: {params: Promise<{id:string}>}) {
  try {
    const { id } = await params;

    // Validate the provided ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    // Connect to the database
    const db = await connectToDB();
    const eventsCollection = db.collection("events");

    // Find the event by its ID
    const event = await eventsCollection.findOne({ _id: new ObjectId(id) });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/events/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
