import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard from "@/components/PropertyCard";
import { ArrowRight, Building, Home, Star } from "lucide-react";
import { type Listing } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const FeaturedProperties = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'sell' | 'rent'>('all');
  
  const { data: featuredListings, isLoading, error } = useQuery<Listing[]>({
    queryKey: ["/api/featured-listings"],
  });

  const filteredListings = featuredListings ? 
    (activeTab === 'all' 
      ? featuredListings 
      : featuredListings.filter(listing => 
          activeTab === 'sell' 
            ? listing.listingType === 'sell' 
            : (listing.listingType === 'rent' || listing.listingType === 'daily')
        )
    ) : [];
  
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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center mb-2">
              <Star className="text-amber-500 w-5 h-5 mr-2" />
              <h2 className="font-bold text-2xl md:text-3xl text-[#2C3E50]">Öne Çıkan İlanlar</h2>
            </div>
            <p className="text-gray-600 mb-4 md:mb-0">Emlak danışmanlarımız tarafından özenle seçilmiş özel fırsatlar</p>
          </div>
          <Link href="/listings">
            <a className="group flex items-center text-[#3498DB] hover:text-[#5DADE2] font-medium border border-[#3498DB] hover:bg-[#3498DB] hover:text-white px-4 py-2 rounded-md transition-colors">
              <span>Tüm İlanları Gör</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Link>
        </div>
        
        {/* Filtering tabs */}
        <div className="mb-8">
          <Tabs defaultValue="all" onValueChange={(val) => setActiveTab(val as 'all' | 'sell' | 'rent')}>
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 bg-white border">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-[#3498DB] data-[state=active]:text-white"
              >
                <Star className="mr-2 h-4 w-4" />
                Tümü
              </TabsTrigger>
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
            </TabsList>
          </Tabs>
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
            filteredListings.length > 0 ? (
              filteredListings.map(listing => (
                <PropertyCard key={listing.id} listing={listing} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">Bu kategoride öne çıkan ilan bulunamadı.</p>
              </div>
            )
          )}
        </div>
        
        {!isLoading && filteredListings.length > 0 && (
          <div className="text-center mt-10">
            <Link href={`/listings?listingType=${activeTab === 'all' ? '' : activeTab === 'sell' ? 'sell' : 'rent'}`}>
              <Button 
                variant="outline"
                className="inline-flex items-center text-[#3498DB] hover:text-white hover:bg-[#3498DB] border-[#3498DB] font-medium transition-colors"
              >
                <span>Daha Fazla İlan</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
