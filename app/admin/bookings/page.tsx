"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "@/components/admin/navbar";
import { AdminBookingCard } from "@/components/admin/booking-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Filter } from "lucide-react";
import { BOOKING_STATUS } from "@/lib/constants";

interface Booking {
  id: string;
  customer: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  status: string;
  eventDate: string;
  eventType: string;
  guestCount: number;
  createdAt: string;
  hallBookings: Array<{
    hall: {
      id: string;
      name: string;
      capacity: number;
    };
  }>;
}

interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get session and bookings
        setUser({
          id: "1",
          email: "admin@example.com",
          role: "ADMIN1",
          firstName: "Admin",
        });

        const bookingsResponse = await fetch("/api/admin/bookings");
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData);
          setFilteredBookings(bookingsData);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    if (status === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === status));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminNavbar user={user || undefined} />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Booking Requests</h1>
              <p className="text-muted-foreground mt-2">Review and approve pending booking requests</p>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Export
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-8">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Filter by Status:</span>
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bookings</SelectItem>
                  <SelectItem value={BOOKING_STATUS.PENDING}>Pending</SelectItem>
                  <SelectItem value={BOOKING_STATUS.CHANGE_REQUESTED}>Change Requested</SelectItem>
                  <SelectItem value={BOOKING_STATUS.APPROVED}>Approved</SelectItem>
                  <SelectItem value={BOOKING_STATUS.REJECTED}>Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No bookings found</p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredBookings.map((booking) => (
                <AdminBookingCard
                  key={booking.id}
                  booking={{
                    ...booking,
                    eventDate: new Date(booking.eventDate),
                    createdAt: new Date(booking.createdAt),
                  } as any}
                  adminRole={user?.role || "ADMIN1"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
