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
    { id: 11, name: "Adana" },
    { id: 12, name: "Gaziantep" },
    { id: 13, name: "Mersin" },
    { id: 14, name: "Kayseri" },
    { id: 15, name: "Denizli" },
    { id: 16, name: "Sakarya" },
    { id: 17, name: "Samsun" },
    { id: 18, name: "Diyarbakır" },
    { id: 19, name: "Balıkesir" },
    { id: 20, name: "Hatay" },
  ];

  // Mock ilçeler - Gerçek uygulamada API'dan alınacak
  const districts = [
    { id: 1, cityId: 1, name: "Kadıköy" },
    { id: 2, cityId: 1, name: "Beşiktaş" },
    { id: 3, cityId: 1, name: "Bakırköy" },
    { id: 4, cityId: 1, name: "Beykoz" },
    { id: 5, cityId: 1, name: "Şişli" },
    { id: 6, cityId: 1, name: "Ataşehir" },
    { id: 7, cityId: 1, name: "Beylikdüzü" },
    { id: 8, cityId: 1, name: "Kartal" },
    { id: 9, cityId: 1, name: "Maltepe" },
    { id: 10, cityId: 1, name: "Üsküdar" },
    { id: 11, cityId: 2, name: "Çankaya" },
    { id: 12, cityId: 2, name: "Keçiören" },
    { id: 13, cityId: 2, name: "Yenimahalle" },
    { id: 14, cityId: 2, name: "Mamak" },
    { id: 15, cityId: 2, name: "Etimesgut" },
    { id: 16, cityId: 3, name: "Konak" },
    { id: 17, cityId: 3, name: "Karşıyaka" },
    { id: 18, cityId: 3, name: "Bornova" },
    { id: 19, cityId: 3, name: "Çiğli" },
    { id: 20, cityId: 3, name: "Buca" },
    { id: 21, cityId: 4, name: "Konyaaltı" },
    { id: 22, cityId: 4, name: "Muratpaşa" },
    { id: 23, cityId: 4, name: "Kepez" },
    { id: 24, cityId: 4, name: "Lara" },
    { id: 25, cityId: 4, name: "Alanya" },
    { id: 26, cityId: 5, name: "Nilüfer" },
    { id: 27, cityId: 5, name: "Osmangazi" },
    { id: 28, cityId: 5, name: "Yıldırım" },
    { id: 29, cityId: 6, name: "Bodrum" },
    { id: 30, cityId: 6, name: "Marmaris" },
    { id: 31, cityId: 6, name: "Fethiye" },
    { id: 32, cityId: 7, name: "Tepebaşı" },
    { id: 33, cityId: 7, name: "Odunpazarı" },
    { id: 34, cityId: 8, name: "Efeler" },
    { id: 35, cityId: 8, name: "Kuşadası" },
    { id: 36, cityId: 8, name: "Didim" },
  ];

  // Mock mahalleler - Gerçek uygulamada API'dan alınacak
  const neighborhoods = [
    { id: 1, districtId: 1, name: "Caferağa", cityId: 1 },
    { id: 2, districtId: 1, name: "Fenerbahçe", cityId: 1 },
    { id: 3, districtId: 1, name: "Zühtüpaşa", cityId: 1 },
    { id: 4, districtId: 1, name: "Göztepe", cityId: 1 },
    { id: 5, districtId: 1, name: "Kozyatağı", cityId: 1 },
    { id: 6, districtId: 2, name: "Levent", cityId: 1 },
    { id: 7, districtId: 2, name: "Bebek", cityId: 1 },
    { id: 8, districtId: 2, name: "Ortaköy", cityId: 1 },
    { id: 9, districtId: 2, name: "Etiler", cityId: 1 },
    { id: 10, districtId: 2, name: "Arnavutköy", cityId: 1 },
    { id: 11, districtId: 3, name: "Yeşilköy", cityId: 1 },
    { id: 12, districtId: 3, name: "Florya", cityId: 1 },
    { id: 13, districtId: 3, name: "Ataköy", cityId: 1 },
    { id: 14, districtId: 4, name: "Anadolu Hisarı", cityId: 1 },
    { id: 15, districtId: 4, name: "Paşabahçe", cityId: 1 },
    { id: 16, districtId: 5, name: "Nişantaşı", cityId: 1 },
    { id: 17, districtId: 5, name: "Mecidiyeköy", cityId: 1 },
    { id: 18, districtId: 5, name: "Maslak", cityId: 1 },
    { id: 19, districtId: 6, name: "Ataşehir Merkez", cityId: 1 },
    { id: 20, districtId: 6, name: "Batı Ataşehir", cityId: 1 },
    { id: 21, districtId: 7, name: "Beylikdüzü Merkez", cityId: 1 },
    { id: 22, districtId: 7, name: "Adnan Kahveci", cityId: 1 },
    { id: 23, districtId: 8, name: "Kartal Merkez", cityId: 1 },
    { id: 24, districtId: 8, name: "Soğanlık", cityId: 1 },
    { id: 25, districtId: 9, name: "Maltepe Merkez", cityId: 1 },
    { id: 26, districtId: 9, name: "Küçükyalı", cityId: 1 },
    { id: 27, districtId: 10, name: "Üsküdar Merkez", cityId: 1 },
    { id: 28, districtId: 10, name: "Acıbadem", cityId: 1 },
    { id: 29, districtId: 11, name: "Kızılay", cityId: 2 },
    { id: 30, districtId: 11, name: "Çukurambar", cityId: 2 },
    { id: 31, districtId: 12, name: "Etlik", cityId: 2 },
    { id: 32, districtId: 12, name: "Kalaba", cityId: 2 },
    { id: 33, districtId: 16, name: "Alsancak", cityId: 3 },
    { id: 34, districtId: 16, name: "Konak Merkez", cityId: 3 },
    { id: 35, districtId: 17, name: "Karşıyaka Merkez", cityId: 3 },
    { id: 36, districtId: 17, name: "Bostanlı", cityId: 3 },
    { id: 37, districtId: 21, name: "Liman", cityId: 4 },
    { id: 38, districtId: 21, name: "Arapsuyu", cityId: 4 },
    { id: 39, districtId: 22, name: "Fener", cityId: 4 },
    { id: 40, districtId: 22, name: "Meltem", cityId: 4 },
    { id: 41, districtId: 29, name: "Bodrum Merkez", cityId: 6 },
    { id: 42, districtId: 29, name: "Gümbet", cityId: 6 },
    { id: 43, districtId: 30, name: "Marmaris Merkez", cityId: 6 },
    { id: 44, districtId: 30, name: "İçmeler", cityId: 6 },
    { id: 45, districtId: 31, name: "Ölüdeniz", cityId: 6 },
    { id: 46, districtId: 35, name: "Kuşadası Merkez", cityId: 8 },
    { id: 47, districtId: 35, name: "Kadınlar Denizi", cityId: 8 },
    { id: 48, districtId: 36, name: "Didim Merkez", cityId: 8 },
    { id: 49, districtId: 36, name: "Altınkum", cityId: 8 },
    { id: 50, districtId: 25, name: "Lara Merkez", cityId: 4 },
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