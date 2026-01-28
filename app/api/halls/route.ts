import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get("city");
    const capacity = searchParams.get("capacity");
    const date = searchParams.get("date");

    // Build where clause for filtering
    const where: any = { isActive: true };

    if (city) {
      where.city = {
        contains: city,
        mode: "insensitive",
      };
    }

    if (capacity) {
      where.capacity = {
        gte: parseInt(capacity),
      };
    }

    // Get halls
    let halls = await prisma.banquetHall.findMany({
      where,
      include: {
        availability: date
          ? {
              where: {
                date: {
                  gte: new Date(date),
                  lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
                },
                isAvailable: true,
              },
            }
          : false,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(halls, { status: 200 });
  } catch (error) {
    console.error("Fetch halls error:", error);
    return NextResponse.json(
      { error: "Failed to fetch halls" },
      { status: 500 }
    );
  }
}
