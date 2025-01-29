"use client";
import { useEffect, useState } from "react";
import { UsersTicket } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { z } from "zod";

const emailSchema = z.string().email();

const MyTicketsPage = () => {
  const [email, setEmail] = useState<string>("");
  const [tickets, setTickets] = useState<UsersTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<UsersTicket | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [emailSubmitted, setEmailSubmitted] = useState<boolean>(false);

  const fetchTickets = async (): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/tickets/user/${email}`);
      if (response.ok) {
        const data: { tickets: UsersTicket[] } = await response.json();
        setTickets(data.tickets || []);
        setEmailSubmitted(true);
      } else {
        const data: { error: string } = await response.json();
        setError(data.error || "Failed to fetch tickets.");
      }
    } catch (error) {
      setError("An error occurred while fetching your tickets.");
    } finally {
      setLoading(false);
    }
  };
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSchema.safeParse(email).success) {
      setError("Invalid email format.");
      return;
    }
    fetchTickets();
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
  };

  if (!emailSubmitted) {
    return (
      <div className="my-10 p-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Enter Your Email</h1>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            Submit
          </Button>
        </form>
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="my-auto py-10">
        <p className="text-center text-gray-500">No tickets found.</p>
        <div className="text-center mt-4">
          <Link href="/events">
            <p className="text-blue-600 hover:underline">
              Check out events and book one now
            </p>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Tickets</h1>
      <div className="space-y-4">
        {tickets.map((ticket, i) => (
          <Card key={i} className="shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-blue-600 text-white p-4">
              <CardTitle className="text-xl font-semibold">
                {ticket.eventName}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-700 mb-2">
                <strong>Date:</strong>{" "}
                {new Date(ticket.date).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Location:</strong> {ticket.location}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Tickets:</strong> {ticket.tickets}
              </p>
              <Button
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                onClick={() => setSelectedTicket(ticket)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Ticket Details</h2>
            <p className="text-gray-700 mb-2">
              <strong>Event:</strong> {selectedTicket.eventName}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Date:</strong>{" "}
              {new Date(selectedTicket.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Location:</strong> {selectedTicket.location}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Tickets:</strong> {selectedTicket.tickets}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Payment:</strong> ${selectedTicket.paidAmount} Paid
            </p>
            <div className="flex justify-center my-4">
              <img
                src={selectedTicket.qr}
                alt="QR Code"
                className="w-full h-auto max-w-xs mx-auto"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
