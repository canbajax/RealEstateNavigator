import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard from "@/components/PropertyCard";
import { ArrowRight } from "lucide-react";
import { type Listing } from "@shared/schema";

const FeaturedProperties = () => {
  const { data: featuredListings, isLoading, error } = useQuery<Listing[]>({
    queryKey: ["/api/featured-listings"],
  });

  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="font-bold text-2xl md:text-3xl text-[#2C3E50]">Öne Çıkan İlanlar</h2>
            <p className="text-[#7F8C8D] mt-4">İlanlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="font-bold text-2xl md:text-3xl text-[#2C3E50]">Öne Çıkan İlanlar</h2>
            <p className="text-[#7F8C8D] mt-2">Emlak piyasasında şu anda öne çıkan fırsatlar</p>
          </div>
          <Link href="/listings">
            <a className="hidden md:flex items-center text-[#3498DB] hover:text-[#5DADE2] font-medium">
              <span>Tümünü Gör</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="w-full h-56" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex justify-between mb-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Skeleton className="h-8 w-8 rounded-full mr-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            featuredListings?.map(listing => (
              <PropertyCard key={listing.id} listing={listing} />
            ))
          )}
        </div>
        
        <div className="text-center mt-8 md:hidden">
          <Link href="/listings">
            <Button variant="link" className="inline-flex items-center text-[#3498DB] hover:text-[#5DADE2] font-medium">
              <span>Tümünü Gör</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
