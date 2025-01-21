"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface Sale {
  eventName: string;
  ticketsSold: number;
  revenue: number;
}

const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 bg-gray-300 rounded animate-pulse w-1/4"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2"></div>
    </TableCell>
  </TableRow>
);

const SalesPage = () => {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("/api/sales");
        if (response.ok) {
          const data: Sale[] = await response.json();
          setSalesData(data);
        } else {
          console.error("Failed to fetch sales data");
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Top Ticket Sales</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="font-bold">Event Name</TableCell>
            <TableCell className="font-bold">Tickets Sold</TableCell>
            <TableCell className="font-bold">Revenue</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            : salesData.map((sale, i) => (
                <TableRow key={i}>
                  <TableCell>{sale.eventName}</TableCell>
                  <TableCell>{sale.ticketsSold}</TableCell>
                  <TableCell>${sale.revenue.toFixed(2)}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      {!loading && salesData.length === 0 && (
        <p className="text-center mt-4">No sales data available</p>
      )}
    </div>
  );
};

export default SalesPage;
