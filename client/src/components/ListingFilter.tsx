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
        {/* Ana Kategoriler: Satılık, Kiralık, Günlük Kiralık */}
        <div className="px-4 py-3">
          <div className="grid grid-cols-3 gap-2 mb-2">
            <Button
              variant={filters.listingType === 'sell' ? "default" : "outline"}
              className={`w-full ${filters.listingType === 'sell' ? 'bg-[#3498DB] hover:bg-[#5DADE2]' : 'border-[#E5E5E5]'}`}
              onClick={() => handleInputChange('listingType', filters.listingType === 'sell' ? '' : 'sell')}
            >
              Satılık
            </Button>
            <Button
              variant={filters.listingType === 'rent' ? "default" : "outline"}
              className={`w-full ${filters.listingType === 'rent' ? 'bg-[#3498DB] hover:bg-[#5DADE2]' : 'border-[#E5E5E5]'}`}
              onClick={() => handleInputChange('listingType', filters.listingType === 'rent' ? '' : 'rent')}
            >
              Kiralık
            </Button>
            <Button
              variant={filters.listingType === 'daily' ? "default" : "outline"}
              className={`w-full ${filters.listingType === 'daily' ? 'bg-[#3498DB] hover:bg-[#5DADE2]' : 'border-[#E5E5E5]'}`}
              onClick={() => handleInputChange('listingType', filters.listingType === 'daily' ? '' : 'daily')}
            >
              Günlük
            </Button>
          </div>
        </div>
        
        {/* Emlak Tipi - Dinamik olarak listingType'a göre gösterilir */}
        <div className="px-4 py-3">
          <h4 className="font-medium text-sm mb-2">Emlak Tipi</h4>
          <div className="grid grid-cols-2 gap-2">
            {propertyTypesLoading ? (
              <div className="col-span-2 space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              propertyTypes?.slice(0, 8).map(type => (
                <div 
                  key={type.id} 
                  className={`border rounded px-2 py-1 cursor-pointer text-sm flex justify-between items-center ${filters.propertyTypeId === type.id.toString() ? 'border-[#3498DB] bg-[#EBF5FB]' : 'border-[#E5E5E5]'}`}
                  onClick={() => handleInputChange('propertyTypeId', filters.propertyTypeId === type.id.toString() ? '' : type.id.toString())}
                >
                  <span>{type.name}</span>
                  <span className="text-xs text-gray-500">({type.listingCount})</span>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Konum / Adres */}
        <div className="px-4 py-3">
          <h4 className="font-medium text-sm mb-2">Konum</h4>
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
          <div className="grid grid-cols-2 gap-2 mb-2">
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
          <div>
            <p className="text-xs text-[#7F8C8D] mb-2">
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
        </div>
        
        {/* m² (Alanlar) */}
        <div className="px-4 py-3">
          <h4 className="font-medium text-sm mb-2">m² (Alan)</h4>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Input
              type="text"
              placeholder="min m²"
              value={filters.minSquareMeters || ''}
              onChange={(e) => handleInputChange('minSquareMeters', e.target.value)}
              className="border-[#E5E5E5]"
            />
            
            <Input
              type="text"
              placeholder="max m²"
              value={filters.maxSquareMeters || ''}
              onChange={(e) => handleInputChange('maxSquareMeters', e.target.value)}
              className="border-[#E5E5E5]"
            />
          </div>
          <div>
            <p className="text-xs text-[#7F8C8D] mb-2">
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
        
        {/* Bulunduğu Kat */}
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
        
        {/* Özellikler */}
        <div className="px-4 py-3">
          <h4 className="font-medium text-sm mb-2">Özellikler</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isFurnished"
                checked={filters.isFurnished === "true"}
                onCheckedChange={(checked) => handleInputChange('isFurnished', checked ? "true" : "")}
              />
              <Label htmlFor="isFurnished" className="cursor-pointer text-sm">Eşyalı</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasBalcony"
                checked={filters.hasBalcony === "true"}
                onCheckedChange={(checked) => handleInputChange('hasBalcony', checked ? "true" : "")}
              />
              <Label htmlFor="hasBalcony" className="cursor-pointer text-sm">Balkonlu</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasElevator"
                checked={filters.hasElevator === "true"}
                onCheckedChange={(checked) => handleInputChange('hasElevator', checked ? "true" : "")}
              />
              <Label htmlFor="hasElevator" className="cursor-pointer text-sm">Asansörlü</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasParking"
                checked={filters.hasParking === "true"}
                onCheckedChange={(checked) => handleInputChange('hasParking', checked ? "true" : "")}
              />
              <Label htmlFor="hasParking" className="cursor-pointer text-sm">Otopark</Label>
            </div>
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
