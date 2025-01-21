import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/db";
import { ObjectId } from "mongodb";
import { generateQRCode } from "@/utils/qr";

export async function POST(req: Request) {
    try {
      const { eventId, email, tickets, userId, paymentMethod, paidAmount } = await req.json();
  
      // Validate userId, email, and ticket details
      if (!userId || !email || !tickets || !paymentMethod || !paidAmount) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
  
      const db = await connectToDB();
      const eventsCollection = db.collection("events");
      const ticketsCollection = db.collection("tickets");
  
      // Validate event existence
      const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
  
      // Check if the number of requested tickets exceeds the available tickets
      if (tickets > event.availableTickets) {
        return NextResponse.json({ error: "Not enough tickets available" }, { status: 400 });
      }
  
      // Check if the user has already booked tickets exceeding maxPerPerson
      const existingTickets = await ticketsCollection.find({ userId }).toArray();
      const totalBooked = existingTickets.reduce((sum, t) => sum + t.tickets, 0);
      if (totalBooked + tickets > event.maxPerPerson) {
        return NextResponse.json(
          { error: "You have exceeded the maximum tickets per person" },
          { status: 400 }
        );
      }
  
      // Generate QR code for the ticket (mock QR generation)
      const qr = await generateQRCode(userId, eventId, tickets); // Assuming you have a utility for this
  
      // Create the ticket log entry
      const ticket = await ticketsCollection.insertOne({
        eventId,
        email,
        userId,
        tickets,
        paymentMethod,
        paidAmount,
        qr,
        date: new Date(),
      });
  
      // Update available tickets for the event
      await eventsCollection.updateOne(
        { _id: new ObjectId(eventId) },
        { $inc: { availableTickets: -tickets } }
      );
  
      return NextResponse.json({ message: "Tickets booked successfully", qr }, { status: 201 });
    } catch (error) {
      console.error("Error in booking tickets:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
