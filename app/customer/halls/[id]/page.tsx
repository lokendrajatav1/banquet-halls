import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/db/client";
import { BookingForm } from "@/components/customer/booking-form";

type Props = {
  params: any; // may be a Promise or plain object depending on Next version/runtime
};

export default async function HallPage({ params }: Props) {
  const resolvedParams = await params;
  const rawId = resolvedParams?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  // Basic validation
  if (!id || typeof id !== "string") {
    console.warn("HallPage: missing or invalid id", { rawId });
    return notFound();
  }

  // Attempt to find by exact id first, then fall back to startsWith (handles truncated ids)
  let hall = null;
  try {
    hall = await prisma.banquetHall.findUnique({ where: { id } });
    if (!hall) {
      // fallback: match ids that start with the provided segment
      hall = await prisma.banquetHall.findFirst({ where: { id: { startsWith: id } } });
    }
  } catch (err) {
    console.error("HallPage: prisma error while fetching hall", err);
    return notFound();
  }

  if (!hall) {
    console.warn("HallPage: hall not found for id", id);
    return notFound();
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {hall.imageUrls && hall.imageUrls[0] ? (
            <div className="w-full h-96 relative rounded-lg overflow-hidden bg-muted">
              <Image src={hall.imageUrls[0]} alt={hall.name} fill className="object-cover" unoptimized />
            </div>
          ) : null}

          <h1 className="text-3xl font-bold">{hall.name}</h1>
          <p className="text-muted-foreground">{hall.description}</p>

          <div className="flex gap-4 pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Capacity</p>
              <p className="font-semibold">{hall.capacity} guests</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Base Price</p>
              <p className="font-semibold">${hall.basePrice}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-semibold">{hall.city}, {hall.state}</p>
            </div>
          </div>

          {hall.amenities && hall.amenities.length > 0 && (
            <div className="pt-6">
              <h3 className="text-lg font-semibold">Amenities</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {hall.amenities.map((a, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-muted text-sm">{a}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Book this hall</p>
            <p className="text-xl font-semibold pt-2">${hall.basePrice}</p>
            <div className="mt-4">
              <BookingForm hallId={hall.id} />
            </div>
          </div>

          <div className="p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="pt-2">{hall.address}</p>
            <p>{hall.city}, {hall.state} {hall.pinCode}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
