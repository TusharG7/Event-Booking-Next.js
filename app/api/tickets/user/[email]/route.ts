import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "@/utils/db";

export async function GET(req: Request, { params }: {params: Promise<{email:string}>}) {
  const { email } = await params;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const db = await connectToDB();
    const ticketsCollection = db.collection("tickets");
    const eventsCollection = db.collection("events");

    const tickets = await ticketsCollection.find({email}).toArray();

    // Fetch event details for each ticket's eventId
    const ticketsWithEventDetails = await Promise.all(
      tickets.map(async (ticket) => {
        const event = await eventsCollection.findOne({ _id: new ObjectId(ticket.eventId) });
        return {
          ...ticket,
          eventName: event?.name,
          eventDescription: event?.description,
          location: event?.location,
        };
      })
    );

    return NextResponse.json({ tickets: ticketsWithEventDetails });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}