import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { type PropertyType, type City } from "@shared/schema";

const Hero = () => {
  const [location, setLocation] = useLocation();
  const [listingType, setListingType] = useState("sell");
  const [searchParams, setSearchParams] = useState({
    location: "",
    propertyType: "",
    minPrice: "",
    maxPrice: ""
  });

  const { data: propertyTypes } = useQuery<PropertyType[]>({
    queryKey: ["/api/property-types"],
  });

  const { data: cities } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchParams.location) {
      params.append("location", searchParams.location);
    }
    
    if (searchParams.propertyType) {
      params.append("propertyType", searchParams.propertyType);
    }
    
    if (searchParams.minPrice) {
      params.append("minPrice", searchParams.minPrice);
    }
    
    if (searchParams.maxPrice) {
      params.append("maxPrice", searchParams.maxPrice);
    }
    
    params.append("type", listingType);
    
    setLocation(`/listings?${params.toString()}`);
  };

  return (
    <section className="relative bg-[#2C3E50] h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
          alt="Luxury apartment building" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#2C3E50] opacity-70"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-6">
            Hayalinizdeki Evi Bulun
          </h1>
          <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
            Türkiye'nin en kapsamlı ve güvenilir emlak portalında aradığınız mükemmel mülkü keşfedin.
          </p>
        </div>
        
        {/* Search Box */}
        <div className="bg-white rounded-lg p-4 sm:p-6 max-w-5xl mx-auto shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {/* Konum */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-[#7F8C8D] mb-1">Konum</label>
              <div className="relative">
                <Select onValueChange={(value) => handleSelectChange("location", value)}>
                  <SelectTrigger className="w-full px-4 py-3 border border-[#BDC3C7] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]">
                    <SelectValue placeholder="İl, ilçe veya mahalle" />
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
            
            {/* Kategori */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-[#7F8C8D] mb-1">Kategori</label>
              <Select onValueChange={(value) => handleSelectChange("propertyType", value)}>
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
            
            {/* Fiyat Aralığı */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-[#7F8C8D] mb-1">Fiyat Aralığı</label>
              <div className="flex">
                <Input 
                  type="number" 
                  placeholder="Min ₺" 
                  name="minPrice"
                  value={searchParams.minPrice}
                  onChange={handleInputChange}
                  className="w-1/2 px-4 py-3 border border-[#BDC3C7] rounded-l-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]"
                />
                <Input 
                  type="number" 
                  placeholder="Max ₺" 
                  name="maxPrice"
                  value={searchParams.maxPrice}
                  onChange={handleInputChange}
                  className="w-1/2 px-4 py-3 border border-l-0 border-[#BDC3C7] rounded-r-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]"
                />
              </div>
            </div>
            
            {/* Arama Butonu */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-white mb-1">&#8205;</label>
              <Button 
                className="w-full px-4 py-3 bg-[#3498DB] hover:bg-[#5DADE2] text-white font-medium rounded-md transition"
                onClick={handleSearch}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
                Ara
              </Button>
            </div>
            
            {/* Detaylı Arama Link */}
            <div className="lg:col-span-7 text-center mt-2">
              <Button 
                variant="link" 
                className="text-[#3498DB] hover:text-[#5DADE2] font-medium inline-flex items-center"
                onClick={() => setLocation("/listings")}
              >
                <span>Detaylı Arama</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;