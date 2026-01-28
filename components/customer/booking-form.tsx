"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  hallId: string;
}

const EVENT_TYPES = [
  "WEDDING",
  "CORPORATE_EVENT",
  "BIRTHDAY",
  "ANNIVERSARY",
  "CONFERENCE",
  "CONCERT",
  "OTHER",
];

export function BookingForm({ hallId }: Props) {
  const [eventType, setEventType] = useState<string>(EVENT_TYPES[0]);
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guestCount, setGuestCount] = useState<number>(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/status");
        if (!mounted) return;
        if (res.ok) setIsAuth(true);
        else setIsAuth(false);
      } catch {
        if (mounted) setIsAuth(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // client-side validation
      if (!eventDate) throw new Error("Please select an event date");
      if (!startTime || !endTime) throw new Error("Please select start and end times");
      if (guestCount <= 0) throw new Error("Guest count must be greater than zero");
      const start = new Date(`${eventDate}T${startTime}`);
      const end = new Date(`${eventDate}T${endTime}`);
      if (isNaN(+start) || isNaN(+end)) throw new Error("Invalid date or time");
      if (start >= end) throw new Error("Start time must be before end time");

      if (isAuth === false) {
        // redirect to login preserving return url
        router.push(`/auth/login?next=/customer/halls/${hallId}`);
        return;
      }
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          eventDate,
          startTime,
          endTime,
          guestCount,
          hallIds: [hallId],
        }),
      });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to create booking");

        setSuccess("Booking created — pending approval.");
        // Use Next router for navigation
        setTimeout(() => router.push(`/customer/bookings/${data.id}`), 900);
    } catch (err: any) {
      setError(err.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm">Event Type</label>
        <Select value={eventType} onValueChange={(v) => setEventType(v)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EVENT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t.replaceAll("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm">Event Date</label>
        <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="mt-2" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm">Start Time</label>
          <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-2" />
        </div>
        <div>
          <label className="text-sm">End Time</label>
          <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-2" />
        </div>
      </div>

      <div>
        <label className="text-sm">Guest Count</label>
        <Input type="number" value={guestCount} onChange={(e) => setGuestCount(parseInt(e.target.value || "0"))} className="mt-2" />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>{loading ? "Booking..." : "Create Booking"}</Button>
      </div>
    </form>
  );
}
