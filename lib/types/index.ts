import { UserRole, BookingStatus, EventType, PaymentStatus } from "@prisma/client";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface SessionData {
  userId: string;
  email: string;
  role: UserRole;
  expiresAt: number;
}

export interface BookingWithDetails {
  id: string;
  customerId: string;
  eventType: EventType;
  eventDate: Date;
  startTime: Date;
  endTime: Date;
  guestCount: number;
  status: BookingStatus;
  hallBookings: Array<{
    id: string;
    hall: {
      id: string;
      name: string;
      capacity: number;
      basePrice: number;
    };
    allocatedPrice: number;
  }>;
  payment?: {
    id: string;
    amount: number;
    status: PaymentStatus;
  };
  documents: Array<{
    id: string;
    documentType: string;
    fileUrl: string;
    isVerified: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface HallWithAvailability {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  basePrice: number;
  address: string;
  city: string;
  state: string;
  amenities: string[];
  imageUrls: string[];
  panoramicView?: string;
  isAvailable?: boolean;
}

export interface AdminStats {
  totalBookings: number;
  pendingApprovals: number;
  completedBookings: number;
  totalRevenue: number;
}
