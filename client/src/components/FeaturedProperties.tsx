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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0F172A]/5 to-[#1E293B]/10">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-1 h-10 bg-gradient-to-b from-[#3498DB] to-[#5DADE2] mr-4"></div>
              <h2 className="font-bold text-3xl md:text-4xl text-[#0F172A]">
                Öne Çıkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3498DB] to-[#5DADE2]">Emlak</span> Fırsatları
              </h2>
            </div>
            <p className="text-[#7F8C8D] mb-4 md:mb-0 md:max-w-lg mt-2">
              Yapay zeka algoritmaları ile kişiselleştirilmiş emlak önerileri. Sizin için en uygun konum ve özelliklere sahip mülkleri keşfedin.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 md:mt-0 mt-4">
            <Link href="/listings">
              <a className="group flex items-center justify-center bg-gradient-to-r from-[#3498DB] to-[#5DADE2] hover:from-[#5DADE2] hover:to-[#3498DB] text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                <span>Tüm İlanları Gör</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Link>
            <div className="flex space-x-2">
              <button onClick={() => setActiveTab('sell')} className={`px-4 py-2 rounded-lg flex items-center justify-center transition-all ${activeTab === 'sell' ? 'bg-[#3498DB]/20 text-[#3498DB] font-medium' : 'bg-white/50 text-[#64748b] hover:bg-white/80'}`}>
                <Building className="mr-1.5 h-4 w-4" />
                <span>Satılık</span>
              </button>
              <button onClick={() => setActiveTab('rent')} className={`px-4 py-2 rounded-lg flex items-center justify-center transition-all ${activeTab === 'rent' ? 'bg-[#3498DB]/20 text-[#3498DB] font-medium' : 'bg-white/50 text-[#64748b] hover:bg-white/80'}`}>
                <Home className="mr-1.5 h-4 w-4" />
                <span>Kiralık</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* We're not using Tabs component anymore, since we have direct buttons now */}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-xl">
                <Skeleton className="w-full h-60" />
                <div className="p-5">
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
                    <Skeleton className="h-5 w-16 rounded-full" />
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
              <div className="col-span-full text-center py-16 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3498DB]">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <p className="text-[#2C3E50] font-medium text-lg">Bu kategoride öne çıkan ilan bulunamadı</p>
                <p className="text-[#7F8C8D] mt-2">Lütfen farklı bir kategori seçin veya tüm ilanları görüntüleyin</p>
                <Button 
                  className="mt-4 bg-[#3498DB] hover:bg-[#5DADE2] text-white"
                  onClick={() => setActiveTab('all')}
                >
                  Tüm İlanları Göster
                </Button>
              </div>
            )
          )}
        </div>
        
        {!isLoading && filteredListings.length > 0 && (
          <div className="text-center mt-16">
            <Link href={`/listings?listingType=${activeTab === 'all' ? '' : activeTab === 'sell' ? 'sell' : 'rent'}`}>
              <Button 
                className="bg-gradient-to-r from-[#3498DB] to-[#5DADE2] hover:from-[#5DADE2] hover:to-[#3498DB] text-white px-8 py-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <span className="text-lg">Tüm Emlak Fırsatlarını Keşfedin</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
