import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Heart, 
  Share2, 
  Home, 
  ArrowRight, 
  Ruler, 
  Bed, 
  Bath, 
  Car, 
  ChevronRight
} from "lucide-react";
import { type Listing, type City, type PropertyType } from "@shared/schema";
import ContactForm from "@/components/ContactForm";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState(0);
  
  return (
    <div className="relative">
      <div className="w-full h-[60vh] overflow-hidden rounded-lg mb-4">
        <img 
          src={images[activeImage]} 
          alt="Property Image" 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button 
            key={index}
            className={`w-24 h-16 overflow-hidden rounded-md ${activeImage === index ? 'ring-2 ring-[#3498DB]' : 'opacity-70'}`}
            onClick={() => setActiveImage(index)}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

const ListingDetail = () => {
  const params = useParams();
  const id = params?.id ? parseInt(params.id) : null;
  
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Fetch listing details
  const { data: listing, isLoading: listingLoading, error: listingError } = useQuery<Listing>({
    queryKey: [`/api/listings/${id}`],
    enabled: !!id,
  });

  // Fetch city details
  const { data: city } = useQuery<City>({
    queryKey: [`/api/cities/${listing?.cityId}`],
    enabled: !!listing,
  });

  // Fetch property type details
  const { data: propertyType } = useQuery<PropertyType>({
    queryKey: [`/api/property-types/${listing?.propertyTypeId}`],
    enabled: !!listing,
  });

  // Fetch similar listings
  const { data: similarListings } = useQuery<Listing[]>({
    queryKey: [`/api/listings?propertyTypeId=${listing?.propertyTypeId}&listingType=${listing?.listingType}&limit=3`],
    enabled: !!listing,
  });

  // Format price with thousand separators
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR').format(price);
  };

  // Format date
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (listingLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col space-y-8">
          <Skeleton className="w-full h-[60vh] rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            <div>
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (listingError || !listing) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-[#E74C3C] mb-4">İlan bulunamadı</h2>
          <p className="text-[#7F8C8D] mb-6">
            Aradığınız ilan bulunamadı veya kaldırılmış olabilir.
          </p>
          <Button 
            className="bg-[#3498DB] hover:bg-[#5DADE2]"
            onClick={() => window.history.back()}
          >
            Geri Dön
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Page Header */}
      <div className="bg-[#2C3E50] py-12 px-4 sm:px-6 lg:px-8 text-white">
        <div className="container mx-auto">
          <h1 className="font-bold text-3xl mb-4">{listing.title}</h1>
          <div className="flex items-center text-sm">
            <a href="/" className="hover:text-[#3498DB]">Anasayfa</a>
            <ChevronRight className="mx-2 h-4 w-4" />
            <a href="/listings" className="hover:text-[#3498DB]">İlanlar</a>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="text-[#3498DB]">{listing.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <ImageGallery images={listing.imageUrls} />
            
            {/* Property Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#2C3E50]">{listing.title}</h2>
                  <p className="text-[#7F8C8D] flex items-center mt-2">
                    <MapPin className="h-4 w-4 mr-2 text-[#3498DB]" />
                    {listing.address}, {listing.neighborhood && `${listing.neighborhood}, `}{listing.district}, {city?.name}
                  </p>
                </div>
                <div>
                  <Badge className={`${listing.listingType === 'sell' ? 'bg-[#2C3E50]' : 'bg-[#3498DB]'} text-white px-3 py-1 rounded`}>
                    {listing.listingType === 'sell' ? 'Satılık' : 'Kiralık'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8 border-b border-[#ECF0F1] pb-6">
                <div>
                  <p className="text-3xl font-bold text-[#E74C3C]">
                    {listing.listingType === 'sell' 
                      ? `₺${formatPrice(listing.price)}` 
                      : `₺${formatPrice(listing.price)}/${listing.rentPeriod === 'monthly' ? 'ay' : 'gün'}`
                    }
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center rounded-full"
                    onClick={toggleFavorite}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-[#E74C3C] text-[#E74C3C]' : ''}`} />
                    <span>{isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center rounded-full"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    <span>Paylaş</span>
                  </Button>
                </div>
              </div>
              
              {/* Property Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#ECF0F1] p-4 rounded-md text-center">
                  <p className="text-[#7F8C8D] text-sm">Alan</p>
                  <p className="font-semibold text-[#2C3E50] flex items-center justify-center mt-1">
                    <Ruler className="h-4 w-4 mr-1" />
                    {listing.squareMeters} m²
                  </p>
                </div>
                {listing.roomCount && (
                  <div className="bg-[#ECF0F1] p-4 rounded-md text-center">
                    <p className="text-[#7F8C8D] text-sm">Oda</p>
                    <p className="font-semibold text-[#2C3E50] flex items-center justify-center mt-1">
                      <Bed className="h-4 w-4 mr-1" />
                      {listing.roomCount} Oda
                    </p>
                  </div>
                )}
                {listing.bathroomCount && (
                  <div className="bg-[#ECF0F1] p-4 rounded-md text-center">
                    <p className="text-[#7F8C8D] text-sm">Banyo</p>
                    <p className="font-semibold text-[#2C3E50] flex items-center justify-center mt-1">
                      <Bath className="h-4 w-4 mr-1" />
                      {listing.bathroomCount} Banyo
                    </p>
                  </div>
                )}
                {listing.parkingCount && (
                  <div className="bg-[#ECF0F1] p-4 rounded-md text-center">
                    <p className="text-[#7F8C8D] text-sm">Otopark</p>
                    <p className="font-semibold text-[#2C3E50] flex items-center justify-center mt-1">
                      <Car className="h-4 w-4 mr-1" />
                      {listing.parkingCount} Park Yeri
                    </p>
                  </div>
                )}
              </div>
              
              {/* Tabs */}
              <Tabs defaultValue="description">
                <TabsList className="w-full bg-[#ECF0F1] p-1">
                  <TabsTrigger value="description" className="flex-1">Açıklama</TabsTrigger>
                  <TabsTrigger value="features" className="flex-1">Özellikler</TabsTrigger>
                  <TabsTrigger value="location" className="flex-1">Konum</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="pt-4">
                  <div className="prose max-w-none">
                    <p className="text-[#2C3E50] whitespace-pre-line">{listing.description}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center p-2 bg-[#ECF0F1] rounded-md">
                      <Home className="h-4 w-4 mr-2 text-[#3498DB]" />
                      <span>Emlak Tipi: {propertyType?.name}</span>
                    </div>
                    <div className="flex items-center p-2 bg-[#ECF0F1] rounded-md">
                      <Ruler className="h-4 w-4 mr-2 text-[#3498DB]" />
                      <span>Alan: {listing.squareMeters} m²</span>
                    </div>
                    {listing.referenceNo && (
                      <div className="flex items-center p-2 bg-[#ECF0F1] rounded-md">
                        <MapPin className="h-4 w-4 mr-2 text-[#3498DB]" />
                        <span>İlan No: {listing.referenceNo}</span>
                      </div>
                    )}
                    {listing.roomCount && (
                      <div className="flex items-center p-2 bg-[#ECF0F1] rounded-md">
                        <Bed className="h-4 w-4 mr-2 text-[#3498DB]" />
                        <span>Oda Sayısı: {listing.roomCount}</span>
                      </div>
                    )}
                    {listing.bathroomCount && (
                      <div className="flex items-center p-2 bg-[#ECF0F1] rounded-md">
                        <Bath className="h-4 w-4 mr-2 text-[#3498DB]" />
                        <span>Banyo Sayısı: {listing.bathroomCount}</span>
                      </div>
                    )}
                    {listing.parkingCount && (
                      <div className="flex items-center p-2 bg-[#ECF0F1] rounded-md">
                        <Car className="h-4 w-4 mr-2 text-[#3498DB]" />
                        <span>Otopark: {listing.parkingCount} Araçlık</span>
                      </div>
                    )}
                    {listing.buildingAge !== null && (
                      <div className="flex items-center p-2 bg-[#ECF0F1] rounded-md">
                        <Calendar className="h-4 w-4 mr-2 text-[#3498DB]" />
                        <span>Bina Yaşı: {listing.buildingAge}</span>
                      </div>
                    )}
                    {listing.heatingType && (
                      <div className="flex items-center p-2 bg-[#ECF0F1] rounded-md">
                        <Home className="h-4 w-4 mr-2 text-[#3498DB]" />
                        <span>Isıtma: {listing.heatingType}</span>
                      </div>
                    )}
                    {listing.isFurnished !== null && (
                      <div className="flex items-center p-2 bg-[#ECF0F1] rounded-md">
                        <Home className="h-4 w-4 mr-2 text-[#3498DB]" />
                        <span>Eşyalı: {listing.isFurnished ? 'Evet' : 'Hayır'}</span>
                      </div>
                    )}
                    {listing.facingDirection && (
                      <div className="flex items-center p-2 bg-[#ECF0F1] rounded-md">
                        <MapPin className="h-4 w-4 mr-2 text-[#3498DB]" />
                        <span>Cephe: {listing.facingDirection}</span>
                      </div>
                    )}
                    {listing.floorNumber !== null && (
                      <div className="flex items-center p-2 bg-[#ECF0F1] rounded-md">
                        <Home className="h-4 w-4 mr-2 text-[#3498DB]" />
                        <span>Kat: {listing.floorNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center p-2 bg-[#ECF0F1] rounded-md">
                      <Calendar className="h-4 w-4 mr-2 text-[#3498DB]" />
                      <span>İlan Tarihi: {formatDate(listing.postedAt)}</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="location" className="pt-4">
                  {listing.latitude && listing.longitude ? (
                    <div className="h-80 bg-[#ECF0F1] rounded-md flex items-center justify-center">
                      <p>Harita burada gösterilecek</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-[#ECF0F1] rounded-md text-center">
                      <p className="text-[#7F8C8D]">Bu ilan için konum bilgisi bulunmamaktadır.</p>
                    </div>
                  )}
                  <div className="mt-4">
                    <p className="font-medium">Adres:</p>
                    <p className="text-[#7F8C8D]">{listing.address}, {listing.neighborhood && `${listing.neighborhood}, `}{listing.district}, {city?.name}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Similar Properties */}
            {similarListings && similarListings.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-[#2C3E50]">Benzer İlanlar</h3>
                  <a href="/listings" className="text-[#3498DB] flex items-center text-sm hover:underline">
                    Tümünü Gör <ArrowRight className="h-4 w-4 ml-1" />
                  </a>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {similarListings.map(similar => (
                    similar.id !== listing.id && (
                      <Card key={similar.id} className="overflow-hidden">
                        <a href={`/listings/${similar.id}`}>
                          <div className="relative h-40">
                            <img 
                              src={similar.imageUrls[0]} 
                              alt={similar.title} 
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-[#2C3E50] truncate">{similar.title}</h4>
                            <p className="text-[#E74C3C] font-bold mt-1">
                              {similar.listingType === 'sell' 
                                ? `₺${formatPrice(similar.price)}` 
                                : `₺${formatPrice(similar.price)}/${similar.rentPeriod === 'monthly' ? 'ay' : 'gün'}`
                              }
                            </p>
                            <p className="text-[#7F8C8D] text-sm flex items-center mt-2">
                              <MapPin className="h-3 w-3 mr-1" />
                              {similar.neighborhood && `${similar.neighborhood}, `}{similar.district}, {city?.name}
                            </p>
                          </CardContent>
                        </a>
                      </Card>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Contact Card */}
            <Card className="overflow-hidden">
              <div className="bg-[#3498DB] p-4 text-white">
                <h3 className="font-semibold text-lg">İletişime Geçin</h3>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img 
                      src="https://randomuser.me/api/portraits/men/32.jpg" 
                      alt="Agent" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <p className="font-medium">Ahmet Yılmaz</p>
                    <p className="text-sm text-[#7F8C8D]">Emlak Danışmanı</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-2" />
                    +90 (212) 123 45 67
                  </Button>
                  <Button variant="outline" className="w-full flex items-center justify-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Mesaj Gönder
                  </Button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-[#ECF0F1]">
                  <p className="text-sm text-[#7F8C8D] mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Emlak Compass üyesi
                  </p>
                  <p className="text-sm text-[#7F8C8D] flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    İlan Tarihi: {formatDate(listing.postedAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Request Info Form */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-4">Bu İlan Hakkında Bilgi İsteyin</h3>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
