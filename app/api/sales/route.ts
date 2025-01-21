import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { connectToDB } from "@/utils/db";

export async function GET() {
  try {
    const db = await connectToDB();

    const ticketCollection = db.collection("tickets");
    const eventCollection = db.collection("events");

    const salesData = await ticketCollection
      .aggregate([
        {
          $group: {
            _id: "$eventId",  
            totalTicketsSold: { $sum: "$tickets" },
            totalRevenue: { $sum: "$paidAmount" },
          },
        },
        {
          $lookup: {
            from: "events",
            let: { event_id: { $toObjectId: "$_id" } }, 
            pipeline: [
              {
                $match: { 
                  $expr: { 
                    $eq: ["$_id", "$$event_id"] 
                  }
                }
              }
            ],
            as: "eventDetails",
          },
        },
        { $unwind: "$eventDetails" }, 
        {
          $project: {
            eventId: "$_id",  
            eventName: "$eventDetails.name", 
            date: "$eventDetails.date", 
            location: "$eventDetails.location", 
            ticketsSold: "$totalTicketsSold", 
            revenue: "$totalRevenue",
            _id: 0,  
          },
        },
        { $sort: { ticketsSold: -1 } }, 
      ])
      .toArray();

    if (salesData.length === 0) {
      console.log("No data found, please check the data in the collections.");
    }

    return NextResponse.json(salesData);
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return NextResponse.json(
      { error: "Unable to fetch sales data" },
      { status: 500 }
    );
  }
}
