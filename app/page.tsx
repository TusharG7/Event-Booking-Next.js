import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { fetchEvents } from "@/services/eventService";
import { Event } from "@/types";

export default async function Home() {
  const events: Event[] = await fetchEvents(); // Fetch events dynamically

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
          Discover Amazing Events
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Book tickets for the most exciting concerts, conferences, and
          festivals happening near you.
        </p>
        <Link href="/events">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Explore Events
          </Button>
        </Link>
      </div>

      {/* Featured Events Section */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold mb-8 text-center">Live Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <Card
              key={i}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <h3 className="text-xl font-semibold">{event.name}</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    📅 {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">📍 {event.location}</p>
                  <p className="text-gray-600">
                    🎟️ {event.availableTickets} tickets available
                  </p>
                  <p className="text-lg font-semibold text-blue-600">
                    ${event.price}
                  </p>
                  <Link
                    href={
                      event.availableTickets > 0 ? `/events/${event._id}` : "#"
                    }
                  >
                    <Button
                      className="w-full mt-2"
                      disabled={event.availableTickets === 0}
                    >
                      {event.availableTickets > 0 ? "View Details" : "Sold Out"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link href="/events">
            <Button variant="outline" size="lg" className="hover:bg-blue-50">
              View All Events →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
