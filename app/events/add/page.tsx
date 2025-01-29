"use client";
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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setErrors({});

    try {
      eventSchema.parse(form);

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert("Event added successfully!");
        setForm({
          name: "",
          date: "",
          location: "",
          description: "",
          availableTickets: 0,
          maxPerPerson: 1,
          price: 0,
        });
      } else {
        const data = await response.json();
        setErrors({ form: data.error || "Failed to add event." });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ form: "An unexpected error occurred." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Available Tickets
          </label>
          <input
            type="number"
            name="availableTickets"
            value={form.availableTickets}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
          {errors.availableTickets && (
            <p className="text-red-500 text-sm">{errors.availableTickets}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Max Tickets Per Person
          </label>
          <input
            type="number"
            name="maxPerPerson"
            value={form.maxPerPerson}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
          {errors.maxPerPerson && (
            <p className="text-red-500 text-sm">{errors.maxPerPerson}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}
        </div>
        {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? "Adding Event..." : "Add Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEventPage;
