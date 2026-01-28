import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth/crypto.ts";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.document.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.changeRequest.deleteMany();
  await prisma.bookingHall.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.hallAvailability.deleteMany();
  await prisma.banquetHall.deleteMany();
  await prisma.adminApproval.deleteMany();
  await prisma.user.deleteMany();

  console.log("📝 Creating users...");

  // Create admin users
  const superAdmin = await prisma.user.create({
    data: {
      email: "superadmin@banquet.com",
      username: "superadmin",
      passwordHash: await hashPassword("SuperAdmin@123"),
      firstName: "Super",
      lastName: "Admin",
      role: "SUPERADMIN",
    },
  });

  const admin1 = await prisma.user.create({
    data: {
      email: "admin1@banquet.com",
      username: "admin1",
      passwordHash: await hashPassword("Admin1@123"),
      firstName: "Admin",
      lastName: "One",
      role: "ADMIN1",
      createdByAdminId: superAdmin.id,
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      email: "admin2@banquet.com",
      username: "admin2",
      passwordHash: await hashPassword("Admin2@123"),
      firstName: "Admin",
      lastName: "Two",
      role: "ADMIN2",
      createdByAdminId: superAdmin.id,
    },
  });

  const admin3 = await prisma.user.create({
    data: {
      email: "admin3@banquet.com",
      username: "admin3",
      passwordHash: await hashPassword("Admin3@123"),
      firstName: "Admin",
      lastName: "Three",
      role: "ADMIN3",
      createdByAdminId: superAdmin.id,
    },
  });

  // Create customer users
  const customer1 = await prisma.user.create({
    data: {
      email: "customer@example.com",
      username: "customer1",
      passwordHash: await hashPassword("Customer@123"),
      firstName: "John",
      lastName: "Doe",
      phone: "+1 (555) 123-4567",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      pinCode: "10001",
      role: "CUSTOMER",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: "jane@example.com",
      username: "customer2",
      passwordHash: await hashPassword("Jane@123"),
      firstName: "Jane",
      lastName: "Smith",
      phone: "+1 (555) 987-6543",
      address: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      pinCode: "90001",
      role: "CUSTOMER",
    },
  });

  console.log("🏛️ Creating banquet halls...");

  const halls = await Promise.all([
    prisma.banquetHall.create({
      data: {
        name: "Grand Ballroom Elite",
        description: "Luxurious ballroom with stunning chandeliers and elegant marble flooring. Perfect for weddings and grand celebrations.",
        capacity: 1000,
        basePrice: 150000,
        address: "123 Park Avenue",
        city: "New York",
        state: "NY",
        pinCode: "10022",
        amenities: ["Parking", "Air Conditioning", "Stage", "Catering", "WiFi", "Sound System"],
        imageUrls: [
          "https://images.unsplash.com/photo-1519167758993-deeefb5b3daa?w=500&h=400&fit=crop",
        ],
        panoramicView: "https://example.com/360-ballroom-elite",
        isActive: true,
      },
    }),
    prisma.banquetHall.create({
      data: {
        name: "Heritage Palace",
        description: "Traditional palace-style venue with ornate architecture. Ideal for cultural events and traditional ceremonies.",
        capacity: 800,
        basePrice: 120000,
        address: "456 Heritage Lane",
        city: "Chicago",
        state: "IL",
        pinCode: "60611",
        amenities: ["Parking", "AC", "Catering", "Kitchen", "Garden", "Lighting"],
        imageUrls: [
          "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&h=400&fit=crop",
        ],
        isActive: true,
      },
    }),
    prisma.banquetHall.create({
      data: {
        name: "Modern City Hall",
        description: "Contemporary glass and steel venue with panoramic city views. Perfect for corporate events and modern celebrations.",
        capacity: 600,
        basePrice: 100000,
        address: "789 Downtown Plaza",
        city: "Los Angeles",
        state: "CA",
        pinCode: "90001",
        amenities: ["Parking", "WiFi", "Projector", "Sound System", "AC"],
        imageUrls: [
          "https://images.unsplash.com/photo-1510812431401-26ff5e6f8d67?w=500&h=400&fit=crop",
        ],
        isActive: true,
      },
    }),
    prisma.banquetHall.create({
      data: {
        name: "Garden Paradise",
        description: "Open-air garden venue with lush greenery and natural sunlight. Perfect for outdoor weddings and nature-inspired events.",
        capacity: 500,
        basePrice: 80000,
        address: "321 Green Road",
        city: "Houston",
        state: "TX",
        pinCode: "77001",
        amenities: ["Garden", "Lighting", "AC", "Catering", "Parking"],
        imageUrls: [
          "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&h=400&fit=crop",
        ],
        isActive: true,
      },
    }),
    prisma.banquetHall.create({
      data: {
        name: "Waterfront Venue",
        description: "Scenic waterfront location with stunning views. Ideal for receptions and celebrations with a scenic backdrop.",
        capacity: 400,
        basePrice: 90000,
        address: "654 Harbor Drive",
        city: "San Francisco",
        state: "CA",
        pinCode: "94105",
        amenities: ["Parking", "Catering", "AC", "Sound System", "Projector"],
        imageUrls: [
          "https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=500&h=400&fit=crop",
        ],
        isActive: true,
      },
    }),
  ]);

  console.log("📅 Creating hall availability...");

  // Create availability for next 90 days
  const today = new Date();
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    // Skip Mondays
    if (date.getDay() === 1) continue;

    for (const hall of halls) {
      const startTime = new Date(date);
      startTime.setHours(10, 0, 0, 0);

      const endTime = new Date(date);
      endTime.setHours(23, 59, 59, 0);

      await prisma.hallAvailability.create({
        data: {
          hallId: hall.id,
          date: date,
          startTime,
          endTime,
          isAvailable: true,
        },
      });
    }
  }

  console.log("✅ Seed completed successfully!");
  console.log("\n📊 Test Accounts:");
  console.log("────────────────────────────────────");
  console.log("SuperAdmin:");
  console.log("  Email: superadmin@banquet.com");
  console.log("  Password: SuperAdmin@123");
  console.log("\nAdmin1 (Verification):");
  console.log("  Email: admin1@banquet.com");
  console.log("  Password: Admin1@123");
  console.log("\nAdmin2 (Availability & Payment):");
  console.log("  Email: admin2@banquet.com");
  console.log("  Password: Admin2@123");
  console.log("\nAdmin3 (Final Approval):");
  console.log("  Email: admin3@banquet.com");
  console.log("  Password: Admin3@123");
  console.log("\nCustomer:");
  console.log("  Email: customer@example.com");
  console.log("  Password: Customer@123");
  console.log("────────────────────────────────────\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  });
