import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/db";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { userId, amount, eventId, tickets } = await req.json();

    // Simulate payment processing
    if (!userId || !amount || !eventId || !tickets) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Connect to the database
    const db = await connectToDB();
    const paymentsCollection = db.collection("payments");

    // Simulate payment success
    const paymentId = new ObjectId(); // Simulate a unique payment ID
    await paymentsCollection.insertOne({
      userId,
      eventId,
      amount,
      tickets,
      paymentId,
      date: new Date(),
      status: "success", // Simulate a successful payment
    });

    return NextResponse.json({ message: "Payment successful", paymentId }, { status: 201 });
  } catch (error) {
    console.error("Error in payment processing:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
