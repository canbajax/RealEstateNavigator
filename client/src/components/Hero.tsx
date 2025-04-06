import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Home, Building, Search, ChevronDown } from "lucide-react";
import { type PropertyType, type City } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    // Arama tipini her zaman eklemeliyiz!
    params.append("listingType", listingType);
    
    // Debug bilgisi
    console.log("Ana sayfa arama parametreleri:", params.toString());
    
    // Arama sayfasına yönlendir - wouter yerine window.location kullan
    window.location.href = `/listings?${params.toString()}`;
  };

  return (
    <section className="relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] h-[550px] md:h-[700px] flex items-center justify-center overflow-hidden">
      {/* Animated Tech Background */}
      <div className="absolute inset-0 z-0">
        {/* Digital Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-full h-full grid grid-cols-12 grid-rows-12">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border border-blue-500/10"></div>
            ))}
          </div>
          
          {/* Animated Circles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#3498DB] animate-pulse"></div>
          <div className="absolute top-3/4 left-1/3 w-3 h-3 rounded-full bg-[#5DADE2] animate-pulse"></div>
          <div className="absolute top-2/4 left-3/4 w-2 h-2 rounded-full bg-[#3498DB] animate-pulse"></div>
          <div className="absolute top-1/3 left-2/3 w-4 h-4 rounded-full bg-[#5DADE2] animate-pulse"></div>
          
          {/* Digital Rings */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-2 border-dashed border-blue-500/20 animate-spin" style={{ animationDuration: '30s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-blue-400/10 animate-spin" style={{ animationDuration: '40s', animationDirection: 'reverse' }}></div>
        </div>
        
        {/* Semi-transparent building pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/60 to-[#1E293B]/60 z-10"></div>
        
        {/* 3D City Grid Lines */}
        <div className="absolute bottom-0 left-0 w-full h-[30%] opacity-20" style={{ 
          background: 'linear-gradient(transparent 0%, #3498DB 100%)',
          backgroundSize: '20px 20px',
          backgroundImage: 'repeating-linear-gradient(0deg, #3498DB, #3498DB 1px, transparent 1px, transparent 20px),repeating-linear-gradient(90deg, #3498DB, #3498DB 1px, transparent 1px, transparent 20px)'
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="px-4 py-1 rounded-full bg-gradient-to-r from-[#3498DB]/20 to-[#5DADE2]/20 border border-[#3498DB]/30 text-[#3498DB] text-sm font-medium">
              AI Destekli Emlak Teknolojileri
            </div>
          </div>
          <h1 className="font-bold text-4xl md:text-5xl lg:text-7xl text-white mb-6 leading-tight">
            Emlak Sektöründe <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3498DB] to-[#5DADE2]">Dijital Dönüşümün</span> Öncüsü
          </h1>
          <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
            <strong className="text-[#3498DB]">15.000+</strong> sektör profesyoneli ve <strong className="text-[#3498DB]">700+</strong> kurumsal iş ortağımız ile
            emlak sektöründe yapay zeka destekli teknolojilerimizi keşfedin. Gayrimenkul işlemlerinizde yeni nesil çözümler Co Worker'da.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
            <div className="flex items-center text-white backdrop-blur-sm bg-white/5 rounded-xl px-4 py-3 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-[#3498DB]/20 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3498DB]">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs text-[#3498DB] font-medium">YAPAY ZEKA</div>
                <div className="text-sm font-medium">AI Değerleme Teknolojisi</div>
              </div>
            </div>
            
            <div className="flex items-center text-white backdrop-blur-sm bg-white/5 rounded-xl px-4 py-3 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-[#3498DB]/20 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3498DB]">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs text-[#3498DB] font-medium">BLOCKCHAIN</div>
                <div className="text-sm font-medium">Güvenli Tapu İşlemleri</div>
              </div>
            </div>
            
            <div className="flex items-center text-white backdrop-blur-sm bg-white/5 rounded-xl px-4 py-3 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-[#3498DB]/20 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3498DB]">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z"></path>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs text-[#3498DB] font-medium">3D SANAL TUR</div>
                <div className="text-sm font-medium">360° Emlak Keşfi</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search Box */}
        <div className="backdrop-blur-lg bg-white/90 rounded-xl p-4 sm:p-6 max-w-5xl mx-auto shadow-xl border border-[#3498DB]/10">
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
                  <label className="block text-sm font-medium text-[#7F8C8D] mb-1">Günlük Kira</label>
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