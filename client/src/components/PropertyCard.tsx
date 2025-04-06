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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] border border-gray-200 group rounded-xl bg-white">
      <Link href={`/listings/${listing.id}`}>
        <a className="block">
          <div className="relative overflow-hidden rounded-t-xl">
            {/* Overlay shimmer effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-10"></div>
            
            {/* Background pattern before image loads */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse-slow">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3498DB_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>
            
            <img 
              src={listing.imageUrls[0]} 
              alt={listing.title} 
              className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700 ease-out relative z-0"
            />
            
            {/* Gradient overlay for better readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-1"></div>
            
            {/* Status Badge */}
            <div className="absolute top-0 left-0 m-2 flex flex-col gap-1 z-20">
              <Badge className={`${listingTypeBadge.color} text-white rounded-md px-2.5 py-1 text-xs font-semibold shadow-md transform transition-transform group-hover:scale-110 duration-300`}>
                {listingTypeBadge.text}
              </Badge>
              
              {transactionStatusBadge && (
                <Badge className={`${transactionStatusBadge.color} text-white rounded-md px-2.5 py-1 text-xs font-semibold shadow-md transform translate-x-0 group-hover:translate-x-1 transition-all duration-300 opacity-90 group-hover:opacity-100`}>
                  {transactionStatusBadge.text}
                </Badge>
              )}
              
              {/* Featured badge if applicable */}
              {listing.isFeatured && (
                <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md px-2.5 py-1 text-xs font-semibold shadow-md transform translate-x-0 group-hover:translate-x-1 transition-all duration-300 opacity-90 group-hover:opacity-100 animate-pulse-slow">
                  Öne Çıkan
                </Badge>
              )}
            </div>
            
            {/* Favorite Button */}
            <div className="absolute top-0 right-0 m-2 z-20">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white/90 backdrop-blur-sm rounded-full w-8 h-8 p-0 text-gray-500 hover:text-red-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 border-0"
                onClick={toggleFavorite}
              >
                <Heart className={`transform transition-all duration-500 ${isFavorite ? "fill-red-500 text-red-500 scale-110" : "hover:scale-125 hover:rotate-[-10deg]"}`} size={16} />
              </Button>
            </div>
            
            {/* Price tag with pulsing animation on hover */}
            <div className="absolute bottom-0 left-0 m-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 z-20">
              <Badge className="bg-gradient-to-r from-[#3498DB] to-[#2980B9] text-white px-3 py-1.5 rounded-md text-sm font-bold shadow-lg group-hover:shadow-[#3498DB]/30 transition-all duration-500 group-hover:scale-110">
                {`₺${formatPrice(listing.price)}`}
              </Badge>
            </div>
            
            {/* Image count if more than 1 */}
            {listing.imageUrls.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full z-20 flex items-center space-x-1 transform translate-y-1 opacity-70 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6V18C22 19.6569 20.6569 21 19 21H5C3.34315 21 2 19.6569 2 18V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8.5 11C9.88071 11 11 9.88071 11 8.5C11 7.11929 9.88071 6 8.5 6C7.11929 6 6 7.11929 6 8.5C6 9.88071 7.11929 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 15L18.5 11.5C18.1022 11.1022 17.5738 10.8787 17.025 10.8787C16.4762 10.8787 15.9478 11.1022 15.55 11.5L6 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{listing.imageUrls.length}</span>
              </div>
            )}
          </div>
          
          <CardContent className="p-4 relative">
            {/* Subtle pattern for background texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#3498DB_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
            
            {/* Price and Title */}
            <div className="flex flex-col gap-1 relative">
              <p className="font-bold text-lg bg-gradient-to-r from-[#E74C3C] to-[#E67E22] bg-clip-text group-hover:text-transparent transform transition-all duration-300 group-hover:translate-x-0.5 flex items-baseline">
                <span className="text-[#E74C3C] group-hover:text-transparent">{`₺${formatPrice(listing.price)}`}</span>
                {listing.listingType !== 'sell' && (
                  <span className="text-sm font-medium text-gray-600 group-hover:text-[#E74C3C] transition-colors duration-300 ml-1">
                    /{listing.listingType === 'daily' ? 'gün' : 'ay'}
                  </span>
                )}
              </p>
              <h3 className="relative font-semibold text-[#2C3E50] line-clamp-1 text-lg group-hover:text-[#3498DB] transition-colors duration-300 group-hover:translate-x-0.5 transform transition-transform">
                {listing.title}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3498DB] group-hover:w-full transition-all duration-500 opacity-0 group-hover:opacity-100"></span>
              </h3>
            </div>
            
            {/* Location */}
            <p className="text-gray-600 text-sm mt-3 flex items-center group-hover:text-[#3498DB] transition-all duration-300 relative overflow-hidden">
              <MapPin className="text-[#3498DB] mr-1 flex-shrink-0 group-hover:scale-125 transition-transform duration-300 group-hover:rotate-[15deg]" size={16} />
              <span className="truncate group-hover:font-medium transition-all duration-300 relative">
                {listing.neighborhood && `${listing.neighborhood}, `}
                {listing.district}, {cityName}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#3498DB]/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
              </span>
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 mt-4 text-sm text-gray-600 relative">
              {/* Subtle highlight effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#3498DB]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-500"></div>
              
              <div className="flex items-center group/feature transition-all duration-300">
                <div className="relative mr-1.5">
                  <Ruler className="text-[#3498DB] group-hover/feature:text-transparent transition-all duration-300 group-hover/feature:scale-125 transform" size={14} />
                  <Ruler className="absolute top-0 left-0 text-[#2980B9] transition-all duration-300 transform scale-0 group-hover/feature:scale-125 opacity-0 group-hover/feature:opacity-100" size={14} />
                </div>
                <span className="group-hover/feature:font-semibold group-hover/feature:text-[#3498DB] transition-all duration-300">{listing.squareMeters}m²</span>
              </div>
              
              {listing.roomCount && (
                <div className="flex items-center group/feature transition-all duration-300">
                  <div className="relative mr-1.5">
                    <Bed className="text-[#3498DB] group-hover/feature:text-transparent transition-all duration-300 group-hover/feature:scale-125 transform" size={14} />
                    <Bed className="absolute top-0 left-0 text-[#2980B9] transition-all duration-300 transform scale-0 group-hover/feature:scale-125 opacity-0 group-hover/feature:opacity-100" size={14} />
                  </div>
                  <span className="group-hover/feature:font-semibold group-hover/feature:text-[#3498DB] transition-all duration-300">{listing.roomCount}</span>
                </div>
              )}
              
              {listing.bathroomCount && (
                <div className="flex items-center group/feature transition-all duration-300">
                  <div className="relative mr-1.5">
                    <Bath className="text-[#3498DB] group-hover/feature:text-transparent transition-all duration-300 group-hover/feature:scale-125 transform" size={14} />
                    <Bath className="absolute top-0 left-0 text-[#2980B9] transition-all duration-300 transform scale-0 group-hover/feature:scale-125 opacity-0 group-hover/feature:opacity-100" size={14} />
                  </div>
                  <span className="group-hover/feature:font-semibold group-hover/feature:text-[#3498DB] transition-all duration-300">{listing.bathroomCount}</span>
                </div>
              )}
              
              {listing.parkingCount && (
                <div className="flex items-center group/feature transition-all duration-300">
                  <div className="relative mr-1.5">
                    <Car className="text-[#3498DB] group-hover/feature:text-transparent transition-all duration-300 group-hover/feature:scale-125 transform" size={14} />
                    <Car className="absolute top-0 left-0 text-[#2980B9] transition-all duration-300 transform scale-0 group-hover/feature:scale-125 opacity-0 group-hover/feature:opacity-100" size={14} />
                  </div>
                  <span className="group-hover/feature:font-semibold group-hover/feature:text-[#3498DB] transition-all duration-300">{listing.parkingCount}</span>
                </div>
              )}
              
              {listing.buildingAge && (
                <div className="flex items-center group/feature transition-all duration-300">
                  <div className="relative mr-1.5">
                    <Building className="text-[#3498DB] group-hover/feature:text-transparent transition-all duration-300 group-hover/feature:scale-125 transform" size={14} />
                    <Building className="absolute top-0 left-0 text-[#2980B9] transition-all duration-300 transform scale-0 group-hover/feature:scale-125 opacity-0 group-hover/feature:opacity-100" size={14} />
                  </div>
                  <span className="group-hover/feature:font-semibold group-hover/feature:text-[#3498DB] transition-all duration-300">{listing.buildingAge} yaş</span>
                </div>
              )}
              
              {listing.floorNumber && (
                <div className="flex items-center group/feature transition-all duration-300">
                  <div className="relative mr-1.5">
                    <Home className="text-[#3498DB] group-hover/feature:text-transparent transition-all duration-300 group-hover/feature:scale-125 transform" size={14} />
                    <Home className="absolute top-0 left-0 text-[#2980B9] transition-all duration-300 transform scale-0 group-hover/feature:scale-125 opacity-0 group-hover/feature:opacity-100" size={14} />
                  </div>
                  <span className="group-hover/feature:font-semibold group-hover/feature:text-[#3498DB] transition-all duration-300">{listing.floorNumber}. kat</span>
                </div>
              )}
            </div>
            
            {/* Bottom info row */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center relative">
              <div className="flex items-center group/agent">
                <div className="relative mr-2 w-7 h-7 rounded-full overflow-hidden shadow-sm border border-gray-200 group-hover/agent:border-[#3498DB] transition-colors duration-300">
                  <img 
                    src={agent?.avatarUrl || `https://ui-avatars.com/api/?name=Co+Worker&background=3498DB&color=fff&size=128`} 
                    alt={agent?.fullName || "Emlak Danışmanı"} 
                    className="w-full h-full object-cover group-hover/agent:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#3498DB]/20 to-transparent opacity-0 group-hover/agent:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-800 font-medium truncate w-24 group-hover/agent:text-[#3498DB] transition-colors duration-300 group-hover/agent:translate-x-0.5 transform transition-transform">
                    {agent?.fullName || "Emlak Danışmanı"}
                  </span>
                  {listing.transactionStatus !== 'available' && agent ? (
                    <span className="text-[10px] text-gray-500 group-hover/agent:text-[#E74C3C] transition-colors duration-300 group-hover/agent:translate-x-0.5 transform transition-transform">
                      {listing.transactionStatus === 'sold' ? 'Satışı' : 'Kiracısı'} buldu
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-500 group-hover/agent:text-[#3498DB] transition-colors duration-300 group-hover/agent:translate-x-0.5 transform transition-transform">
                      {formatDate(listing.postedAt)}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs flex items-center text-gray-500 group-hover:text-[#3498DB] transition-colors duration-300 relative">
                <Calendar className="mr-1 transform group-hover:rotate-[-5deg] transition-transform duration-300" size={12} />
                <span className="relative">
                  {formatDate(listing.postedAt)}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#3498DB] group-hover:w-full transition-all duration-500"></span>
                </span>
              </span>
            </div>
          </CardContent>
        </a>
      </Link>
    </Card>
  );
};

export default PropertyCard;
