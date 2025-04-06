import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
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
  ChevronRight,
  Building,
  Info,
  MapPinned,
  CheckCircle,
  XCircle,
  Clock,
  Tag,
  Briefcase,
  CircleDollarSign,
  Laptop
} from "lucide-react";
import { type Listing, type City, type PropertyType } from "@shared/schema";
import ContactForm from "@/components/ContactForm";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  
  const nextImage = () => {
    if (activeImage < images.length - 1) {
      setActiveImage(activeImage + 1);
    } else {
      setActiveImage(0);
    }
  };
  
  const prevImage = () => {
    if (activeImage > 0) {
      setActiveImage(activeImage - 1);
    } else {
      setActiveImage(images.length - 1);
    }
  };
  
  return (
    <div className="relative">
      {/* Main Image */}
      <div 
        className="w-full h-[60vh] overflow-hidden rounded-lg mb-4 cursor-pointer relative group"
        onClick={() => setShowLightbox(true)}
      >
        <img 
          src={images[activeImage]} 
          alt="Property Image" 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
        />
        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {activeImage + 1} / {images.length}
        </div>
        
        {/* Controls */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-white/80 hover:bg-white rounded-full shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            <ChevronRight className="h-6 w-6 rotate-180" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-white/80 hover:bg-white rounded-full shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Lightbox */}
      <Dialog open={showLightbox} onOpenChange={setShowLightbox}>
        <DialogContent className="max-w-6xl w-full p-0 h-[90vh] flex items-center justify-center bg-black/90">
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={images[activeImage]} 
              alt="Property Image" 
              className="max-h-full max-w-full object-contain" 
            />
            <div className="absolute top-4 right-4 bg-white/20 text-white px-3 py-1 rounded-full text-sm">
              {activeImage + 1} / {images.length}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-4 bg-white/20 hover:bg-white/40 rounded-full"
              onClick={prevImage}
            >
              <ChevronRight className="h-6 w-6 rotate-180 text-white" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 bg-white/20 hover:bg-white/40 rounded-full"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button 
            key={index}
            className={`h-20 overflow-hidden rounded-md ${activeImage === index ? 'ring-2 ring-[#3498DB] opacity-100' : 'opacity-70'}`}
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
  
  // Get listing type text and color
  const getListingTypeInfo = (type: string) => {
    switch(type) {
      case 'sell':
        return { text: 'Satılık', color: 'bg-red-600' };
      case 'rent':
        return { text: 'Kiralık', color: 'bg-blue-600' };
      case 'daily':
        return { text: 'Günlük Kiralık', color: 'bg-green-600' };
      default:
        return { text: 'İlan', color: 'bg-gray-600' };
    }
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
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] py-8 px-4 sm:px-6 lg:px-8 text-white">
        <div className="container mx-auto">
          <div className="flex items-center text-sm mb-4">
            <Link href="/">
              <a className="hover:text-[#3498DB]">Anasayfa</a>
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <Link href="/listings">
              <a className="hover:text-[#3498DB]">İlanlar</a>
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="text-[#3498DB] truncate max-w-[200px]">{listing.title}</span>
          </div>
          <h1 className="font-bold text-2xl md:text-3xl">{listing.title}</h1>
          <p className="text-white/80 flex items-center mt-2 text-sm">
            <MapPin className="h-4 w-4 mr-2" />
            {listing.address}, {listing.neighborhood && `${listing.neighborhood}, `}{listing.district}, {city?.name}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {listing.listingType && (
                <Badge className={`${getListingTypeInfo(listing.listingType).color} text-white px-3 py-1 rounded-md`}>
                  {getListingTypeInfo(listing.listingType).text}
                </Badge>
              )}
              {listing.transactionStatus && (
                <Badge className="bg-purple-600 text-white px-3 py-1 rounded-md">
                  {listing.transactionStatus === 'sold' ? 'Satıldı' : 'Kiralandı'}
                </Badge>
              )}
              {listing.isFeatured && (
                <Badge className="bg-amber-500 text-white px-3 py-1 rounded-md">
                  Öne Çıkan
                </Badge>
              )}
              {listing.status === 'passive' && (
                <Badge className="bg-gray-500 text-white px-3 py-1 rounded-md">
                  Pasif
                </Badge>
              )}
            </div>
          
            {/* Image Gallery */}
            <ImageGallery images={listing.imageUrls} />
            
            {/* Property Info */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6 border border-gray-200">
              {/* Price and Actions */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-100">
                <div>
                  <p className="text-3xl font-bold text-red-600">
                    {`₺${formatPrice(listing.price)}`}
                    {listing.listingType !== 'sell' && (
                      <span className="text-base font-medium text-gray-600">
                        /{listing.listingType === 'daily' ? 'gün' : 'ay'}
                      </span>
                    )}
                  </p>
                  {listing.squareMeters && (
                    <p className="text-gray-600 mt-1 text-sm">
                      {`${formatPrice(Math.round(listing.price / listing.squareMeters))} ₺/m²`}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center rounded-md border-gray-300 hover:bg-gray-50"
                    onClick={toggleFavorite}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center rounded-md border-gray-300 hover:bg-gray-50"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    <span>Paylaş</span>
                  </Button>
                </div>
              </div>
              
              {/* Quick Properties */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-md text-center border border-blue-100">
                  <p className="text-gray-500 text-xs uppercase font-medium">Alan</p>
                  <p className="font-semibold text-gray-800 flex items-center justify-center mt-1">
                    <Ruler className="h-4 w-4 mr-1 text-blue-600" />
                    {listing.squareMeters} m²
                  </p>
                </div>
                {listing.roomCount && (
                  <div className="bg-blue-50 p-4 rounded-md text-center border border-blue-100">
                    <p className="text-gray-500 text-xs uppercase font-medium">Oda</p>
                    <p className="font-semibold text-gray-800 flex items-center justify-center mt-1">
                      <Bed className="h-4 w-4 mr-1 text-blue-600" />
                      {listing.roomCount} Oda
                    </p>
                  </div>
                )}
                {listing.bathroomCount && (
                  <div className="bg-blue-50 p-4 rounded-md text-center border border-blue-100">
                    <p className="text-gray-500 text-xs uppercase font-medium">Banyo</p>
                    <p className="font-semibold text-gray-800 flex items-center justify-center mt-1">
                      <Bath className="h-4 w-4 mr-1 text-blue-600" />
                      {listing.bathroomCount} Banyo
                    </p>
                  </div>
                )}
                {listing.buildingAge !== null ? (
                  <div className="bg-blue-50 p-4 rounded-md text-center border border-blue-100">
                    <p className="text-gray-500 text-xs uppercase font-medium">Bina Yaşı</p>
                    <p className="font-semibold text-gray-800 flex items-center justify-center mt-1">
                      <Building className="h-4 w-4 mr-1 text-blue-600" />
                      {listing.buildingAge} Yaş
                    </p>
                  </div>
                ) : listing.parkingCount ? (
                  <div className="bg-blue-50 p-4 rounded-md text-center border border-blue-100">
                    <p className="text-gray-500 text-xs uppercase font-medium">Otopark</p>
                    <p className="font-semibold text-gray-800 flex items-center justify-center mt-1">
                      <Car className="h-4 w-4 mr-1 text-blue-600" />
                      {listing.parkingCount} Araç
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 p-4 rounded-md text-center border border-blue-100">
                    <p className="text-gray-500 text-xs uppercase font-medium">İlan No</p>
                    <p className="font-semibold text-gray-800 flex items-center justify-center mt-1">
                      <Tag className="h-4 w-4 mr-1 text-blue-600" />
                      {listing.id}
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
            <Card className="overflow-hidden border border-gray-200 shadow-md">
              <div className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] p-4 text-white">
                <h3 className="font-semibold text-lg flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  İletişime Geçin
                </h3>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
                    <img 
                      src={`https://randomuser.me/api/portraits/men/${(listing.id % 50) + 1}.jpg`}
                      alt="Emlak Danışmanı" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Emlak Danışmanı</p>
                    <p className="text-sm text-blue-600">Co Worker Gayrimenkul</p>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">(32 değerlendirme)</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <Button variant="default" className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Hemen Ara
                  </Button>
                  <Button variant="outline" className="w-full flex items-center justify-center border-blue-500 text-blue-600 hover:bg-blue-50">
                    <Mail className="h-4 w-4 mr-2" />
                    Mesaj Gönder
                  </Button>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-gray-800 mb-2">Hızlı İletişim Formu</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Adınız Soyadınız</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Adınız Soyadınız" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Telefon Numaranız</label>
                      <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0(5XX) XXX XX XX" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Mesajınız</label>
                      <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Bu ilan ile ilgili bilgi almak istiyorum..." />
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Gönder</Button>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-gray-600 flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-500" />
                      Co Worker Gayrimenkul
                    </p>
                    <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">Kurumsal</Badge>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    İlan Tarihi: {formatDate(listing.postedAt)}
                  </p>
                  {listing.referenceNo && (
                    <p className="text-sm text-gray-600 flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-blue-500" />
                      İlan No: {listing.referenceNo || listing.id}
                    </p>
                  )}
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
