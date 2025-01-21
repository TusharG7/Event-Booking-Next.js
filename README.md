# Event-Booking-Next.js
Event Ticketing System that allows users to view available events, purchase tickets by providing their contact details, and view their purchased tickets. The system enforce rules on ticket limits and generate QR codes for each ticket.

# Event Booking App Documentation

## Table of Contents
1. [Installation](#installation)
2. [Project Structure](#project-structure)
3. [Pages](#pages)
   - [Home Page (/home)](#home-page-home)
   - [Events Page (/events)](#events-page-events)
   - [Event Details Page (/events/{id})](#event-details-page-eventsid)
   - [Add Event Page (/events/add)](#add-event-page-eventsadd)
   - [My Tickets Page (/my-tickets)](#my-tickets-page-mytickets)
   - [Sales Page (/sales)](#sales-page-sales)
4. [API Endpoints](#api-endpoints)
5. [Middleware](#middleware)
6. [Utilities](#utilities)
7. [Types](#types)
8. [Configuration Files](#configuration-files)
9. [Environment Variables](#environment-variables)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd event-app
   
2. Install dependencies:
npm install

3. Set up environment variables:
Create a .env file in the root directory and add the following:
DB_URI="your_mongodb_connection_string"
DB_NAME="your_database_name"

4. npm run dev
5. Project Structure
.env
.gitignore
.next/
app/
components/
lib/
public/
services/
utils/
.eslint.config.mjs
.middleware.js
.next.config.ts
.package.json
.postcss.config.mjs
.tailwind.config.ts
.tsconfig.json
.types.ts

## Pages

### 1. Home Page (/home)
- **Path:** `page.tsx`
- **Description:** 
  Displays a hero section with a call to action to explore events and a list of featured live events.
- **Components Used:**
  - `Button` from `components/ui/button.tsx`
  - `Card`, `CardHeader`, `CardContent` from `card.tsx`
- **Data Fetching:** 
  Fetches events using the `fetchEvents` function from `services/eventService.ts`.

---

### 2. Events Page (/events)
- **Path:** `page.tsx`
- **Description:** 
  Displays a list of all live events with details such as date, location, available tickets, and price.
- **Components Used:**
  - `Button` from `components/ui/button.tsx`
  - `Card`, `CardHeader`, `CardContent` from `card.tsx`
- **Data Fetching:** 
  Fetches all events using the `fetchEvents` function from `services/eventService.ts`.

---

### 3. Event Details Page (/events/{id})
- **Path:** `page.tsx`
- **Description:** 
  Displays detailed information about a specific event, including the option to book tickets.
- **Components Used:**
  - `Skeleton` from `components/ui/skeleton.tsx`
  - `Card`, `CardHeader`, `CardContent`, `CardTitle` from `components/ui/card.tsx`
  - `Button` from `components/ui/button.tsx`
  - `Input` from `components/ui/input.tsx`
  - `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue` from `components/ui/select.tsx`
  - `Label` from `label.tsx`
- **Data Fetching:** 
  Fetches event details using the `fetchEventDetails` function from `services/eventService.ts`.

---

### 4. Add Event Page (/events/add)
- **Path:** `page.tsx`
- **Description:** 
  Provides a form to add a new event with fields for name, date, location, description, available tickets, max tickets per person, and price.
- **Validation:** 
  Uses `zod` for schema validation.
- **Components Used:**
  - `Input` from `components/ui/input.tsx`
  - `Button` from `button.tsx`
- **API Endpoint:** 
  Submits the form data to the `/api/events` endpoint.

---

### 5. My Tickets Page (/my-tickets)
- **Path:** `page.tsx`
- **Description:** 
  Displays a list of tickets booked by the user, with options to view QR codes for each ticket.
- **Components Used:**
  - `Button` from `button.tsx`
- **Data Fetching:** 
  Fetches user tickets using the `/api/tickets/user/{userId}` endpoint.

---

### 6. Sales Page (/sales)
- **Path:** `page.tsx`
- **Description:** 
  Displays a table of top ticket sales, including event name, tickets sold, and revenue.
- **Components Used:**
  - `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` from `table.tsx`
- **Data Fetching:** 
  Fetches sales data using the `/api/sales` endpoint.

---

## API Endpoints

- **GET /api/events:** 
  Fetches all events.
  
- **POST /api/events:** 
  Creates a new event.
  
- **GET /api/events/{id}:** 
  Fetches details of a specific event.
  
- **POST /api/tickets:** 
  Books tickets for an event.
  
- **GET /api/tickets/user/{userId}:** 
  Fetches tickets booked by a specific user.
  
- **GET /api/sales:** 
  Fetches sales data.

---

## Middleware

- **Path:** `middleware.js`
- **Description:** 
  Sets a `userId` cookie if not already present.

---

## Utilities

- **Database Connection:** 
  `db.ts`
  
- **QR Code Generation:** 
  `qr.ts`

---

## Types

- **Path:** `types.ts`
- **Description:** 
  Defines TypeScript types for `Event`, `NewEvent`, `Ticket`, and `NewTicket`.
