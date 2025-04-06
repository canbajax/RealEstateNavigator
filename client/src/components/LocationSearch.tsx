import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LocationCard from "@/components/LocationCard";
import { ArrowRight } from "lucide-react";
import { type City } from "@shared/schema";

const LocationSearch = () => {
  const { data: cities, isLoading, error } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#ECF0F1]">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="font-bold text-2xl md:text-3xl text-[#2C3E50]">Lokasyon Bazlı Arama</h2>
            <p className="text-[#7F8C8D] mt-4">Şehirler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#ECF0F1]">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-bold text-2xl md:text-3xl text-[#2C3E50]">Lokasyon Bazlı Arama</h2>
          <p className="text-[#7F8C8D] mt-2 max-w-3xl mx-auto">
            Türkiye'nin dört bir yanındaki emlak fırsatlarını keşfedin. Yaşamak istediğiniz şehri seçin ve size özel fırsatları görüntüleyin.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {isLoading ? (
            // Loading skeletons
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden shadow-md">
                <Skeleton className="w-full h-36" />
              </div>
            ))
          ) : (
            cities?.map(city => (
              <LocationCard key={city.id} city={city} />
            ))
          )}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/listings">
            <Button className="inline-flex items-center bg-[#3498DB] hover:bg-[#5DADE2] text-white font-medium px-6 py-3 rounded-md transition">
              <span>Tüm Şehirleri Gör</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LocationSearch;
