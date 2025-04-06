import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { MapPin, Search } from "lucide-react";
import { type PropertyType, type City } from "@shared/schema";
import LocationSearchBox from "./LocationSearchBox";

interface SearchBoxProps {
  vertical?: boolean;
  className?: string;
}

const SearchBox = ({ vertical = false, className = "" }: SearchBoxProps) => {
  const [location, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState({
    cityId: "",
    propertyTypeId: "",
    minPrice: "",
    maxPrice: "",
    priceRange: [0, 100],
    search: "",
    listingType: "all" // Varsayılan olarak tüm ilanları göster
  });

  const { data: propertyTypes } = useQuery<PropertyType[]>({
    queryKey: ["/api/property-types"],
  });

  const { data: cities } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    // Convert slider percentage to actual price values
    const maxPossiblePrice = 50000000; // 50 million
    const minPrice = Math.round((value[0] / 100) * maxPossiblePrice);
    const maxPrice = Math.round((value[1] / 100) * maxPossiblePrice);

    setSearchParams(prev => ({
      ...prev,
      priceRange: value,
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString()
    }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchParams.cityId) {
      params.append("cityId", searchParams.cityId);
    }
    
    if (searchParams.propertyTypeId) {
      params.append("propertyTypeId", searchParams.propertyTypeId);
    }
    
    if (searchParams.minPrice) {
      params.append("minPrice", searchParams.minPrice);
    }
    
    if (searchParams.maxPrice) {
      params.append("maxPrice", searchParams.maxPrice);
    }
    
    if (searchParams.search) {
      params.append("search", searchParams.search);
    }
    
    if (searchParams.listingType !== "all") {
      params.append("listingType", searchParams.listingType);
    }
    
    setLocation(`/listings?${params.toString()}`);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 sm:p-6 ${className} ${vertical ? "w-full" : "w-full max-w-5xl mx-auto"}`}>
      <div className="flex flex-wrap gap-3">
        {/* Listing Type - İlan Türü */}
        <div className="w-full sm:w-auto">
          <Select onValueChange={(value) => handleSelectChange("listingType", value)}>
            <SelectTrigger className="w-full sm:w-44 px-4 py-3 border border-[#E5E5E5] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]">
              <SelectValue placeholder="Satılık" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="sell">Satılık</SelectItem>
              <SelectItem value="rent">Kiralık</SelectItem>
              <SelectItem value="daily">Günlük Kiralık</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Property Type - Emlak Türü */}
        <div className="w-full sm:w-auto">
          <Select onValueChange={(value) => handleSelectChange("propertyTypeId", value)}>
            <SelectTrigger className="w-full sm:w-44 px-4 py-3 border border-[#E5E5E5] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]">
              <SelectValue placeholder="Konut" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes?.map(type => (
                <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* City - İl */}
        <div className="w-full sm:w-auto">
          <Select onValueChange={(value) => handleSelectChange("cityId", value)}>
            <SelectTrigger className="w-full sm:w-36 px-4 py-3 border border-[#E5E5E5] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]">
              <SelectValue placeholder="İl" />
            </SelectTrigger>
            <SelectContent>
              {cities?.map(city => (
                <SelectItem key={city.id} value={city.id.toString()}>{city.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* District - İlçe */}
        <div className="w-full sm:w-auto">
          <Select>
            <SelectTrigger className="w-full sm:w-36 px-4 py-3 border border-[#E5E5E5] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]">
              <SelectValue placeholder="İlçe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder">İlçe seçimi için önce il seçiniz</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Neighborhood - Mahalle */}
        <div className="w-full sm:w-auto">
          <Select>
            <SelectTrigger className="w-full sm:w-44 px-4 py-3 border border-[#E5E5E5] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]">
              <SelectValue placeholder="Mahalle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder">Mahalle seçimi için önce ilçe seçiniz</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-auto flex flex-wrap gap-3 mt-4">
          {/* Min Price */}
          <div className="w-full sm:w-36">
            <Input
              type="text"
              placeholder="Min TL"
              value={searchParams.minPrice}
              onChange={(e) => handleSelectChange("minPrice", e.target.value)}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]"
            />
          </div>
          
          {/* Max Price */}
          <div className="w-full sm:w-36">
            <Input
              type="text"
              placeholder="Max TL"
              value={searchParams.maxPrice}
              onChange={(e) => handleSelectChange("maxPrice", e.target.value)}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]"
            />
          </div>
          
          {/* TL Selection */}
          <div className="w-full sm:w-auto">
            <Select>
              <SelectTrigger className="w-full sm:w-24 px-4 py-3 border border-[#E5E5E5] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]">
                <SelectValue placeholder="TL" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tl">TL</SelectItem>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Room Count */}
          <div className="w-full sm:w-auto">
            <Select onValueChange={(value) => handleSelectChange("roomCount", value)}>
              <SelectTrigger className="w-full sm:w-36 px-4 py-3 border border-[#E5E5E5] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]">
                <SelectValue placeholder="Oda Sayısı" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tümü</SelectItem>
                <SelectItem value="1">1+0</SelectItem>
                <SelectItem value="2">1+1</SelectItem>
                <SelectItem value="3">2+1</SelectItem>
                <SelectItem value="4">3+1</SelectItem>
                <SelectItem value="5">4+1</SelectItem>
                <SelectItem value="6">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Search Buttons */}
        <div className="w-full flex flex-wrap gap-3 mt-4">
          <Button 
            className="flex-grow sm:flex-grow-0 sm:min-w-[200px] bg-[#3498DB] hover:bg-[#5DADE2] text-white font-medium py-3 rounded-md transition"
            onClick={handleSearch}
          >
            <Search className="mr-2 h-4 w-4" />
            Ara
          </Button>
          
          <Button 
            variant="outline"
            className="flex-grow sm:flex-grow-0 border-[#3498DB] text-[#3498DB] hover:bg-[#EBF5FB] font-medium py-3 rounded-md transition"
            onClick={handleSearch}
          >
            Haritada Ara
          </Button>
        </div>
        
        {/* Show More Link */}
        <div className="w-full mt-2">
          <button className="text-[#3498DB] text-sm font-medium hover:underline">
            Daha fazla seçenek göster
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
