"use client";

import { Booking, BanquetHall, User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BOOKING_STATUS_LABELS, EVENT_TYPE_LABELS } from "@/lib/constants";
import { format } from "date-fns";
import { MapPin, Users, Calendar, DollarSign, FileText } from "lucide-react";

interface BookingDetailsProps {
  booking: Booking & {
    customer: User;
    hallBookings: Array<{
      hall: BanquetHall;
      allocatedPrice: number;
    }>;
    documents?: Array<{
      id: string;
      documentType: string;
      fileUrl: string;
      isVerified: boolean;
    }>;
    payment?: {
      amount: number;
      status: string;
    };
  };
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

export function BookingDetails({ booking }: BookingDetailsProps) {
  const totalPrice = booking.hallBookings.reduce((sum, bh) => sum + bh.allocatedPrice, 0);

  return (
    <div className="space-y-6">
      {/* Status & Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Booking #{booking.id.slice(0, 8).toUpperCase()}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {format(booking.createdAt, "MMMM dd, yyyy HH:mm")}
              </p>
            </div>
            <Badge className={`${STATUS_COLORS[booking.status] || "bg-gray-100"}`}>
              {BOOKING_STATUS_LABELS[booking.status as keyof typeof BOOKING_STATUS_LABELS]}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Event Details */}
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Event Type</p>
              <p className="text-lg">
                {EVENT_TYPE_LABELS[booking.eventType as keyof typeof EVENT_TYPE_LABELS]}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Guest Count</p>
              <div className="flex items-center gap-2 text-lg">
                <Users className="w-4 h-4" />
                {booking.guestCount} guests
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Event Date</p>
              <div className="flex items-center gap-2 text-lg">
                <Calendar className="w-4 h-4" />
                {format(booking.eventDate, "MMM dd, yyyy")}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Time Slot</p>
              <p className="text-lg">
                {format(booking.startTime, "HH:mm")} - {format(booking.endTime, "HH:mm")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Halls */}
      <Card>
        <CardHeader>
          <CardTitle>Selected Halls ({booking.hallBookings.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {booking.hallBookings.map((bh) => (
            <div
              key={bh.hall.id}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{bh.hall.name}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {bh.hall.city}, {bh.hall.state}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Up to {bh.hall.capacity} guests
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Allocated Price</p>
                  <p className="text-lg font-semibold">₹{bh.allocatedPrice.toLocaleString()}</p>
                </div>
              </div>

              {bh.hall.amenities && bh.hall.amenities.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-1">
                    {bh.hall.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Total Price */}
          <div className="border-t pt-4 flex items-center justify-between">
            <span className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Total Price
            </span>
            <span className="text-2xl font-bold">₹{totalPrice.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p>{booking.customer.firstName} {booking.customer.lastName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{booking.customer.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p>{booking.customer.phone || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p>{booking.customer.address || "Not provided"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      {booking.documents && booking.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Uploaded Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {booking.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="border rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{doc.documentType}</p>
                    <p className="text-xs text-muted-foreground mt-1">{doc.isVerified ? "✓ Verified" : "Pending verification"}</p>
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Status */}
      {booking.payment && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Amount</p>
                <p className="text-lg font-semibold">₹{booking.payment.amount.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge>{booking.payment.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
