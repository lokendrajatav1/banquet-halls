import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { verifyPayment } from "@/lib/services/payment.service";
import { prisma } from "@/lib/db/client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { transactionId, status } = body;

    if (!transactionId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify payment belongs to user
    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment || payment.customerId !== session.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Verify payment
    const verifiedPayment = await verifyPayment({
      paymentId: id,
      transactionId,
      status: status as any,
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        bookingId: payment.bookingId,
        action: "BOOKING_CREATED",
        description: `Payment verified with status: ${status}`,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      },
    });

    return NextResponse.json(verifiedPayment, { status: 200 });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
