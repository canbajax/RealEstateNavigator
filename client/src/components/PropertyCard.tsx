import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Ruler, 
  Bed, 
  Bath, 
  Car, 
  Heart,
  DoorOpen
} from "lucide-react";
import { type Listing } from "@shared/schema";

interface PropertyCardProps {
  listing: Listing;
}

const PropertyCard = ({ listing }: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR').format(price);
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Bugün";
    } else if (diffDays === 1) {
      return "Dün";
    } else if (diffDays < 7) {
      return `${diffDays} gün önce`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} hafta önce`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} ay önce`;
    }
  };

  return (
    <Card className="property-card overflow-hidden transition-transform duration-300 hover:shadow-lg">
      <Link href={`/listings/${listing.id}`}>
        <a className="block">
          <div className="relative">
            <img 
              src={listing.imageUrls[0]} 
              alt={listing.title} 
              className="w-full h-56 object-cover"
            />
            <div className="absolute top-0 left-0 m-4">
              <Badge className={`${listing.listingType === 'sell' ? 'bg-[#2C3E50]' : 'bg-[#3498DB]'} text-white rounded`}>
                {listing.listingType === 'sell' ? 'Satılık' : 'Kiralık'}
              </Badge>
            </div>
            <div className="absolute top-0 right-0 m-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white rounded-full p-2 text-[#7F8C8D] hover:text-[#E74C3C] transition"
                onClick={toggleFavorite}
              >
                <Heart className={isFavorite ? "fill-[#E74C3C] text-[#E74C3C]" : ""} size={16} />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg text-[#2C3E50] line-clamp-1">{listing.title}</h3>
              <p className="font-bold text-[#E74C3C]">
                {listing.listingType === 'sell' 
                  ? `₺${formatPrice(listing.price)}` 
                  : `₺${formatPrice(listing.price)}/${listing.rentPeriod === 'monthly' ? 'ay' : 'gün'}`
                }
              </p>
            </div>
            <p className="text-[#7F8C8D] text-sm mt-2 flex items-center">
              <MapPin className="text-[#3498DB] mr-2" size={16} />
              <span>{listing.neighborhood && `${listing.neighborhood}, `}{listing.district}, {listing.cityId}</span>
            </p>
            
            <div className="flex justify-between mt-4 text-sm text-[#7F8C8D]">
              <div className="flex items-center">
                <Ruler className="mr-1" size={16} />
                <span>{listing.squareMeters}m²</span>
              </div>
              {listing.roomCount && (
                <div className="flex items-center">
                  <Bed className="mr-1" size={16} />
                  <span>{listing.roomCount} Yatak</span>
                </div>
              )}
              {listing.bathroomCount && (
                <div className="flex items-center">
                  <Bath className="mr-1" size={16} />
                  <span>{listing.bathroomCount} Banyo</span>
                </div>
              )}
              {listing.parkingCount && (
                <div className="flex items-center">
                  <Car className="mr-1" size={16} />
                  <span>{listing.parkingCount} Park</span>
                </div>
              )}
              {!listing.roomCount && !listing.bathroomCount && (
                <div className="flex items-center">
                  <DoorOpen className="mr-1" size={16} />
                  <span>Ticari</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <div className="flex items-center">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Estate Agent" className="w-8 h-8 rounded-full mr-2" />
                <span className="text-sm text-[#7F8C8D]">Ahmet Yılmaz</span>
              </div>
              <span className="text-xs text-[#7F8C8D]">{formatDate(listing.postedAt)}</span>
            </div>
          </CardContent>
        </a>
      </Link>
    </Card>
  );
};

export default PropertyCard;
