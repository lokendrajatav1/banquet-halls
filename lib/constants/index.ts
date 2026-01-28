export const USER_ROLES = {
  CUSTOMER: "CUSTOMER",
  ADMIN1: "ADMIN1",
  ADMIN2: "ADMIN2",
  ADMIN3: "ADMIN3",
  SUPERADMIN: "SUPERADMIN",
} as const;

export const ADMIN_ROLES = [USER_ROLES.ADMIN1, USER_ROLES.ADMIN2, USER_ROLES.ADMIN3, USER_ROLES.SUPERADMIN];

export const BOOKING_STATUS = {
  PENDING: "PENDING",
  CHANGE_REQUESTED: "CHANGE_REQUESTED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PAYMENT_REQUESTED: "PAYMENT_REQUESTED",
  PAYMENT_COMPLETED: "PAYMENT_COMPLETED",
  CONFIRMED: "CONFIRMED",
} as const;

export const BOOKING_STATUS_LABELS = {
  PENDING: "Pending",
  CHANGE_REQUESTED: "Changes Requested",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PAYMENT_REQUESTED: "Payment Requested",
  PAYMENT_COMPLETED: "Payment Completed",
  CONFIRMED: "Confirmed",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  INITIATED: "INITIATED",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export const EVENT_TYPES = {
  WEDDING: "WEDDING",
  CORPORATE_EVENT: "CORPORATE_EVENT",
  BIRTHDAY: "BIRTHDAY",
  ANNIVERSARY: "ANNIVERSARY",
  CONFERENCE: "CONFERENCE",
  CONCERT: "CONCERT",
  OTHER: "OTHER",
} as const;

export const EVENT_TYPE_LABELS = {
  WEDDING: "Wedding",
  CORPORATE_EVENT: "Corporate Event",
  BIRTHDAY: "Birthday Party",
  ANNIVERSARY: "Anniversary",
  CONFERENCE: "Conference",
  CONCERT: "Concert",
  OTHER: "Other",
} as const;

export const AMENITIES = [
  "Parking",
  "Air Conditioning",
  "Stage",
  "Catering",
  "WiFi",
  "Sound System",
  "Projector",
  "Kitchen",
  "Garden",
  "Lighting",
] as const;

// Admin role hierarchy
export const ADMIN_ROLE_HIERARCHY = {
  SUPERADMIN: { canCreate: [USER_ROLES.ADMIN1, USER_ROLES.ADMIN2] },
  ADMIN2: { canCreate: [USER_ROLES.ADMIN1] },
  ADMIN1: { canCreate: [] },
} as const;

// Approval levels
export const APPROVAL_WORKFLOW = {
  LEVEL_1: {
    role: USER_ROLES.ADMIN1,
    description: "Initial verification & document check",
  },
  LEVEL_2: {
    role: USER_ROLES.ADMIN2,
    description: "Availability check & payment request",
  },
  LEVEL_3: {
    role: USER_ROLES.ADMIN3,
    description: "Final approval & confirmation",
  },
} as const;

// Session configuration
export const SESSION_CONFIG = {
  expiryTime: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  cookieName: "banquet_session",
  maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
} as const;

// Routes
export const ROUTES = {
  HOME: "/",
  CUSTOMER_HOME: "/customer",
  CUSTOMER_HALLS: "/customer/halls",
  CUSTOMER_BOOKING: "/customer/booking",
  CUSTOMER_DASHBOARD: "/customer/dashboard",
  ADMIN_HOME: "/admin",
  ADMIN_BOOKINGS: "/admin/bookings",
  ADMIN_HALLS: "/admin/halls",
  ADMIN_USERS: "/admin/users",
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
} as const;
