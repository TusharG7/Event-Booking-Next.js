import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDB } from "@/utils/db";

// Define the Zod schema for validation
const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  availableTickets: z.number().min(1, "Must have at least 1 ticket available"),
  maxPerPerson: z.number().min(1, "Maximum tickets per person must be 1 or more"),
  price: z.number().nonnegative("Price must be 0 or more"),
});

export async function GET() {
    try {
      // Connect to the database
      const db = await connectToDB();
      const eventsCollection = db.collection("events");
  
      // Fetch all events
      const events = await eventsCollection.find().toArray();
  
      return NextResponse.json(events, { status: 200 });
    } catch (error: any) {
      console.error("Error in GET /api/events:", error);
      return NextResponse.json(
        { error: "Internal server error", details: error.message },
        { status: 500 }
      );
    }
  }

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();

    // Validate the body using Zod
    const result = eventSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const validEvent = result.data;

    // Connect to the database
    const db = await connectToDB();
    const eventsCollection = db.collection("events");

    // Insert the new event
    const insertResult = await eventsCollection.insertOne(validEvent);

    return NextResponse.json(
      { message: "Event created successfully", eventId: insertResult.insertedId },
      { status: 201 }
    );
  } catch (error:any) {
    console.error("Error in POST /api/events:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
