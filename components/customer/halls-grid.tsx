"use client";

import { BanquetHall } from "@prisma/client";
import { HallCard } from "./hall-card";

interface HallsGridProps {
  halls: BanquetHall[];
  onHallSelect?: (hallId: string) => void;
}

export function HallsGrid({ halls, onHallSelect }: HallsGridProps) {
  if (halls.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No halls found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {halls.map((hall) => (
        <HallCard key={hall.id} hall={hall} onSelect={onHallSelect} />
      ))}
    </div>
  );
}
