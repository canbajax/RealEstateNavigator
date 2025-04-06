import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

interface LocationSearchBoxProps {
  onSelect?: (location: { type: 'city' | 'district' | 'neighborhood', id?: number, name: string, cityId?: number, cityName?: string }) => void;
  placeholder?: string;
  className?: string;
}

// Lokasyon türleri
type LocationType = 'city' | 'district' | 'neighborhood';
type Location = {
  type: LocationType;
  id?: number;
  name: string;
  cityId?: number;
  cityName?: string;
};

const LocationSearchBox = ({ 
  onSelect, 
  placeholder = "İl, ilçe veya mahalle", 
  className = "" 
}: LocationSearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock veri - Gerçek uygulamada API'dan alınacak
  const cities = [
    { id: 1, name: "İstanbul" },
    { id: 2, name: "Ankara" },
    { id: 3, name: "İzmir" },
    { id: 4, name: "Antalya" },
    { id: 5, name: "Bursa" },
    { id: 6, name: "Muğla" },
    { id: 7, name: "Eskişehir" },
    { id: 8, name: "Aydın" },
    { id: 9, name: "Trabzon" },
    { id: 10, name: "Konya" },
  ];

  // Mock ilçeler - Gerçek uygulamada API'dan alınacak
  const districts = [
    { id: 1, cityId: 1, name: "Kadıköy" },
    { id: 2, cityId: 1, name: "Beşiktaş" },
    { id: 3, cityId: 1, name: "Bakırköy" },
    { id: 4, cityId: 1, name: "Beykoz" },
    { id: 5, cityId: 1, name: "Şişli" },
    { id: 6, cityId: 2, name: "Çankaya" },
    { id: 7, cityId: 2, name: "Keçiören" },
    { id: 8, cityId: 3, name: "Konak" },
    { id: 9, cityId: 3, name: "Karşıyaka" },
    { id: 10, cityId: 4, name: "Konyaaltı" },
  ];

  // Mock mahalleler - Gerçek uygulamada API'dan alınacak
  const neighborhoods = [
    { id: 1, districtId: 1, name: "Caferağa" },
    { id: 2, districtId: 1, name: "Fenerbahçe" },
    { id: 3, districtId: 1, name: "Zühtüpaşa" },
    { id: 4, districtId: 2, name: "Levent" },
    { id: 5, districtId: 2, name: "Bebek" },
    { id: 6, districtId: 3, name: "Yeşilköy" },
    { id: 7, districtId: 4, name: "Anadolu Hisarı" },
    { id: 8, districtId: 6, name: "Kızılay" },
    { id: 9, districtId: 8, name: "Alsancak" },
    { id: 10, districtId: 10, name: "Liman" },
  ];

  // Dışarı tıklandığında dropdown'ı kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Arama terimine göre sonuçları filtrele
  useEffect(() => {
    if (searchTerm.length < 2) {
      setLocations([]);
      return;
    }

    setLoading(true);
    
    // Büyük/küçük harf duyarsız arama
    const term = searchTerm.toLowerCase();
    
    // İlleri filtrele
    const filteredCities = cities
      .filter(city => city.name.toLowerCase().includes(term))
      .map(city => ({ type: 'city' as 'city', id: city.id, name: city.name }));
    
    // İlçeleri filtrele
    const filteredDistricts = districts
      .filter(district => district.name.toLowerCase().includes(term))
      .map(district => {
        const city = cities.find(c => c.id === district.cityId);
        return {
          type: 'district' as 'district',
          id: district.id,
          name: district.name,
          cityId: district.cityId,
          cityName: city?.name
        };
      });
    
    // Mahalleleri filtrele
    const filteredNeighborhoods = neighborhoods
      .filter(neighborhood => neighborhood.name.toLowerCase().includes(term))
      .map(neighborhood => {
        const district = districts.find(d => d.id === neighborhood.districtId);
        const city = district ? cities.find(c => c.id === district.cityId) : undefined;
        return {
          type: 'neighborhood' as 'neighborhood',
          id: neighborhood.id,
          name: neighborhood.name,
          cityId: city?.id,
          cityName: city?.name
        };
      });
    
    // Tüm sonuçları birleştir
    const allResults = [...filteredCities, ...filteredDistricts, ...filteredNeighborhoods];
    
    // Maksimum 10 sonuç göster
    setLocations(allResults.slice(0, 10));
    setLoading(false);
  }, [searchTerm]);

  // Seçim yapıldığında
  const handleSelect = (location: Location) => {
    setSearchTerm(
      location.type === 'city' 
        ? location.name 
        : location.type === 'district' 
          ? `${location.name}, ${location.cityName}` 
          : `${location.name}, ${location.cityName}`
    );
    
    setIsOpen(false);
    
    if (onSelect) {
      onSelect(location);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(e.target.value.length >= 2);
          }}
          onClick={() => setIsOpen(searchTerm.length >= 2)}
          className="pl-10 focus:ring-2 focus:ring-[#3498DB] focus:border-transparent"
        />
        <MapPin className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Aranıyor...</div>
          ) : locations.length > 0 ? (
            <ul className="py-1">
              {locations.map((location, index) => (
                <li 
                  key={`${location.type}-${location.id || index}`}
                  className="px-4 py-2 hover:bg-[#f5f5f5] cursor-pointer"
                  onClick={() => handleSelect(location)}
                >
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-[#3498DB]" />
                    <div>
                      <span className="font-medium">{location.name}</span>
                      {location.type !== 'city' && location.cityName && (
                        <span className="ml-1 text-sm text-muted-foreground">
                          {location.type === 'district' ? `, ${location.cityName}` : `, ${location.cityName}`}
                        </span>
                      )}
                      <span className="ml-1 text-xs text-muted-foreground">
                        {location.type === 'city' ? '(İl)' : location.type === 'district' ? '(İlçe)' : '(Mahalle)'}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : searchTerm.length >= 2 ? (
            <div className="p-4 text-center text-muted-foreground">Sonuç bulunamadı</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default LocationSearchBox;