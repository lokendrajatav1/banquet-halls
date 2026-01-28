import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { createBooking, getCustomerBookings } from "@/lib/services/booking.service";
import { prisma } from "@/lib/db/client";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      eventType,
      eventDate,
      startTime,
      endTime,
      guestCount,
      hallIds,
    } = body;

    // Validation
    if (!eventType || !eventDate || !startTime || !endTime || !guestCount || !hallIds?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await createBooking({
      customerId: session.userId,
      eventType,
      eventDate: new Date(eventDate),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      guestCount: parseInt(guestCount),
      hallIds,
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        bookingId: booking.id,
        action: "BOOKING_CREATED",
        description: "Customer created a new booking",
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get customer bookings
    const bookings = await getCustomerBookings(session.userId);

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
