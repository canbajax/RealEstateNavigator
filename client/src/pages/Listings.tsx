import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import PropertyCard from "@/components/PropertyCard";
import ListingFilter from "@/components/ListingFilter";
import { type Listing } from "@shared/schema";
import { ChevronRight } from "lucide-react";

const Listings = () => {
  const [location] = useLocation();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const itemsPerPage = 12;

  // Parse query parameters
  useEffect(() => {
    const queryString = location.split('?')[1];
    if (!queryString) return;
    
    const searchParams = new URLSearchParams(queryString);
    const currentFilters: Record<string, string> = {};
    
    // URLSearchParams.entries() uyumluluğu için alternatif yaklaşım
    searchParams.forEach((value, key) => {
      // Özel işleme - 'type' parametresi için 'listingType' kullan
      if (key === 'type') {
        currentFilters['listingType'] = value;
      } else {
        currentFilters[key] = value;
      }
    });
    
    console.log("URL parametreleri:", queryString);
    console.log("Parsed filters:", currentFilters);
    
    setFilters(currentFilters);
  }, [location]);

  // Construct API query parameters
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (key === 'type') {
      queryParams.append('listingType', value);
    } else {
      queryParams.append(key, value);
    }
  });

  // Debug için parametreleri yazdır
  console.log("Listings sayfası arama parametreleri:", queryParams.toString());

  // Fetch listings based on current filters
  const { data: allListings, isLoading, error } = useQuery<Listing[]>({
    queryKey: [`/api/listings?${queryParams.toString()}`],
  });

  // Calculate pagination
  const totalItems = allListings?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedListings = allListings?.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Handle filter changes
  const handleFilterChange = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    
    window.history.replaceState(null, '', `?${params.toString()}`);
    setFilters(newFilters);
    setPage(1); // Reset to first page on filter change
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine active filters for display
  const activeFilterCount = Object.values(filters).filter(v => v).length;
  const listingTypeLabel = filters.listingType === 'sell' ? 'Satılık' : filters.listingType === 'rent' ? 'Kiralık' : '';

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Page Header */}
      <div className="bg-[#2C3E50] py-12 px-4 sm:px-6 lg:px-8 text-white">
        <div className="container mx-auto">
          <h1 className="font-bold text-3xl md:text-4xl mb-4">
            {listingTypeLabel ? `${listingTypeLabel} Emlak İlanları` : "Tüm Emlak İlanları"}
          </h1>
          <div className="flex items-center text-sm">
            <a href="/" className="hover:text-[#3498DB]">Anasayfa</a>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="text-[#3498DB]">İlanlar</span>
            {listingTypeLabel && (
              <>
                <ChevronRight className="mx-2 h-4 w-4" />
                <span className="text-[#3498DB]">{listingTypeLabel}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <ListingFilter currentFilters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Listings Grid */}
          <div className="lg:col-span-3">
            {/* Results Summary */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
              <div>
                <p className="text-[#7F8C8D]">
                  <span className="font-medium">{allListings ? allListings.length : 0}</span> ilan bulundu
                  {activeFilterCount > 0 && ` (${activeFilterCount} filtre aktif)`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-[#7F8C8D]">Sırala:</span>
                <select 
                  className="border border-[#BDC3C7] rounded-md p-2 text-sm"
                  onChange={(e) => {
                    const newFilters = { ...filters, sort: e.target.value };
                    handleFilterChange(newFilters);
                  }}
                >
                  <option value="newest">En Yeni</option>
                  <option value="priceLow">Fiyat (Düşükten Yükseğe)</option>
                  <option value="priceHigh">Fiyat (Yüksekten Düşüğe)</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              // Loading skeletons
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, index) => (
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
                ))}
              </div>
            ) : error ? (
              // Error state
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <h3 className="text-xl font-semibold text-[#E74C3C]">İlanlar yüklenirken bir hata oluştu</h3>
                <p className="mt-2 text-[#7F8C8D]">Lütfen daha sonra tekrar deneyiniz.</p>
                <Button 
                  className="mt-4 bg-[#3498DB] hover:bg-[#5DADE2]"
                  onClick={() => window.location.reload()}
                >
                  Yeniden Dene
                </Button>
              </div>
            ) : paginatedListings?.length === 0 ? (
              // Empty state
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <h3 className="text-xl font-semibold text-[#2C3E50]">Bu kriterlere uygun ilan bulunamadı</h3>
                <p className="mt-2 text-[#7F8C8D]">Lütfen farklı filtreler deneyiniz.</p>
                <Button 
                  className="mt-4 bg-[#3498DB] hover:bg-[#5DADE2]"
                  onClick={() => handleFilterChange({})}
                >
                  Filtreleri Temizle
                </Button>
              </div>
            ) : (
              // Listings grid
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedListings?.map(listing => (
                    <PropertyCard key={listing.id} listing={listing} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              if (page > 1) handlePageChange(page - 1);
                            }}
                            className={page === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNumber;
                          
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (page <= 3) {
                            pageNumber = i + 1;
                          } else if (page >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = page - 2 + i;
                          }
                          
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink 
                                href="#" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(pageNumber);
                                }}
                                isActive={pageNumber === page}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        {totalPages > 5 && page < totalPages - 2 && (
                          <>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink 
                                href="#" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(totalPages);
                                }}
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}
                        
                        <PaginationItem>
                          <PaginationNext 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              if (page < totalPages) handlePageChange(page + 1);
                            }}
                            className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
