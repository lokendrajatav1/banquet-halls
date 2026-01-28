import { prisma } from "@/lib/db/client";
import { PaymentStatus } from "@prisma/client";

export interface InitiatePaymentInput {
  bookingId: string;
  amount: number;
}

export interface VerifyPaymentInput {
  paymentId: string;
  transactionId: string;
  status: PaymentStatus;
}

/**
 * Initiate a payment for a booking
 */
export async function initiatePayment(input: InitiatePaymentInput) {
  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Check if payment already exists
  const existingPayment = await prisma.payment.findUnique({
    where: { bookingId: input.bookingId },
  });

  if (existingPayment) {
    return existingPayment;
  }

  // Create payment record
  return prisma.payment.create({
    data: {
      bookingId: input.bookingId,
      customerId: booking.customerId,
      amount: input.amount,
      status: "INITIATED",
      paymentGatewayId: `MOCK_${Date.now()}`, // Mock payment gateway ID
    },
  });
}

/**
 * Verify payment (mock implementation)
 */
export async function verifyPayment(input: VerifyPaymentInput) {
  const payment = await prisma.payment.findUnique({
    where: { id: input.paymentId },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  // Update payment status
  const updatedPayment = await prisma.payment.update({
    where: { id: input.paymentId },
    data: {
      status: input.status,
      transactionId: input.transactionId,
    },
  });

  // If payment is completed, update booking status
  if (input.status === "COMPLETED") {
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        status: "PAYMENT_COMPLETED",
      },
    });
  }

  return updatedPayment;
}

/**
 * Generate invoice for a payment
 */
export async function generateInvoice(paymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: {
        include: {
          customer: true,
          hallBookings: {
            include: {
              hall: true,
            },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  // Generate invoice data (mock)
  const invoiceNumber = `INV-${Date.now()}`;

  // Update payment with invoice details
  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      invoiceNumber,
      invoiceUrl: `/invoices/${invoiceNumber}.pdf`, // Mock URL
    },
  });

  return updatedPayment;
}

/**
 * Get payment details
 */
export async function getPayment(paymentId: string) {
  return prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: {
        include: {
          customer: true,
          hallBookings: {
            include: {
              hall: true,
            },
          },
        },
      },
    },
  });
}
