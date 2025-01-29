import { ObjectId } from "mongodb";

export type Event = {
    _id?: ObjectId | string; // MongoDB ObjectId string
    name: string;
    date: string;
    location: string;
    description: string;
    availableTickets: number;
    maxPerPerson:number;
    price: number;
  };
  
  export type NewEvent = {
    name: string;
    date: string;
    location: string;
    description: string;
    availableTickets: number;
    maxPerPerson:number;
    price: number;
  };

  export type UsersTicket = {
    id: string;
    eventName: string;
    date: string;
    location: string;
    tickets: number;
    paidAmount: number;
    qr: string; // Add the qr field
  };
  
  export type Ticket = {
    _id: ObjectId | string; // MongoDB ObjectId string
    eventId: ObjectId | string; // Reference to Event id
    email: string;
    quantity: number;
    userId: string;
  };

  export type NewTicket = {
    eventId: ObjectId | string; // Reference to Event id
    email: string;
    quantity: number;
    userId: string;
  };
  