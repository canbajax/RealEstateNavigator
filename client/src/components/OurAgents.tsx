import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, User, MessageCircle } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { type User as UserType } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Agent = Omit<UserType, "password">;

const OurAgents = () => {
  const { data, isLoading, error } = useQuery<{ success: boolean, agents: Agent[] }>({
    queryKey: ["/api/agents"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    refetchOnMount: true,
    staleTime: 0, // Her zaman yeni veriyi getir
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Otomatik kaydırma için
  useEffect(() => {
    const interval = setInterval(() => {
      if (data?.agents && data.agents.length > 0) {
        setCurrentIndex((prevIndex) => 
          prevIndex === data.agents.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 5000); // 5 saniyede bir değiştir
    
    return () => clearInterval(interval);
  }, [data?.agents]);
  
  const goToPrevious = () => {
    if (!data?.agents) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? data.agents.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    if (!data?.agents) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === data.agents.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Danışmanlarımız</h2>
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <Card className="shadow-md">
              <CardContent className="p-0">
                <div className="animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data || !data.agents || data.agents.length === 0) {
    console.log("OurAgents: Veri alınamadı veya boş", { error, data });
    return null;
  }
  
  // Doğrulama amaçlı tüm ajanları loglama
  console.log("Danışmanlar yüklendi:", data.agents);

  return (
    <div className="container mx-auto py-16 px-4 overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#3498DB] to-[#9B59B6] bg-clip-text text-transparent animate-pulse-slow">Danışmanlarımız</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Profesyonel ve deneyimli emlak danışmanlarımız, gayrimenkul süreçlerinizde size rehberlik etmek için hazır.</p>
      </div>
      
      <div className="relative max-w-4xl mx-auto">
        <div ref={carouselRef} className="overflow-hidden">
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            key={currentIndex}
          >
            <Card className="shadow-2xl overflow-hidden w-full max-w-md transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl rounded-xl bg-white border-0">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000]/50 to-transparent z-10"></div>
                  
                  {data.agents[currentIndex].avatarUrl ? (
                    <div className="overflow-hidden h-80">
                      <img 
                        src={data.agents[currentIndex].avatarUrl} 
                        alt={data.agents[currentIndex].fullName} 
                        className="w-full h-80 object-cover transition-transform duration-700 hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-80 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                      <User className="h-24 w-24 text-gray-400 animate-pulse" />
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                    <div className="flex items-center space-x-2">
                      <div className="h-1 w-12 bg-white rounded animate-pulse"></div>
                      <p className="text-white font-medium text-sm opacity-90">ID: {data.agents[currentIndex].id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 text-center relative">
                  {/* Dekoratif eleman */}
                  <div className="absolute top-0 right-0 w-20 h-20 -mt-10 -mr-10 bg-gradient-to-bl from-[#3498DB]/20 to-transparent rounded-full blur-xl"></div>
                  
                  <h3 className="text-2xl font-bold mb-2 text-[#2C3E50] group-hover:text-[#3498DB] transition-all duration-300">{data.agents[currentIndex].fullName}</h3>
                  <p className="text-gray-500 mb-6 flex items-center justify-center">
                    <span className="inline-block w-2 h-2 bg-[#3498DB] rounded-full mr-2 animate-pulse"></span>
                    Emlak Danışmanı
                  </p>
                  
                  <div className="mt-6">
                    <Link href="/contact">
                      <Button variant="default" className="w-full bg-gradient-to-r from-[#3498DB] to-[#2980B9] hover:from-[#2980B9] hover:to-[#3498DB] text-white shadow-xl hover:shadow-[#3498DB]/30 transition-all duration-300 transform hover:-translate-y-1">
                        <MessageCircle className="mr-2 h-4 w-4 animate-bounce-mini" />
                        İletişime Geç
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Navigasyon kontrolleri */}
        <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/80 backdrop-blur-sm shadow-lg pointer-events-auto opacity-80 hover:opacity-100 mr-4 hover:scale-110 transition-all duration-300 border-0"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6 text-[#3498DB]" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/80 backdrop-blur-sm shadow-lg pointer-events-auto opacity-80 hover:opacity-100 ml-4 hover:scale-110 transition-all duration-300 border-0"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6 text-[#3498DB]" />
          </Button>
        </div>
        
        {/* İndikatör noktaları */}
        <div className="flex justify-center mt-8 space-x-3">
          {data.agents.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-gradient-to-r from-[#3498DB] to-[#9B59B6] scale-125 shadow-md' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Danışman ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurAgents;