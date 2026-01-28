import { notFound } from "next/navigation";
import { getBooking } from "@/lib/services/booking.service";

type Props = { params: any };

export default async function BookingPage({ params }: Props) {
  const resolved = await params;
  const rawId = resolved?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id || typeof id !== "string") return notFound();

  const booking = await getBooking(id);
  if (!booking) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-4">Booking Confirmation</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded">
          <p className="text-sm text-muted-foreground">Booking ID</p>
          <p className="font-mono">{booking.id}</p>
        </div>

        <div className="p-4 border rounded">
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="font-semibold">{booking.status}</p>
        </div>

        <div className="p-4 border rounded">
          <p className="text-sm text-muted-foreground">Event</p>
          <p className="font-semibold">{booking.eventType} — {new Date(booking.eventDate).toLocaleDateString()}</p>
          <p className="text-sm">{new Date(booking.startTime).toLocaleTimeString()} — {new Date(booking.endTime).toLocaleTimeString()}</p>
        </div>

        <div className="p-4 border rounded">
          <p className="text-sm text-muted-foreground">Halls</p>
          <ul className="mt-2 space-y-2">
            {booking.hallBookings.map((hb) => (
              <li key={hb.id} className="p-2 border rounded">
                <p className="font-semibold">{hb.hall?.name}</p>
                <p className="text-sm text-muted-foreground">Allocated price: ${hb.allocatedPrice}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border rounded">
          <p className="text-sm text-muted-foreground">Customer</p>
          <p>{booking.customer?.firstName} {booking.customer?.lastName} — {booking.customer?.email}</p>
        </div>

        <div className="p-4 border rounded">
          <p className="text-sm text-muted-foreground">Notes</p>
          <p>{booking.notes || "—"}</p>
        </div>
      </div>
    </div>
  );
}
