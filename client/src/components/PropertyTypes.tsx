import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyTypeCard from "@/components/PropertyTypeCard";
import { type PropertyType } from "@shared/schema";

const PropertyTypes = () => {
  const { data: propertyTypes, isLoading, error } = useQuery<PropertyType[]>({
    queryKey: ["/api/property-types"],
  });

  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="font-bold text-2xl md:text-3xl text-[#2C3E50]">Emlak Kategorileri</h2>
            <p className="text-[#7F8C8D] mt-4">Kategoriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-bold text-2xl md:text-3xl text-[#2C3E50]">Emlak Kategorileri</h2>
          <p className="text-[#7F8C8D] mt-2 max-w-3xl mx-auto">
            İhtiyacınıza uygun emlak türünü seçin ve size özel ilanları keşfedin
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-[#ECF0F1] rounded-lg p-6 text-center">
                <Skeleton className="h-8 w-8 mx-auto mb-4 rounded-full" />
                <Skeleton className="h-5 w-20 mx-auto mb-2" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            ))
          ) : (
            propertyTypes?.map(propertyType => (
              <PropertyTypeCard key={propertyType.id} propertyType={propertyType} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PropertyTypes;
