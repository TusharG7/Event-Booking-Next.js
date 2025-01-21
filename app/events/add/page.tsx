"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  availableTickets: z.number().min(1, "Must have at least 1 ticket available"),
  maxPerPerson: z
    .number()
    .min(1, "Maximum tickets per person must be 1 or more"),
  price: z.number().nonnegative("Price must be 0 or more"),
});

const AddEventPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    availableTickets: 0,
    maxPerPerson: 1,
    price: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "availableTickets" ||
        name === "maxPerPerson" ||
        name === "price"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate with Zod
    const validationResult = eventSchema.safeParse(form);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach((error) => {
        if (error.path[0]) fieldErrors[error.path[0] as string] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      console.log("validationResult - ", validationResult);
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      if (res.ok) {
        setForm({
          name: "",
          date: "",
          location: "",
          description: "",
          availableTickets: 0,
          maxPerPerson: 1,
          price: 0,
        });
        setErrors({});
        alert("Event added successfully!");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to add event");
      }
    } catch (error) {
      console.error("Error submitting event:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1" htmlFor="name">
            Event Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded text-white bg-slate-700"
            placeholder="Enter event name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block font-medium mb-1" htmlFor="date">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={form.date}
            min={
              new Date(new Date().setDate(new Date().getDate() + 1))
                .toISOString()
                .split("T")[0]
            }
            onChange={handleChange}
            className="w-full p-2 border rounded text-white bg-slate-700"
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium mb-1" htmlFor="location">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-2 border rounded text-white bg-slate-700"
            placeholder="Enter event location"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded text-white bg-slate-700"
            placeholder="Enter event description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Available Tickets */}
        <div>
          <label className="block font-medium mb-1" htmlFor="availableTickets">
            Available Tickets
          </label>
          <input
            type="number"
            id="availableTickets"
            name="availableTickets"
            value={form.availableTickets}
            onChange={handleChange}
            className="w-full p-2 border rounded text-white bg-slate-700"
            placeholder="Enter number of tickets"
          />
          {errors.availableTickets && (
            <p className="text-red-500 text-sm">{errors.availableTickets}</p>
          )}
        </div>

        {/* Max Per Person */}
        <div>
          <label className="block font-medium mb-1" htmlFor="maxPerPerson">
            Max Tickets Per Person
          </label>
          <input
            type="number"
            id="maxPerPerson"
            name="maxPerPerson"
            value={form.maxPerPerson}
            onChange={handleChange}
            className="w-full p-2 border rounded text-white bg-slate-700"
            placeholder="Enter max tickets per person"
          />
          {errors.maxPerPerson && (
            <p className="text-red-500 text-sm">{errors.maxPerPerson}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium mb-1" htmlFor="price">
            Price (in $)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 border rounded text-white bg-slate-700"
            placeholder="Enter price per ticket"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Event
        </button>
      </form>
    </div>
  );
};

export default AddEventPage;
