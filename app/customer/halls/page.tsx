"use client";

import { useState, useEffect } from "react";
import { CustomerNavbar } from "@/components/customer/navbar";
import { HallsGrid } from "@/components/customer/halls-grid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BanquetHall } from "@prisma/client";
import { Search, Loader2 } from "lucide-react";

const CITIES = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
];

export default function HallsPage() {
  const [halls, setHalls] = useState<BanquetHall[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: "",
    capacity: "",
    date: "",
  });

  const fetchHalls = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.city) params.append("city", filters.city);
      if (filters.capacity) params.append("capacity", filters.capacity);
      if (filters.date) params.append("date", filters.date);

      const response = await fetch(`/api/halls?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch halls");

      const data = await response.json();
      setHalls(data);
    } catch (error) {
      console.error("Error fetching halls:", error);
      setHalls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHalls();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <>
      <CustomerNavbar />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Find Your Perfect Venue</h1>
            <p className="text-xl text-muted-foreground">
              Browse and book banquet halls for your special events
            </p>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">City</label>
                <Select value={filters.city} onValueChange={(value) => handleFilterChange("city", value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Guest Capacity</label>
                <Select value={filters.capacity} onValueChange={(value) => handleFilterChange("capacity", value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Minimum guests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50+</SelectItem>
                    <SelectItem value="100">100+</SelectItem>
                    <SelectItem value="200">200+</SelectItem>
                    <SelectItem value="500">500+</SelectItem>
                    <SelectItem value="1000">1000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Event Date</label>
                <Input
                  type="date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange("date", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="flex items-end">
                <Button onClick={fetchHalls} className="w-full gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>
            </div>
          </Card>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <HallsGrid halls={halls} />
          )}
        </div>
      </div>
    </>
  );
}
