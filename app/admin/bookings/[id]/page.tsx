"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminNavbar } from "@/components/admin/navbar";
import { BookingDetails } from "@/components/bookings/booking-details";
import { ApprovalActions } from "@/components/admin/approval-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
}

interface Booking {
  id: string;
  customer: any;
  status: string;
  eventType: string;
  eventDate: Date;
  startTime: Date;
  endTime: Date;
  guestCount: number;
  hallBookings: any[];
  documents?: any[];
  payment?: any;
  createdAt: Date;
  notes?: string;
}

export default function AdminBookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setUser({
          id: "1",
          email: "admin@example.com",
          role: "ADMIN1",
          firstName: "Admin",
        });

        if (!bookingId) return;

        const response = await fetch(`/api/bookings/${bookingId}`);
        if (!response.ok) {
          router.push("/admin/bookings");
          return;
        }

        const data = await response.json();
        setBooking(data);
      } catch (error) {
        console.error("Error fetching booking:", error);
        router.push("/admin/bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Booking not found</p>
      </div>
    );
  }

  return (
    <>
      <AdminNavbar user={user || undefined} />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex items-center gap-4">
            <Link href="/admin/bookings">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Bookings
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <BookingDetails booking={booking as any} />
            </div>

            {/* Sidebar Actions */}
            <div className="lg:col-span-1 space-y-6">
              <ApprovalActions
                bookingId={booking.id}
                currentStatus={booking.status}
                adminRole={user?.role || "ADMIN1"}
              />

              {/* Audit Trail */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Booking Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Booking ID</p>
                    <p className="font-mono text-sm">{booking.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Current Status</p>
                    <p className="font-semibold capitalize">{booking.status}</p>
                  </div>
                  {booking.notes && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Notes</p>
                      <p className="text-sm">{booking.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
