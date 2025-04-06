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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, MapPin, SquareStack, Home, DollarSign, Bath, Car, Thermometer, Compass, Sparkles, Search, Square } from "lucide-react";
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
    <div className="bg-white rounded-md shadow-sm border border-[#E5E5E5]">
      <div className="px-4 py-3 border-b border-[#E5E5E5]">
        <h3 className="text-base font-medium flex items-center">
          <Search className="mr-2 h-4 w-4 text-[#3498DB]" />
          Filtreler
        </h3>
      </div>
      
      <div className="p-0 divide-y divide-[#E5E5E5]">
        {/* Emlak Tipi - Satılık */}
        <div className="px-4 py-3">
          <h4 className="font-medium text-sm mb-2">Satılık</h4>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {propertyTypesLoading ? (
              <div className="col-span-2 space-y-2">
                <Skeleton className="h-6 w-full" />
              </div>
            ) : propertyTypes?.slice(0, 6).map(type => (
              <div 
                key={`sell-${type.id}`} 
                className={`border rounded px-2 py-1 cursor-pointer text-sm flex justify-between items-center ${filters.propertyTypeId === type.id.toString() && filters.listingType === 'sell' ? 'border-[#3498DB] bg-[#EBF5FB]' : 'border-[#E5E5E5]'}`}
                onClick={() => {
                  handleInputChange('propertyTypeId', filters.propertyTypeId === type.id.toString() && filters.listingType === 'sell' ? '' : type.id.toString())
                  handleInputChange('listingType', 'sell')
                }}
              >
                <span>{type.name}</span>
                <span className="text-xs text-gray-500">({Math.floor(type.listingCount * 0.6)})</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Emlak Tipi - Kiralık */}
        <div className="px-4 py-3 border-t border-[#E5E5E5]">
          <h4 className="font-medium text-sm mb-2">Kiralık</h4>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {propertyTypesLoading ? (
              <div className="col-span-2 space-y-2">
                <Skeleton className="h-6 w-full" />
              </div>
            ) : propertyTypes?.slice(0, 6).map(type => (
              <div 
                key={`rent-${type.id}`} 
                className={`border rounded px-2 py-1 cursor-pointer text-sm flex justify-between items-center ${filters.propertyTypeId === type.id.toString() && filters.listingType === 'rent' ? 'border-[#3498DB] bg-[#EBF5FB]' : 'border-[#E5E5E5]'}`}
                onClick={() => {
                  handleInputChange('propertyTypeId', filters.propertyTypeId === type.id.toString() && filters.listingType === 'rent' ? '' : type.id.toString())
                  handleInputChange('listingType', 'rent')
                }}
              >
                <span>{type.name}</span>
                <span className="text-xs text-gray-500">({Math.floor(type.listingCount * 0.3)})</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Emlak Tipi - Günlük Kiralık */}
        <div className="px-4 py-3 border-t border-[#E5E5E5]">
          <h4 className="font-medium text-sm mb-2">Günlük Kiralık</h4>
          <div className="grid grid-cols-2 gap-2">
            {propertyTypesLoading ? (
              <div className="col-span-2 space-y-2">
                <Skeleton className="h-6 w-full" />
              </div>
            ) : propertyTypes?.slice(0, 4).map(type => (
              <div 
                key={`daily-${type.id}`} 
                className={`border rounded px-2 py-1 cursor-pointer text-sm flex justify-between items-center ${filters.propertyTypeId === type.id.toString() && filters.listingType === 'daily' ? 'border-[#3498DB] bg-[#EBF5FB]' : 'border-[#E5E5E5]'}`}
                onClick={() => {
                  handleInputChange('propertyTypeId', filters.propertyTypeId === type.id.toString() && filters.listingType === 'daily' ? '' : type.id.toString())
                  handleInputChange('listingType', 'daily')
                }}
              >
                <span>{type.name}</span>
                <span className="text-xs text-gray-500">({Math.floor(type.listingCount * 0.1)})</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Adres */}
        <div className="px-4 py-3">
          <h4 className="font-medium text-sm mb-2">Adres</h4>
          <div className="space-y-2">
            <Select onValueChange={(value) => handleInputChange('cityId', value)}>
              <SelectTrigger className="w-full border-[#E5E5E5]">
                <SelectValue placeholder="İl" />
              </SelectTrigger>
              <SelectContent>
                {cities?.map(city => (
                  <SelectItem key={city.id} value={city.id.toString()}>{city.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-full border-[#E5E5E5]">
                <SelectValue placeholder="İlçe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder">İlçe seçimi için önce il seçin</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-full border-[#E5E5E5]">
                <SelectValue placeholder="Mahalle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder">Mahalle seçimi için önce ilçe seçin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Fiyat */}
        <div className="px-4 py-3">
          <h4 className="font-medium text-sm mb-2">Fiyat</h4>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="text"
              placeholder="min TL"
              value={filters.minPrice || ''}
              onChange={(e) => handleInputChange('minPrice', e.target.value)}
              className="border-[#E5E5E5]"
            />
            
            <Input
              type="text"
              placeholder="max TL"
              value={filters.maxPrice || ''}
              onChange={(e) => handleInputChange('maxPrice', e.target.value)}
              className="border-[#E5E5E5]"
            />
          </div>
        </div>
        
        {/* m2 (Brüt) */}
        <div className="px-4 py-3">
          <h4 className="font-medium text-sm mb-2">m² (Brüt)</h4>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="text"
              placeholder="min"
              value={filters.minSquareMeters || ''}
              onChange={(e) => handleInputChange('minSquareMeters', e.target.value)}
              className="border-[#E5E5E5]"
            />
            
            <Input
              type="text"
              placeholder="max"
              value={filters.maxSquareMeters || ''}
              onChange={(e) => handleInputChange('maxSquareMeters', e.target.value)}
              className="border-[#E5E5E5]"
            />
          </div>
        </div>
        
        {/* m2 (Net) */}
        <div className="px-4 py-3">
          <h4 className="font-medium text-sm mb-2">m² (Net)</h4>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="text"
              placeholder="min"
              className="border-[#E5E5E5]"
            />
            
            <Input
              type="text"
              placeholder="max"
              className="border-[#E5E5E5]"
            />
          </div>
        </div>
        
        {/* Oda Sayısı */}
        <div className="px-4 py-3">
          <h4 className="font-medium text-sm mb-2">Oda Sayısı</h4>
          <div className="grid grid-cols-3 gap-2">
            {["1+0", "1+1", "2+1", "3+1", "4+1", "5+"].map((value) => (
              <Button
                key={value}
                variant={filters.roomCount === value.toString() ? "default" : "outline"}
                className={`w-full text-xs py-1 px-2 h-auto ${filters.roomCount === value.toString() ? 'bg-[#3498DB] hover:bg-[#5DADE2]' : 'border-[#E5E5E5]'}`}
                onClick={() => handleInputChange('roomCount', value.toString())}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>
        

        
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
        
        {/* Bina Yaşı */}
        <div className="px-4 py-3">
          <h4 className="font-medium text-sm mb-2">Bina Yaşı</h4>
          <div className="grid grid-cols-3 gap-2">
            {["0", "1-5", "6-10", "11-15", "16-20", "21+"].map((value) => (
              <Button
                key={value}
                variant={filters.buildingAge === value ? "default" : "outline"}
                className={`w-full text-xs py-1 px-2 h-auto ${filters.buildingAge === value ? 'bg-[#3498DB] hover:bg-[#5DADE2]' : 'border-[#E5E5E5]'}`}
                onClick={() => handleInputChange('buildingAge', value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Kat Sayısı */}
        <div className="px-4 py-3">
          <h4 className="font-medium text-sm mb-2">Bulunduğu Kat</h4>
          <div className="grid grid-cols-3 gap-2">
            {["1-3", "4-6", "7-10", "11+", "Bahçe", "Çatı"].map((value) => (
              <Button
                key={value}
                variant={filters.floorNumber === value ? "default" : "outline"}
                className={`w-full text-xs py-1 px-2 h-auto ${filters.floorNumber === value ? 'bg-[#3498DB] hover:bg-[#5DADE2]' : 'border-[#E5E5E5]'}`}
                onClick={() => handleInputChange('floorNumber', value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Isıtma */}
        <div className="px-4 py-3">
          <h4 className="font-medium text-sm mb-2">Isıtma</h4>
          <div className="grid grid-cols-2 gap-2">
            {["Doğalgaz", "Merkezi", "Kombi", "Klima", "Soba", "Yerden Isıtma"].map((value) => (
              <Button
                key={value}
                variant={filters.heatingType === value ? "default" : "outline"}
                className={`w-full text-xs py-1 px-2 h-auto ${filters.heatingType === value ? 'bg-[#3498DB] hover:bg-[#5DADE2]' : 'border-[#E5E5E5]'}`}
                onClick={() => handleInputChange('heatingType', value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Eşyalı */}
        <div className="px-4 py-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isFurnished"
              checked={filters.isFurnished === "true"}
              onCheckedChange={(checked) => handleInputChange('isFurnished', checked ? "true" : "")}
            />
            <Label htmlFor="isFurnished" className="cursor-pointer">Eşyalı</Label>
          </div>
        </div>
        
        {/* İlan Tarihi */}
        <div className="px-4 py-3">
          <h4 className="font-medium text-sm mb-2">İlan Tarihi</h4>
          <div className="grid grid-cols-2 gap-2">
            {["Son 24 Saat", "Son 3 Gün", "Son 1 Hafta", "Son 1 Ay"].map((value) => (
              <Button
                key={value}
                variant={filters.createdAfter === value ? "default" : "outline"}
                className={`w-full text-xs py-1 px-2 h-auto ${filters.createdAfter === value ? 'bg-[#3498DB] hover:bg-[#5DADE2]' : 'border-[#E5E5E5]'}`}
                onClick={() => handleInputChange('createdAfter', value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Filtreleme Butonları */}
        <div className="px-4 py-3">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1 border-[#E5E5E5] text-[#3498DB]"
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
          <p className="text-xs text-center mt-2 text-gray-500">
            <a href="#" className="text-[#3498DB] hover:underline">Detaylı arama için tıklayın</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListingFilter;
