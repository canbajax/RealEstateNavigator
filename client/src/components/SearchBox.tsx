import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { MapPin, Search } from "lucide-react";
import { type PropertyType, type City } from "@shared/schema";

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
      <div className={`grid ${vertical ? "grid-cols-1 gap-4" : "grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"}`}>
        {/* Search input */}
        <div className="md:col-span-3 lg:col-span-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Arama yapın..."
              name="search"
              value={searchParams.search}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-[#BDC3C7] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]"
            />
            <Search className="absolute left-3 top-3 text-[#7F8C8D]" size={20} />
          </div>
        </div>
        
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-[#7F8C8D] mb-1">Konum</label>
          <div className="relative">
            <Select onValueChange={(value) => handleSelectChange("cityId", value)}>
              <SelectTrigger className="w-full px-4 py-3 border border-[#BDC3C7] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]">
                <SelectValue placeholder="İl seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {cities?.map(city => (
                  <SelectItem key={city.id} value={city.id.toString()}>{city.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <MapPin className="absolute right-3 top-3 text-[#7F8C8D]" size={16} />
          </div>
        </div>
        
        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-[#7F8C8D] mb-1">Kategori</label>
          <Select onValueChange={(value) => handleSelectChange("propertyTypeId", value)}>
            <SelectTrigger className="w-full px-4 py-3 border border-[#BDC3C7] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]">
              <SelectValue placeholder="Tüm Kategoriler" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes?.map(type => (
                <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Listing Type */}
        <div>
          <label className="block text-sm font-medium text-[#7F8C8D] mb-1">Durum</label>
          <Select onValueChange={(value) => handleSelectChange("listingType", value)}>
            <SelectTrigger className="w-full px-4 py-3 border border-[#BDC3C7] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]">
              <SelectValue placeholder="Durum Seçiniz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="sell">Satılık</SelectItem>
              <SelectItem value="rent">Kiralık</SelectItem>
              <SelectItem value="daily">Günlük Kiralık</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Price Range */}
        <div className={vertical ? "" : "md:col-span-3 lg:col-span-4"}>
          <label className="block text-sm font-medium text-[#7F8C8D] mb-1">
            Fiyat Aralığı: {searchParams.minPrice ? `₺${Number(searchParams.minPrice).toLocaleString()}` : '₺0'} - 
            {searchParams.maxPrice ? `₺${Number(searchParams.maxPrice).toLocaleString()}` : '₺50.000.000+'}
          </label>
          <div className="px-2 py-4">
            <Slider
              value={searchParams.priceRange}
              onValueChange={handlePriceRangeChange}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Search Button */}
        <div className={vertical ? "" : "md:col-span-3 lg:col-span-4"}>
          <Button 
            className="w-full bg-[#3498DB] hover:bg-[#5DADE2] text-white font-medium py-3 rounded-md transition"
            onClick={handleSearch}
          >
            <Search className="mr-2 h-4 w-4" />
            Ara
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
