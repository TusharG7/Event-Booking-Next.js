import { connectToDB } from "@/utils/db";
import { Event } from "@/types";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";


export const fetchEvents = async (all?:boolean): Promise<Event[]> => {
  try {
    const db = await connectToDB();
    let events;
    if(all) {
        events = await db.collection("events").find().toArray();
    } else {
        events = await db.collection("events").find().limit(3).toArray();
    }
    return events.map((event) => ({
      _id: event._id.toString(), // Convert ObjectId to string
      name: event.name,
      date: event.date,
      location: event.location,
      description: event.description,
      maxPerPerson: event.maxPerPerson,
      availableTickets: event.availableTickets,
      price: event.price,
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const fetchEventDetails = async (id: string) => {
  try {
    if (!ObjectId.isValid(id)) {
          return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
        }
    
        // Connect to the database
        const db = await connectToDB();
        const eventsCollection = db.collection("events");
    
        // Find the event by its ID
        const event = await eventsCollection.findOne({ _id: new ObjectId(id) });

    return event;
  } catch (error) {
    console.error("Error fetching event details:", error);
    throw error;
  }
};

