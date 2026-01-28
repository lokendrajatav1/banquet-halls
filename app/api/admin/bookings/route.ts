import { NextRequest, NextResponse } from "next/server";
import { requireAdminLevel } from "@/lib/middleware/auth";
import { getPendingBookings } from "@/lib/services/booking.service";
import { prisma } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdminLevel("ADMIN1");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Admin1 gets PENDING bookings
    // Admin2 gets APPROVED bookings
    // Admin3 gets PAYMENT_COMPLETED bookings
    let statusFilter: string[] = [];

    if (session.role === "ADMIN1") {
      statusFilter = ["PENDING"];
    } else if (session.role === "ADMIN2") {
      statusFilter = ["APPROVED"];
    } else if (session.role === "ADMIN3") {
      statusFilter = ["PAYMENT_COMPLETED"];
    }

    const bookings = await prisma.booking.findMany({
      where: {
        status: {
          in: statusFilter as any,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        hallBookings: {
          include: {
            hall: true,
          },
        },
        payment: true,
        documents: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Fetch admin bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
