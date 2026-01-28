"use client";

import { BanquetHall } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, DollarSign } from "lucide-react";

interface HallCardProps {
  hall: BanquetHall;
  onSelect?: (hallId: string) => void;
}

export function HallCard({ hall, onSelect }: HallCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {hall.imageUrls && hall.imageUrls[0] && (
        <div className="relative w-full h-48 bg-muted">
          <Image
            src={hall.imageUrls[0] || "/placeholder.svg"}
            alt={hall.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-1">{hall.name}</CardTitle>
        <CardDescription className="flex items-center gap-1 mt-1">
          <MapPin className="w-4 h-4" />
          {hall.city}, {hall.state}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{hall.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Up to {hall.capacity} guests</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold">${hall.basePrice}</span>
          </div>
        </div>

        {hall.amenities && hall.amenities.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Amenities</p>
            <div className="flex flex-wrap gap-1">
              {hall.amenities.slice(0, 3).map((amenity, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {hall.amenities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{hall.amenities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Link href={`/customer/halls/${hall.id}`} className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              View Details
            </Button>
          </Link>
          {onSelect && (
            <Button onClick={() => onSelect(hall.id)} className="flex-1">
              Select
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
