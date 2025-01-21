import { fetchEvents } from "@/services/eventService"; // Assuming fetchEvents is defined
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Event } from "@/types";

export default async function EventsPage() {
  const events: Event[] = await fetchEvents(true); // Fetch events dynamically

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Featured Events Section */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold py-8 text-center">Live Events</h2>
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
      </div>
    </div>
  );
}
