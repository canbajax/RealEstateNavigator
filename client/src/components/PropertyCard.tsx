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
  DoorOpen,
  Home,
  Building,
  Calendar,
  Tag
} from "lucide-react";
import { type Listing } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface PropertyCardProps {
  listing: Listing;
}

const PropertyCard = ({ listing }: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: propertyTypes } = useQuery<any[]>({
    queryKey: ["/api/property-types"],
  });

  const { data: cities } = useQuery<any[]>({
    queryKey: ["/api/cities"],
  });

  const cityName = cities?.find(city => city.id === listing.cityId)?.name || '';

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
  
  // Get listing type color and text
  const getListingTypeBadge = () => {
    switch(listing.listingType) {
      case 'sell':
        return { color: 'bg-red-600', text: 'Satılık' };
      case 'rent':
        return { color: 'bg-blue-600', text: 'Kiralık' };
      case 'daily':
        return { color: 'bg-green-600', text: 'Günlük Kiralık' };
      default:
        return { color: 'bg-gray-600', text: 'İlan' };
    }
  };
  
  const listingTypeBadge = getListingTypeBadge();
  
  // Get transaction status 
  const getTransactionStatusBadge = () => {
    if (!listing.transactionStatus) return null;
    
    switch(listing.transactionStatus) {
      case 'sold':
        return { color: 'bg-purple-600', text: 'Satıldı' };
      case 'rented':
        return { color: 'bg-purple-600', text: 'Kiralandı' };
      default:
        return null;
    }
  };
  
  const transactionStatusBadge = getTransactionStatusBadge();

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200 group">
      <Link href={`/listings/${listing.id}`}>
        <a className="block">
          <div className="relative">
            <img 
              src={listing.imageUrls[0]} 
              alt={listing.title} 
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Status Badge */}
            <div className="absolute top-0 left-0 m-2 flex flex-col gap-1">
              <Badge className={`${listingTypeBadge.color} text-white rounded-md px-2 py-1 text-xs font-semibold`}>
                {listingTypeBadge.text}
              </Badge>
              
              {transactionStatusBadge && (
                <Badge className={`${transactionStatusBadge.color} text-white rounded-md px-2 py-1 text-xs font-semibold`}>
                  {transactionStatusBadge.text}
                </Badge>
              )}
              
              {/* Featured badge if applicable */}
              {listing.isFeatured && (
                <Badge className="bg-amber-500 text-white rounded-md px-2 py-1 text-xs font-semibold">
                  Öne Çıkan
                </Badge>
              )}
            </div>
            
            {/* Favorite Button */}
            <div className="absolute top-0 right-0 m-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white/90 rounded-full w-8 h-8 p-0 text-gray-500 hover:text-red-500 transition shadow-md"
                onClick={toggleFavorite}
              >
                <Heart className={isFavorite ? "fill-red-500 text-red-500" : ""} size={16} />
              </Button>
            </div>
            
            {/* Image count if more than 1 */}
            {listing.imageUrls.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {listing.imageUrls.length} Fotoğraf
              </div>
            )}
          </div>
          
          <CardContent className="p-4">
            {/* Price and Title */}
            <div className="flex flex-col gap-1">
              <p className="font-bold text-lg text-[#E74C3C]">
                {`₺${formatPrice(listing.price)}`}
                {listing.listingType !== 'sell' && (
                  <span className="text-sm font-medium text-gray-600">
                    /{listing.listingType === 'daily' ? 'gün' : 'ay'}
                  </span>
                )}
              </p>
              <h3 className="font-semibold text-[#2C3E50] line-clamp-1 text-lg">
                {listing.title}
              </h3>
            </div>
            
            {/* Location */}
            <p className="text-gray-600 text-sm mt-2 flex items-center">
              <MapPin className="text-[#3498DB] mr-1 flex-shrink-0" size={16} />
              <span className="truncate">
                {listing.neighborhood && `${listing.neighborhood}, `}
                {listing.district}, {cityName}
              </span>
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-3 gap-x-2 gap-y-1 mt-3 text-sm text-gray-600">
              <div className="flex items-center">
                <Ruler className="mr-1 text-[#3498DB]" size={14} />
                <span>{listing.squareMeters}m²</span>
              </div>
              
              {listing.roomCount && (
                <div className="flex items-center">
                  <Bed className="mr-1 text-[#3498DB]" size={14} />
                  <span>{listing.roomCount}</span>
                </div>
              )}
              
              {listing.bathroomCount && (
                <div className="flex items-center">
                  <Bath className="mr-1 text-[#3498DB]" size={14} />
                  <span>{listing.bathroomCount}</span>
                </div>
              )}
              
              {listing.parkingCount && (
                <div className="flex items-center">
                  <Car className="mr-1 text-[#3498DB]" size={14} />
                  <span>{listing.parkingCount}</span>
                </div>
              )}
              
              {listing.buildingAge && (
                <div className="flex items-center">
                  <Building className="mr-1 text-[#3498DB]" size={14} />
                  <span>{listing.buildingAge} yaş</span>
                </div>
              )}
              
              {listing.floorNumber && (
                <div className="flex items-center">
                  <Home className="mr-1 text-[#3498DB]" size={14} />
                  <span>{listing.floorNumber}. kat</span>
                </div>
              )}
            </div>
            
            {/* Bottom info row */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center">
                <img 
                  src={`https://randomuser.me/api/portraits/men/${(listing.id % 50) + 1}.jpg`} 
                  alt="Emlak Danışmanı" 
                  className="w-7 h-7 rounded-full mr-2 border border-gray-200"
                />
                <span className="text-xs text-gray-600 truncate">Emlak Danışmanı</span>
              </div>
              <span className="text-xs flex items-center text-gray-500">
                <Calendar className="mr-1" size={12} />
                {formatDate(listing.postedAt)}
              </span>
            </div>
          </CardContent>
        </a>
      </Link>
    </Card>
  );
};

export default PropertyCard;
