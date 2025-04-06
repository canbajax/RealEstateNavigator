import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Home, Building, Search, ChevronDown } from "lucide-react";
import { type PropertyType, type City } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const Hero = () => {
  const [location, setLocation] = useLocation();
  const [listingType, setListingType] = useState("sell");
  const [searchParams, setSearchParams] = useState({
    cityId: "",
    propertyTypeId: "",
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
    
    // Listeleme türünü ekle (satılık/kiralık/günlük)
    params.append("listingType", listingType);
    
    // Arama sayfasına yönlendir - wouter yerine window.location kullan
    window.location.href = `/listings?${params.toString()}`;
  };

  return (
    <section className="relative bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
          alt="Modern apartments" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A]/80 to-[#1E40AF]/80"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="font-bold text-3xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            Co Worker ile <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3498DB] to-[#5DADE2]">Kazançlı</span> Yatırımlar
          </h1>
          <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
            Türkiye'nin en güvenilir emlak ağında sektör profesyonelleri ve kurumsal iş ortaklarımız ile 
            emlak yatırımlarınızı değerlendirelim. Kazançlı yatırımlar, doğru iş ortaklıkları ve profesyonel güvence Co Worker'da.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 mt-4">
            <div className="flex items-center text-white">
              <span className="bg-white/20 p-2 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </span>
              <span className="text-sm">Güvenilir İş Ortakları</span>
            </div>
            <div className="flex items-center text-white">
              <span className="bg-white/20 p-2 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
                </svg>
              </span>
              <span className="text-sm">Yüksek Kazanç Potansiyeli</span>
            </div>
            <div className="flex items-center text-white">
              <span className="bg-white/20 p-2 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <span className="text-sm">%100 Güvenli İşlemler</span>
            </div>
          </div>
        </div>
        
        {/* Search Box */}
        <div className="bg-white rounded-xl p-4 sm:p-6 max-w-5xl mx-auto shadow-xl border border-gray-200">
          {/* İlan Türü Seçimi */}
          <Tabs defaultValue="sell" className="mb-6" onValueChange={(value) => setListingType(value)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger 
                value="sell" 
                className="data-[state=active]:bg-[#3498DB] data-[state=active]:text-white"
              >
                <Building className="mr-2 h-4 w-4" />
                Satılık
              </TabsTrigger>
              <TabsTrigger 
                value="rent" 
                className="data-[state=active]:bg-[#3498DB] data-[state=active]:text-white"
              >
                <Home className="mr-2 h-4 w-4" />
                Kiralık
              </TabsTrigger>
              <TabsTrigger 
                value="daily" 
                className="data-[state=active]:bg-[#3498DB] data-[state=active]:text-white"
              >
                <Building className="mr-2 h-4 w-4" />
                Günlük Kiralık
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sell" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Konum */}
                <div>
                  <label className="block text-sm font-medium text-[#7F8C8D] mb-1">Konum</label>
                  <div className="relative">
                    <Select onValueChange={(value) => handleSelectChange("cityId", value)}>
                      <SelectTrigger className="w-full h-12 border border-[#E5E5E5] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]">
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
                
                {/* Emlak Tipi */}
                <div>
                  <label className="block text-sm font-medium text-[#7F8C8D] mb-1">Emlak Tipi</label>
                  <Select onValueChange={(value) => handleSelectChange("propertyTypeId", value)}>
                    <SelectTrigger className="w-full h-12 border border-[#E5E5E5] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]">
                      <SelectValue placeholder="Emlak tipi" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes?.filter(pt => !!pt.listingCount).map(type => (
                        <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Fiyat Aralığı */}
                <div>
                  <label className="block text-sm font-medium text-[#7F8C8D] mb-1">Fiyat Aralığı</label>
                  <div className="flex h-12">
                    <Input 
                      type="text" 
                      placeholder="Min ₺" 
                      name="minPrice"
                      value={searchParams.minPrice}
                      onChange={handleInputChange}
                      className="w-1/2 border border-[#E5E5E5] rounded-l-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]"
                    />
                    <Input 
                      type="text" 
                      placeholder="Max ₺" 
                      name="maxPrice"
                      value={searchParams.maxPrice}
                      onChange={handleInputChange}
                      className="w-1/2 border-l-0 border border-[#E5E5E5] rounded-r-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]"
                    />
                  </div>
                </div>
                
                {/* Arama Butonu */}
                <div className="flex items-end">
                  <Button 
                    className="w-full h-12 bg-[#3498DB] hover:bg-[#5DADE2] text-white font-medium rounded-md transition"
                    onClick={handleSearch}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Ara
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="rent" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Konum */}
                <div>
                  <label className="block text-sm font-medium text-[#7F8C8D] mb-1">Konum</label>
                  <div className="relative">
                    <Select onValueChange={(value) => handleSelectChange("cityId", value)}>
                      <SelectTrigger className="w-full h-12 border border-[#E5E5E5] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]">
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
                
                {/* Emlak Tipi */}
                <div>
                  <label className="block text-sm font-medium text-[#7F8C8D] mb-1">Emlak Tipi</label>
                  <Select onValueChange={(value) => handleSelectChange("propertyTypeId", value)}>
                    <SelectTrigger className="w-full h-12 border border-[#E5E5E5] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]">
                      <SelectValue placeholder="Emlak tipi" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes?.filter(pt => !!pt.listingCount).map(type => (
                        <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Fiyat Aralığı */}
                <div>
                  <label className="block text-sm font-medium text-[#7F8C8D] mb-1">Kira Aralığı</label>
                  <div className="flex h-12">
                    <Input 
                      type="text" 
                      placeholder="Min ₺" 
                      name="minPrice"
                      value={searchParams.minPrice}
                      onChange={handleInputChange}
                      className="w-1/2 border border-[#E5E5E5] rounded-l-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]"
                    />
                    <Input 
                      type="text" 
                      placeholder="Max ₺" 
                      name="maxPrice"
                      value={searchParams.maxPrice}
                      onChange={handleInputChange}
                      className="w-1/2 border-l-0 border border-[#E5E5E5] rounded-r-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]"
                    />
                  </div>
                </div>
                
                {/* Arama Butonu */}
                <div className="flex items-end">
                  <Button 
                    className="w-full h-12 bg-[#3498DB] hover:bg-[#5DADE2] text-white font-medium rounded-md transition"
                    onClick={handleSearch}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Ara
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="daily" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Konum */}
                <div>
                  <label className="block text-sm font-medium text-[#7F8C8D] mb-1">Konum</label>
                  <div className="relative">
                    <Select onValueChange={(value) => handleSelectChange("cityId", value)}>
                      <SelectTrigger className="w-full h-12 border border-[#E5E5E5] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]">
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
                
                {/* Emlak Tipi */}
                <div>
                  <label className="block text-sm font-medium text-[#7F8C8D] mb-1">Emlak Tipi</label>
                  <Select onValueChange={(value) => handleSelectChange("propertyTypeId", value)}>
                    <SelectTrigger className="w-full h-12 border border-[#E5E5E5] rounded-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]">
                      <SelectValue placeholder="Emlak tipi" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes?.filter(pt => !!pt.listingCount).map(type => (
                        <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Fiyat Aralığı */}
                <div>
                  <label className="block text-sm font-medium text-[#7F8C8D] mb-1">Günlük Fiyat</label>
                  <div className="flex h-12">
                    <Input 
                      type="text" 
                      placeholder="Min ₺" 
                      name="minPrice"
                      value={searchParams.minPrice}
                      onChange={handleInputChange}
                      className="w-1/2 border border-[#E5E5E5] rounded-l-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]"
                    />
                    <Input 
                      type="text" 
                      placeholder="Max ₺" 
                      name="maxPrice"
                      value={searchParams.maxPrice}
                      onChange={handleInputChange}
                      className="w-1/2 border-l-0 border border-[#E5E5E5] rounded-r-md focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB]"
                    />
                  </div>
                </div>
                
                {/* Arama Butonu */}
                <div className="flex items-end">
                  <Button 
                    className="w-full h-12 bg-[#3498DB] hover:bg-[#5DADE2] text-white font-medium rounded-md transition"
                    onClick={handleSearch}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Ara
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Detaylı Arama Link */}
          <div className="text-center mt-2">
            <Button 
              variant="link" 
              className="text-[#3498DB] hover:text-[#5DADE2] font-medium inline-flex items-center"
              onClick={() => window.location.href = "/listings"}
            >
              <span>Detaylı Arama</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;