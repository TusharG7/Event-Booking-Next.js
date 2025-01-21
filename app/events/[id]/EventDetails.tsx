"use client";

import { useEffect, useState } from "react";
import { Event } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const EventDetailsPage = ({ id, userId }: { id: string; userId: string }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [tickets, setTickets] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        } else {
          console.error("Failed to fetch event details");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (event) {
      setTotalPrice(tickets * event.price);
    }
  }, [tickets, event]);

  const handlePayAndBook = async () => {
    if (!email || tickets < 1 || !event || !paymentMethod) {
      setError("Please fill all fields correctly.");
      return;
    }

    if (tickets > event.maxPerPerson || tickets > event.availableTickets) {
      setError(
        "Ticket quantity exceeds the maximum allowed or available tickets."
      );
      return;
    }

    if (!userId) {
      setError("User not authenticated. Please log in.");
      return;
    }

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: id,
          email,
          tickets,
          paymentMethod,
          paidAmount: totalPrice,
          userId,
        }),
      });

      if (response.ok) {
        alert("Tickets booked and payment successful!");
        setIsModalOpen(false);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to book tickets.");
      }
    } catch (error) {
      console.error("Error booking tickets:", error);
      setError("An unexpected error occurred.");
    }
  };

  if (loading) {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!event) {
    return <p className="text-center text-red-500">Event not found</p>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{event.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="mb-2">
            <strong>Location:</strong> {event.location}
          </p>
          <p className="mb-2">
            <strong>Description:</strong> {event.description}
          </p>
          <p className="mb-2">
            <strong>Available Tickets:</strong> {event.availableTickets}
          </p>
          <p className="mb-2">
            <strong>Price:</strong> ${event.price}
          </p>
          <Button onClick={() => setIsModalOpen(true)}>Book Tickets</Button>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Book Tickets</h2>
            <p className="text-sm text-gray-600 mb-4">
              Fill in the details below to book your tickets.
            </p>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="space-y-4">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />

              <Label>Number of Tickets</Label>
              <Input
                type="number"
                value={tickets}
                onChange={(e) => setTickets(Number(e.target.value))}
                min="1"
              />

              <Label>Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creditCard">Credit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bankTransfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>

              <p>
                <strong>Total Price:</strong> ${totalPrice}
              </p>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handlePayAndBook}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Pay & Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;
