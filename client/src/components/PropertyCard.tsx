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
  
  const { data: agentResponse } = useQuery<{success: boolean, agents: any[]}>({
    queryKey: ["/api/agents"],
  });

  const cityName = cities?.find(city => city.id === listing.cityId)?.name || '';
  
  // Find agent information if present
  const agents = agentResponse?.agents || [];
  const agent = agents.find(a => a.id === listing.agentId);

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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-[#3498DB]/10 rounded-xl group">
      <Link href={`/listings/${listing.id}`}>
        <a className="block">
          <div className="relative">
            <img 
              src={listing.imageUrls[0]} 
              alt={listing.title} 
              className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Status Badge */}
            <div className="absolute top-0 left-0 m-3 flex flex-col gap-1.5">
              <Badge className={`backdrop-blur-sm bg-opacity-85 border border-white/10 ${
                  listing.listingType === 'sell' 
                    ? 'bg-[#3498DB]' 
                    : listing.listingType === 'rent'
                      ? 'bg-[#2ECC71]'
                      : 'bg-[#F39C12]'
                } text-white rounded-full px-3 py-1 text-xs font-medium shadow-md`}>
                {listingTypeBadge.text}
              </Badge>
              
              {transactionStatusBadge && (
                <Badge className="backdrop-blur-sm bg-[#8E44AD]/85 border border-white/10 text-white rounded-full px-3 py-1 text-xs font-medium shadow-md">
                  {transactionStatusBadge.text}
                </Badge>
              )}
              
              {/* Featured badge if applicable */}
              {listing.isFeatured && (
                <Badge className="backdrop-blur-sm bg-amber-500/85 border border-white/10 text-white rounded-full px-3 py-1 text-xs font-medium shadow-md">
                  Öne Çıkan
                </Badge>
              )}
            </div>
            
            {/* Favorite Button */}
            <div className="absolute top-0 right-0 m-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="backdrop-blur-md bg-white/80 rounded-full w-9 h-9 p-0 text-gray-500 hover:text-red-500 transition shadow-lg border border-white/30 hover:bg-white"
                onClick={toggleFavorite}
              >
                <Heart className={isFavorite ? "fill-red-500 text-red-500" : ""} size={18} />
              </Button>
            </div>
            
            {/* Image count if more than 1 */}
            {listing.imageUrls.length > 1 && (
              <div className="absolute bottom-3 right-3 backdrop-blur-md bg-black/50 text-white text-xs px-2.5 py-1.5 rounded-full border border-white/10 shadow-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M22 16V6" />
                  <path d="M18 2V6" />
                  <path d="M12 16v2" />
                  <path d="M8 8v8" />
                  <path d="M20 10v8" />
                  <path d="M2 18v-8" />
                  <path d="M2 6v4" />
                </svg>
                {listing.imageUrls.length} Fotoğraf
              </div>
            )}
          </div>
          
          <CardContent className="p-5">
            {/* Price and Title */}
            <div className="flex flex-col gap-1">
              <div className="flex items-start justify-between">
                <p className="font-bold text-xl bg-gradient-to-r from-[#16A085] to-[#2ECC71] bg-clip-text text-transparent">
                  {`₺${formatPrice(listing.price)}`}
                  {listing.listingType !== 'sell' && (
                    <span className="text-sm font-medium text-gray-600">
                      /{listing.listingType === 'daily' ? 'gün' : 'ay'}
                    </span>
                  )}
                </p>
                
                <div className="hidden md:block">
                  <div className="bg-[#3498DB]/10 text-[#3498DB] text-xs font-medium px-2 py-0.5 rounded-full">
                    {propertyTypes?.find(type => type.id === listing.propertyTypeId)?.name || 'Emlak'}
                  </div>
                </div>
              </div>
              
              <h3 className="font-semibold text-[#1E293B] line-clamp-1 text-lg group-hover:text-[#3498DB] transition-colors">
                {listing.title}
              </h3>
            </div>
            
            {/* Location */}
            <p className="text-[#64748B] text-sm mt-3 flex items-center">
              <MapPin className="text-[#3498DB] mr-1.5 flex-shrink-0" size={16} />
              <span className="truncate">
                {listing.neighborhood && `${listing.neighborhood}, `}
                {listing.district}, {cityName}
              </span>
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-sm text-[#64748B]">
              <div className="bg-[#F8FAFC] rounded-lg p-1.5 flex items-center justify-center">
                <Ruler className="mr-1.5 text-[#3498DB]" size={14} />
                <span>{listing.squareMeters}m²</span>
              </div>
              
              {listing.roomCount && (
                <div className="bg-[#F8FAFC] rounded-lg p-1.5 flex items-center justify-center">
                  <Bed className="mr-1.5 text-[#3498DB]" size={14} />
                  <span>{listing.roomCount}</span>
                </div>
              )}
              
              {listing.bathroomCount && (
                <div className="bg-[#F8FAFC] rounded-lg p-1.5 flex items-center justify-center">
                  <Bath className="mr-1.5 text-[#3498DB]" size={14} />
                  <span>{listing.bathroomCount}</span>
                </div>
              )}
              
              {listing.parkingCount && (
                <div className="bg-[#F8FAFC] rounded-lg p-1.5 flex items-center justify-center">
                  <Car className="mr-1.5 text-[#3498DB]" size={14} />
                  <span>{listing.parkingCount}</span>
                </div>
              )}
              
              {listing.buildingAge && (
                <div className="bg-[#F8FAFC] rounded-lg p-1.5 flex items-center justify-center">
                  <Building className="mr-1.5 text-[#3498DB]" size={14} />
                  <span>{listing.buildingAge} yaş</span>
                </div>
              )}
              
              {listing.floorNumber && (
                <div className="bg-[#F8FAFC] rounded-lg p-1.5 flex items-center justify-center">
                  <Home className="mr-1.5 text-[#3498DB]" size={14} />
                  <span>{listing.floorNumber}. kat</span>
                </div>
              )}
            </div>
            
            {/* Bottom info row */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-9 h-9 rounded-full bg-[#3498DB]/10 overflow-hidden mr-2 border-2 border-[#3498DB]/20">
                  <img 
                    src={agent?.avatarUrl || `https://randomuser.me/api/portraits/men/${(listing.id % 50) + 1}.jpg`} 
                    alt={agent?.fullName || "Emlak Danışmanı"} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#334155] font-medium truncate">
                    {agent?.fullName || "Emlak Danışmanı"}
                  </span>
                  {listing.transactionStatus !== 'available' && agent ? (
                    <span className="text-[10px] text-[#64748B]">
                      {listing.transactionStatus === 'sold' ? 'Satışı' : 'Kiracısı'} buldu
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#64748B]">
                      {formatDate(listing.postedAt)}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs flex items-center bg-[#F8FAFC] px-2 py-1 rounded-full text-[#64748B]">
                <Calendar className="mr-1.5" size={12} />
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
