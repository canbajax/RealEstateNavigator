import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building, MapPin, SquareStack, Home } from "lucide-react";
import { type PropertyType, type City } from "@shared/schema";

interface ListingFilterProps {
  currentFilters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
}

const ListingFilter = ({ currentFilters, onFilterChange }: ListingFilterProps) => {
  // Local state for filters
  const [filters, setFilters] = useState<Record<string, string>>(currentFilters);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [areaRange, setAreaRange] = useState<number[]>([0, 100]);

  // Fetch property types and cities
  const { data: propertyTypes, isLoading: propertyTypesLoading } = useQuery<PropertyType[]>({
    queryKey: ["/api/property-types"],
  });

  const { data: cities, isLoading: citiesLoading } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  // Update local state when props change
  useEffect(() => {
    setFilters(currentFilters);
    
    // Set price range slider values
    if (currentFilters.minPrice || currentFilters.maxPrice) {
      const maxPossiblePrice = 50000000; // 50 million
      const minPrice = currentFilters.minPrice ? parseInt(currentFilters.minPrice) : 0;
      const maxPrice = currentFilters.maxPrice ? parseInt(currentFilters.maxPrice) : maxPossiblePrice;
      
      setPriceRange([
        Math.round((minPrice / maxPossiblePrice) * 100),
        Math.round((maxPrice / maxPossiblePrice) * 100)
      ]);
    } else {
      setPriceRange([0, 100]);
    }
    
    // Set area range slider values
    if (currentFilters.minSquareMeters || currentFilters.maxSquareMeters) {
      const maxPossibleArea = 1000; // 1000 m²
      const minArea = currentFilters.minSquareMeters ? parseInt(currentFilters.minSquareMeters) : 0;
      const maxArea = currentFilters.maxSquareMeters ? parseInt(currentFilters.maxSquareMeters) : maxPossibleArea;
      
      setAreaRange([
        Math.round((minArea / maxPossibleArea) * 100),
        Math.round((maxArea / maxPossibleArea) * 100)
      ]);
    } else {
      setAreaRange([0, 100]);
    }
  }, [currentFilters]);

  // Handle input changes
  const handleInputChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle price range changes
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
    
    // Convert slider percentage to actual price values
    const maxPossiblePrice = 50000000; // 50 million
    const minPrice = Math.round((value[0] / 100) * maxPossiblePrice);
    const maxPrice = Math.round((value[1] / 100) * maxPossiblePrice);
    
    setFilters(prev => ({
      ...prev,
      minPrice: minPrice > 0 ? minPrice.toString() : '',
      maxPrice: maxPrice < maxPossiblePrice ? maxPrice.toString() : ''
    }));
  };

  // Handle area range changes
  const handleAreaRangeChange = (value: number[]) => {
    setAreaRange(value);
    
    // Convert slider percentage to actual area values
    const maxPossibleArea = 1000; // 1000 m²
    const minArea = Math.round((value[0] / 100) * maxPossibleArea);
    const maxArea = Math.round((value[1] / 100) * maxPossibleArea);
    
    setFilters(prev => ({
      ...prev,
      minSquareMeters: minArea > 0 ? minArea.toString() : '',
      maxSquareMeters: maxArea < maxPossibleArea ? maxArea.toString() : ''
    }));
  };

  // Apply filters
  const applyFilters = () => {
    onFilterChange(filters);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({});
    setPriceRange([0, 100]);
    setAreaRange([0, 100]);
    onFilterChange({});
  };

  // Format price for display
  const formatPrice = (value: number) => {
    const maxPossiblePrice = 50000000; // 50 million
    const price = Math.round((value / 100) * maxPossiblePrice);
    return new Intl.NumberFormat('tr-TR').format(price);
  };

  // Format area for display
  const formatArea = (value: number) => {
    const maxPossibleArea = 1000; // 1000 m²
    const area = Math.round((value / 100) * maxPossibleArea);
    return area;
  };

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <SquareStack className="mr-2 h-5 w-5 text-[#3498DB]" />
          Filtreleme
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Listing Type */}
        <div>
          <h3 className="font-medium mb-3 flex items-center">
            <Home className="mr-2 h-4 w-4 text-[#3498DB]" />
            İlan Türü
          </h3>
          <RadioGroup 
            value={filters.listingType || ''} 
            onValueChange={(value) => handleInputChange('listingType', value)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sell" id="sell" />
              <Label htmlFor="sell" className="cursor-pointer">Satılık</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rent" id="rent" />
              <Label htmlFor="rent" className="cursor-pointer">Kiralık</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily" className="cursor-pointer">Günlük Kiralık</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Property Type */}
        <Accordion type="single" collapsible defaultValue="propertyType">
          <AccordionItem value="propertyType" className="border-none">
            <AccordionTrigger className="py-3 px-0">
              <span className="font-medium flex items-center">
                <Building className="mr-2 h-4 w-4 text-[#3498DB]" />
                Emlak Tipi
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              {propertyTypesLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                propertyTypes?.map(type => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`propertyType-${type.id}`} 
                      checked={filters.propertyTypeId === type.id.toString()}
                      onCheckedChange={(checked) => {
                        handleInputChange('propertyTypeId', checked ? type.id.toString() : '');
                      }}
                    />
                    <Label 
                      htmlFor={`propertyType-${type.id}`}
                      className="cursor-pointer"
                    >
                      {type.name} ({type.listingCount})
                    </Label>
                  </div>
                ))
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Location */}
        <Accordion type="single" collapsible defaultValue="location">
          <AccordionItem value="location" className="border-none">
            <AccordionTrigger className="py-3 px-0">
              <span className="font-medium flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-[#3498DB]" />
                Konum
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              {citiesLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                cities?.map(city => (
                  <div key={city.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`city-${city.id}`} 
                      checked={filters.cityId === city.id.toString()}
                      onCheckedChange={(checked) => {
                        handleInputChange('cityId', checked ? city.id.toString() : '');
                      }}
                    />
                    <Label 
                      htmlFor={`city-${city.id}`}
                      className="cursor-pointer"
                    >
                      {city.name} ({city.listingCount})
                    </Label>
                  </div>
                ))
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Price Range */}
        <Accordion type="single" collapsible defaultValue="price">
          <AccordionItem value="price" className="border-none">
            <AccordionTrigger className="py-3 px-0">
              <span className="font-medium">Fiyat Aralığı</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#7F8C8D] mb-5">
                    ₺{formatPrice(priceRange[0])} - ₺{formatPrice(priceRange[1])}
                  </p>
                  <Slider
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="minPrice" className="text-xs">Min Fiyat</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      placeholder="Min ₺"
                      value={filters.minPrice || ''}
                      onChange={(e) => handleInputChange('minPrice', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPrice" className="text-xs">Max Fiyat</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      placeholder="Max ₺"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Area Range */}
        <Accordion type="single" collapsible>
          <AccordionItem value="area" className="border-none">
            <AccordionTrigger className="py-3 px-0">
              <span className="font-medium">Alan (m²)</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#7F8C8D] mb-5">
                    {formatArea(areaRange[0])}m² - {formatArea(areaRange[1])}m²
                  </p>
                  <Slider
                    value={areaRange}
                    onValueChange={handleAreaRangeChange}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="minArea" className="text-xs">Min Alan</Label>
                    <Input
                      id="minArea"
                      type="number"
                      placeholder="Min m²"
                      value={filters.minSquareMeters || ''}
                      onChange={(e) => handleInputChange('minSquareMeters', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxArea" className="text-xs">Max Alan</Label>
                    <Input
                      id="maxArea"
                      type="number"
                      placeholder="Max m²"
                      value={filters.maxSquareMeters || ''}
                      onChange={(e) => handleInputChange('maxSquareMeters', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Bedrooms */}
        <Accordion type="single" collapsible>
          <AccordionItem value="bedrooms" className="border-none">
            <AccordionTrigger className="py-3 px-0">
              <span className="font-medium">Oda Sayısı</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, "5+"].map((value) => (
                  <Button
                    key={value}
                    variant={filters.roomCount === value.toString() ? "default" : "outline"}
                    className={`w-full ${filters.roomCount === value.toString() ? 'bg-[#3498DB] hover:bg-[#5DADE2]' : ''}`}
                    onClick={() => handleInputChange('roomCount', value.toString())}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={resetFilters}
          >
            Temizle
          </Button>
          <Button 
            className="flex-1 bg-[#3498DB] hover:bg-[#5DADE2]"
            onClick={applyFilters}
          >
            Filtrele
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingFilter;
