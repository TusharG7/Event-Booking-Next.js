"use client";

import { useEffect, useState } from "react";

const MyTicketsPage = ({ userId }: { userId: string }) => {
  const [tickets, setTickets] = useState<any[]>([]); // Replace 'any' with proper type if available
  const [events, setEvents] = useState<Map<string, any>>(new Map());
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null); // Store selected ticket for modal
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Fetch tickets associated with the userId
        const response = await fetch(`/api/tickets/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setTickets(data.tickets || []);
        } else {
          setError("Failed to fetch tickets.");
        }
      } catch (error) {
        setError("An error occurred while fetching your tickets.");
        console.error(error);
      }
    };

    fetchTickets();
  }, [userId]);

  const handleShowQR = (ticket: any) => {
    setSelectedTicket(ticket);
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Tickets</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <div>
          {tickets.map((ticket) => {
            return (
              <div
                key={ticket._id}
                className="mb-6 p-4 border border-gray-300 rounded-lg"
              >
                <h3 className="text-lg font-bold">{ticket.eventName}</h3>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(ticket.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Tickets:</strong> {ticket.tickets}
                </p>
                <div className="mt-4">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => handleShowQR(ticket)}
                  >
                    Show QR
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for showing QR and event details */}
      {selectedTicket && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 text-gray-700 rounded-lg w-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold">{selectedTicket.eventName}</h3>
            <p className="">{selectedTicket.eventDescription}</p>
            <div className="mt-4">
              <img
                src={selectedTicket.qr}
                alt="QR Code"
                className="w-full h-auto max-w-xs mx-auto"
              />
            </div>
            <p className="">Payment - {selectedTicket.paidAmount} Paid</p>
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
