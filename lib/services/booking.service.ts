import { prisma } from "@/lib/db/client";
import { Booking, BookingStatus, EventType } from "@prisma/client";

export interface CreateBookingInput {
  customerId: string;
  eventType: EventType;
  eventDate: Date;
  startTime: Date;
  endTime: Date;
  guestCount: number;
  hallIds: string[];
}

export interface UpdateBookingInput {
  status?: BookingStatus;
  notes?: string;
}

/**
 * Create a new booking
 */
export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  // Check for overlapping bookings
  const overlappingBookings = await prisma.bookingHall.findMany({
    where: {
      hallId: {
        in: input.hallIds,
      },
      booking: {
        eventDate: input.eventDate,
        status: {
          in: ["APPROVED", "CONFIRMED", "PAYMENT_COMPLETED"],
        },
      },
    },
  });

  if (overlappingBookings.length > 0) {
    throw new Error("Selected hall(s) are not available for the requested date/time");
  }

  // Create booking with halls
  return prisma.booking.create({
    data: {
      customerId: input.customerId,
      eventType: input.eventType,
      eventDate: input.eventDate,
      startTime: input.startTime,
      endTime: input.endTime,
      guestCount: input.guestCount,
      status: "PENDING",
      hallBookings: {
        create: input.hallIds.map((hallId) => ({
          hallId,
          allocatedPrice: 0, // Will be set by admin
        })),
      },
    },
    include: {
      hallBookings: {
        include: {
          hall: true,
        },
      },
    },
  });
}

/**
 * Get booking by ID
 */
export async function getBooking(bookingId: string) {
  return prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          address: true,
          city: true,
          state: true,
          pinCode: true,
        },
      },
      hallBookings: {
        include: {
          hall: true,
        },
      },
      payment: true,
      documents: true,
      auditLogs: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

/**
 * Get bookings for customer
 */
export async function getCustomerBookings(customerId: string) {
  return prisma.booking.findMany({
    where: { customerId },
    include: {
      hallBookings: {
        include: {
          hall: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Get pending bookings for admin (based on approval level)
 */
export async function getPendingBookings(adminLevel: "ADMIN1" | "ADMIN2" | "ADMIN3") {
  let statusFilter: BookingStatus[] = [];

  if (adminLevel === "ADMIN1") {
    statusFilter = ["PENDING"];
  } else if (adminLevel === "ADMIN2") {
    statusFilter = ["APPROVED"];
  } else if (adminLevel === "ADMIN3") {
    statusFilter = ["PAYMENT_COMPLETED"];
  }

  return prisma.booking.findMany({
    where: {
      status: {
        in: statusFilter,
      },
    },
    include: {
      customer: true,
      hallBookings: {
        include: {
          hall: true,
        },
      },
      documents: true,
      payment: true,
      auditLogs: {
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

/**
 * Request changes to a booking
 */
export async function requestChanges(bookingId: string, reason: string) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "CHANGE_REQUESTED",
      changeRequests: {
        create: {
          reason,
          requestedChanges: {},
        },
      },
    },
  });
}

/**
 * Approve booking at a level
 */
export async function approveBooking(bookingId: string, nextStatus: BookingStatus) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: nextStatus,
    },
  });
}

/**
 * Reject booking
 */
export async function rejectBooking(bookingId: string) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "REJECTED",
    },
  });
}
