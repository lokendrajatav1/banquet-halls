"use client";

import { Booking, BanquetHall, User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BOOKING_STATUS_LABELS, EVENT_TYPE_LABELS } from "@/lib/constants";
import Link from "next/link";
import { Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface BookingWithDetails extends Booking {
  customer: User;
  hallBookings: Array<{
    hall: BanquetHall;
  }>;
}

interface AdminBookingCardProps {
  booking: BookingWithDetails;
  adminRole: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CHANGE_REQUESTED: "bg-orange-100 text-orange-800",
  APPROVED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-red-100 text-red-800",
  PAYMENT_REQUESTED: "bg-purple-100 text-purple-800",
  PAYMENT_COMPLETED: "bg-green-100 text-green-800",
  CONFIRMED: "bg-green-100 text-green-800",
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "APPROVED":
    case "CONFIRMED":
    case "PAYMENT_COMPLETED":
      return <CheckCircle className="w-4 h-4" />;
    case "REJECTED":
      return <XCircle className="w-4 h-4" />;
    case "CHANGE_REQUESTED":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

export function AdminBookingCard({ booking, adminRole }: AdminBookingCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{booking.customer.firstName || booking.customer.email}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{booking.customer.email}</p>
          </div>
          <Badge
            className={`${STATUS_COLORS[booking.status] || "bg-gray-100"} flex items-center gap-1`}
          >
            {getStatusIcon(booking.status)}
            {BOOKING_STATUS_LABELS[booking.status as keyof typeof BOOKING_STATUS_LABELS] || booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground font-medium">Event Type</p>
            <p>{EVENT_TYPE_LABELS[booking.eventType as keyof typeof EVENT_TYPE_LABELS] || booking.eventType}</p>
          </div>
          <div>
            <p className="text-muted-foreground font-medium">Event Date</p>
            <p>{format(booking.eventDate, "MMM dd, yyyy")}</p>
          </div>
          <div>
            <p className="text-muted-foreground font-medium">Guest Count</p>
            <p>{booking.guestCount} guests</p>
          </div>
          <div>
            <p className="text-muted-foreground font-medium">Halls</p>
            <p>{booking.hallBookings.length} hall(s)</p>
          </div>
        </div>

        {booking.hallBookings.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Selected Halls</p>
            <div className="space-y-1">
              {booking.hallBookings.map((bh) => (
                <p key={bh.hall.id} className="text-sm">
                  • {bh.hall.name} ({bh.hall.capacity} capacity)
                </p>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm text-muted-foreground">
            Request Date: {format(booking.createdAt, "MMM dd, yyyy HH:mm")}
          </p>
        </div>

        <Link href={`/admin/bookings/${booking.id}`}>
          <Button className="w-full gap-2">
            <Eye className="w-4 h-4" />
            View Details & Take Action
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
