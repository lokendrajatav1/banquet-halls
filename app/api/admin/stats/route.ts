import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware/auth";
import { prisma } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const totalBookings = await prisma.booking.count();
    const pendingApprovals = await prisma.booking.count({
      where: { status: "PENDING" },
    });
    const approvedBookings = await prisma.booking.count({
      where: { status: "APPROVED" },
    });
    const rejectedBookings = await prisma.booking.count({
      where: { status: "REJECTED" },
    });

    return NextResponse.json(
      {
        totalBookings,
        pendingApprovals,
        approvedBookings,
        rejectedBookings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
