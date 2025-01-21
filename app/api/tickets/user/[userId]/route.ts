import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/db";
import { ObjectId } from "mongodb";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const db = await connectToDB();
    const ticketsCollection = db.collection("tickets");
    const eventsCollection = db.collection("events");

    // Fetch tickets for the given userId
    const tickets = await ticketsCollection.find({ userId: userId }).toArray();

    // Fetch event details for each ticket's eventId
    const ticketsWithEventDetails = await Promise.all(
      tickets.map(async (ticket) => {
        const event = await eventsCollection.findOne({ _id: new ObjectId(ticket.eventId) });
        return {
          ...ticket,
          eventName: event?.name,
          eventDescription: event?.description,
        };
      })
    );

    return NextResponse.json({ tickets: ticketsWithEventDetails });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
