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
    <div className="container mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Danışmanlarımız</h2>
      
      <div className="relative max-w-4xl mx-auto">
        <div ref={carouselRef} className="overflow-hidden">
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            key={currentIndex}
          >
            <Card className="shadow-lg overflow-hidden w-full max-w-md">
              <CardContent className="p-0">
                <div className="relative">
                  {data.agents[currentIndex].avatarUrl ? (
                    <img 
                      src={data.agents[currentIndex].avatarUrl} 
                      alt={data.agents[currentIndex].fullName} 
                      className="w-full h-80 object-cover"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gray-100 flex items-center justify-center">
                      <User className="h-24 w-24 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-2">{data.agents[currentIndex].fullName}</h3>
                  <p className="text-gray-500 mb-6">Emlak Danışmanı</p>
                  
                  <div className="mt-4">
                    <Link href="/contact">
                      <Button variant="default" className="w-full bg-[#3498DB] hover:bg-[#2980B9] text-white">
                        <MessageCircle className="mr-2 h-4 w-4" />
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
            className="rounded-full bg-white shadow-md pointer-events-auto opacity-90 hover:opacity-100 mr-4"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white shadow-md pointer-events-auto opacity-90 hover:opacity-100 ml-4"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        
        {/* İndikatör noktaları */}
        <div className="flex justify-center mt-8 space-x-2">
          {data.agents.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-[#3498DB]' : 'bg-gray-300'
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