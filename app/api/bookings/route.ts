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

    // Basic validation
    if (!eventType || !eventDate || !startTime || !endTime || !guestCount || !hallIds?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Parse eventDate
    const parsedEventDate = new Date(eventDate);
    if (isNaN(+parsedEventDate)) {
      return NextResponse.json({ error: "Invalid eventDate" }, { status: 400 });
    }

    // Helper to build datetime: if time contains 'T' or full ISO, use it; otherwise combine date + time
    const buildDateTime = (dateOnly: string | Date, timeOrIso: string) => {
      // If client sent an ISO datetime, rely on it
      if (typeof timeOrIso === "string" && timeOrIso.includes("T")) {
        const dt = new Date(timeOrIso);
        return isNaN(+dt) ? null : dt;
      }

      const dateStr = typeof dateOnly === "string" ? dateOnly : dateOnly.toISOString().split("T")[0];
      const combined = `${dateStr}T${timeOrIso}`;
      const dt = new Date(combined);
      return isNaN(+dt) ? null : dt;
    };

    const parsedStart = buildDateTime(eventDate, startTime);
    const parsedEnd = buildDateTime(eventDate, endTime);

    if (!parsedStart || !parsedEnd) {
      return NextResponse.json({ error: "Invalid startTime or endTime" }, { status: 400 });
    }

    if (parsedStart >= parsedEnd) {
      return NextResponse.json({ error: "startTime must be before endTime" }, { status: 400 });
    }

    // Create booking
    const booking = await createBooking({
      customerId: session.userId,
      eventType,
      eventDate: parsedEventDate,
      startTime: parsedStart,
      endTime: parsedEnd,
      guestCount: parseInt(String(guestCount), 10),
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
