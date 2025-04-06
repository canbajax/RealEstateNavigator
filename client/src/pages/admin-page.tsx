import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/use-auth";
import { Redirect } from "wouter";
import { 
  Loader2, Settings, User, Home, ListFilter, Plus, 
  Phone, Mail, MapPin, Clock, Facebook, Twitter, 
  Instagram, Linkedin, Check, AlertCircle, Save, RefreshCw,
  Trash, Edit, Upload, X, Image as ImageIcon
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Listing, User as UserType, ContactInfo, WorkingHours, InsertUser, InsertListing } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// API yanıt tipleri
interface AdminStats {
  success: boolean;
  stats: {
    totalUsers: number;
    totalListings: number;
    sellListings: number;
    rentListings: number;
  };
}

// Admin sayfası
export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedUser, setSelectedUser] = useState<Omit<UserType, "password"> | null>(null);
  
  // Kullanıcı ekleme/güncelleme mutasyonu
  const createOrUpdateUserMutation = useMutation({
    mutationFn: async (userData: Omit<UserType, "password"> & { password?: string, avatarFile?: File }) => {
      let url = "/api/users";
      let method = "POST";
      
      if (userData.id) {
        url = `/api/users/${userData.id}`;
        method = "PUT";
      }
      
      // Dosya yükleme işlemi varsa
      if ('avatarFile' in userData && userData.avatarFile) {
        // Dosya yükleme işlemini burada simüle ediyoruz
        // Gerçek API'da dosya yüklemek için FormData kullanılabilir
        console.log("Avatar dosyası yükleniyor:", userData.avatarFile);
        // Burada sadece avatarUrl'i koruyoruz, gerçek uygulamada dosya sunucuya yüklenip URL alınır
      }
      
      // Formdan gönderilmeyen alanları API'dan kaldır
      const userDataToSend = {...userData};
      delete userDataToSend.avatarFile;
      if (!userDataToSend.password) {
        delete userDataToSend.password;
      }
      
      const res = await apiRequest(method, url, userDataToSend);
      return await res.json();
    },
    onSuccess: () => {
      // Cache'i temizle ve dialog'u kapat
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setShowUserDialog(false);
      setSelectedUser(null);
      
      toast({
        title: "Emlakçı kaydedildi",
        description: "Emlakçı bilgileri başarıyla güncellendi.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Emlakçı kaydedilirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Kullanıcı kaydetme fonksiyonu
  const handleSaveUser = () => {
    if (!selectedUser) return;
    
    // Validasyon kontrolleri
    if (!selectedUser.fullName) {
      toast({
        title: "Doğrulama hatası", 
        description: "Lütfen emlakçı adı ve soyadını girin",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedUser.username) {
      toast({
        title: "Doğrulama hatası", 
        description: "Lütfen kullanıcı adı girin",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedUser.email) {
      toast({
        title: "Doğrulama hatası", 
        description: "Lütfen e-posta adresini girin",
        variant: "destructive",
      });
      return;
    }
    
    // Yeni kullanıcı ekliyorsak şifre zorunlu
    if (!selectedUser.id && !('password' in selectedUser)) {
      toast({
        title: "Doğrulama hatası", 
        description: "Lütfen şifre girin",
        variant: "destructive",
      });
      return;
    }
    
    // Kullanıcıyı kaydet
    createOrUpdateUserMutation.mutate(selectedUser as any);
  };
  const [selectedListing, setSelectedListing] = useState<(Listing & { imageFiles?: File[] }) | null>(null);
  
  // İlan ekleme/güncelleme mutasyonu
  const createOrUpdateListingMutation = useMutation({
    mutationFn: async (listingData: Listing & { imageFile?: File }) => {
      let url = "/api/listings";
      let method = "POST";
      
      if (listingData.id) {
        url = `/api/listings/${listingData.id}`;
        method = "PUT";
      }
      
      // Dosya yükleme işlemi varsa
      if ('imageFile' in listingData && listingData.imageFile) {
        // Dosya yükleme işlemini burada simüle ediyoruz
        // Gerçek API'da dosya yüklemek için FormData kullanılabilir
        console.log("İlan resmi yükleniyor:", listingData.imageFile);
        // Burada sadece imageUrls'i koruyoruz, gerçek uygulamada dosya sunucuya yüklenip URL alınır
      }
      
      // Formdan gönderilmeyen alanları API'dan kaldır
      const listingDataToSend = {...listingData};
      delete listingDataToSend.imageFile;
      
      const res = await apiRequest(method, url, listingDataToSend);
      return await res.json();
    },
    onSuccess: () => {
      // Cache'i temizle ve dialog'u kapat
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/featured-listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setShowListingDialog(false);
      setSelectedListing(null);
      
      toast({
        title: "İlan kaydedildi",
        description: "İlan bilgileri başarıyla güncellendi.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `İlan kaydedilirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // İlan kaydetme fonksiyonu
  const handleSaveListing = () => {
    if (!selectedListing) return;
    
    // Validasyon kontrolleri
    if (!selectedListing.title) {
      toast({
        title: "Doğrulama hatası", 
        description: "Lütfen ilan başlığını girin",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedListing.description) {
      toast({
        title: "Doğrulama hatası", 
        description: "Lütfen ilan açıklamasını girin",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedListing.price || selectedListing.price <= 0) {
      toast({
        title: "Doğrulama hatası", 
        description: "Lütfen geçerli bir fiyat girin",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedListing.propertyTypeId) {
      toast({
        title: "Doğrulama hatası", 
        description: "Lütfen emlak tipini seçin",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedListing.cityId) {
      toast({
        title: "Doğrulama hatası", 
        description: "Lütfen şehir seçin",
        variant: "destructive",
      });
      return;
    }
    
    // İlanı kaydet
    createOrUpdateListingMutation.mutate(selectedListing as any);
  };
  const [showUserDialog, setShowUserDialog] = useState<boolean>(false);
  const [showListingDialog, setShowListingDialog] = useState<boolean>(false);
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState<boolean>(false);
  const [showDeleteListingDialog, setShowDeleteListingDialog] = useState<boolean>(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [listingIdToDelete, setListingIdToDelete] = useState<number | null>(null);
  
  // API İstatistikleri
  const { data: statsData } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Kullanıcıları getir
  const { data: usersData, isLoading: isUsersLoading } = useQuery<{ success: boolean; users: UserType[] }>({
    queryKey: ["/api/users"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // İlanları getir
  const { data: listingsData, isLoading: isListingsLoading } = useQuery<Listing[]>({
    queryKey: ["/api/listings"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Şehirleri getir
  const { data: citiesData } = useQuery<{ success: boolean; cities: any[] }>({
    queryKey: ["/api/cities"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Emlak Tiplerini getir
  const { data: propertyTypesData } = useQuery<{ success: boolean; propertyTypes: any[] }>({
    queryKey: ["/api/property-types"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Kullanıcı düzenleme işlevi
  const handleEditUser = (user: Omit<UserType, "password">) => {
    console.log("Admin: Edit user", user.id);
    setSelectedUser(user);
    setShowUserDialog(true);
  };
  
  // Kullanıcı silme işlevi
  const handleDeleteUser = (userId: number) => {
    console.log("Admin: Delete user", userId);
    setUserIdToDelete(userId);
    setShowDeleteUserDialog(true);
  };
  
  // İlan düzenleme işlevi
  const handleEditListing = (listing: Listing) => {
    console.log("Admin: Edit listing", listing.id);
    setSelectedListing(listing);
    setShowListingDialog(true);
  };
  
  // İlan silme işlevi
  const handleDeleteListing = (listingId: number) => {
    console.log("Admin: Delete listing", listingId);
    setListingIdToDelete(listingId);
    setShowDeleteListingDialog(true);
  };

  // Kullanıcı yükleniyorsa yükleme ekranı göster
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa veya admin değilse yönlendir
  if (!user || user.role !== "admin") {
    return <Redirect to="/" />;
  }

  // Emlakçı Silme Mutasyonu
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/users/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Emlakçı silindi",
        description: "Emlakçı başarıyla silindi.",
        variant: "default",
      });
      setShowDeleteUserDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: "Emlakçı silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });
  
  // İlan Silme Mutasyonu
  const deleteListingMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/listings/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/featured-listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "İlan silindi",
        description: "İlan başarıyla silindi.",
        variant: "default",
      });
      setShowDeleteListingDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: "İlan silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });
  
  // Silme işlemlerini gerçekleştir
  const confirmDeleteUser = () => {
    if (userIdToDelete) {
      deleteUserMutation.mutate(userIdToDelete);
    }
  };
  
  const confirmDeleteListing = () => {
    if (listingIdToDelete) {
      deleteListingMutation.mutate(listingIdToDelete);
    }
  };

  // Gösterge Kartı Bileşeni
  function DashboardCard({ 
    title, 
    value, 
    icon 
  }: { 
    title: string, 
    value: string, 
    icon: React.ReactNode 
  }) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
            <div>{icon}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Yönetim Paneli</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview">
            <Home className="h-4 w-4 mr-2" />
            Genel Bakış
          </TabsTrigger>
          <TabsTrigger value="users">
            <User className="h-4 w-4 mr-2" />
            Emlak Danışmanları
          </TabsTrigger>
          <TabsTrigger value="listings">
            <ListFilter className="h-4 w-4 mr-2" />
            İlanlar
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Ayarlar
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsData?.stats ? (
              <>
                <DashboardCard
                  title="Toplam İlanlar"
                  value={statsData.stats.totalListings.toString()}
                  icon={<div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <ListFilter className="h-6 w-6 text-blue-500" />
                  </div>}
                />
                <DashboardCard
                  title="Toplam Emlakçılar"
                  value={statsData.stats.totalUsers.toString()}
                  icon={<div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-green-500" />
                  </div>}
                />
                <DashboardCard
                  title="Satılık İlanlar"
                  value={statsData.stats.sellListings.toString()}
                  icon={<div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <Home className="h-6 w-6 text-orange-500" />
                  </div>}
                />
                <DashboardCard
                  title="Kiralık İlanlar"
                  value={statsData.stats.rentListings.toString()}
                  icon={<div className="h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center">
                    <Home className="h-6 w-6 text-violet-500" />
                  </div>}
                />
              </>
            ) : (
              <>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Toplam İlanlar</p>
                        <p className="text-2xl font-bold">-</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <ListFilter className="h-6 w-6 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Toplam Emlakçılar</p>
                        <p className="text-2xl font-bold">-</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Satılık İlanlar</p>
                        <p className="text-2xl font-bold">-</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <Home className="h-6 w-6 text-orange-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Kiralık İlanlar</p>
                        <p className="text-2xl font-bold">-</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center">
                        <Home className="h-6 w-6 text-violet-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Son Eklenen İlanlar</CardTitle>
                <CardDescription>Son 10 emlak ilanı</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Bu bölüm geliştirme aşamasındadır
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Son Kayıt Olan Emlakçılar</CardTitle>
                <CardDescription>Son 10 emlak danışmanı</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Bu bölüm geliştirme aşamasındadır
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Emlak Danışmanları</CardTitle>
                <CardDescription>Sistemdeki tüm emlak danışmanlarını yönetin</CardDescription>
              </div>
              <Button 
                onClick={() => {
                  setSelectedUser({
                    id: 0,
                    username: "",
                    fullName: "",
                    email: "",
                    phone: "",
                    role: "agent",
                    avatarUrl: "",
                    createdAt: new Date()
                  });
                  setShowUserDialog(true);
                }}
                className="bg-[#3498DB] text-white hover:bg-[#5DADE2]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Danışman Ekle
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Emlakçı</th>
                      <th className="text-left py-3 px-2">E-posta</th>
                      <th className="text-left py-3 px-2">Telefon</th>
                      <th className="text-left py-3 px-2">Rol</th>
                      <th className="text-right py-3 px-2">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isUsersLoading ? (
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2" colSpan={5}>
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-border" />
                          </div>
                        </td>
                      </tr>
                    ) : usersData?.users && usersData.users.length > 0 ? (
                      usersData.users.map((emlakci) => (
                        <tr key={emlakci.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-2">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>{emlakci.fullName ? emlakci.fullName.substring(0, 2).toUpperCase() : 'XX'}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{emlakci.fullName}</p>
                                <p className="text-sm text-muted-foreground">@{emlakci.username}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2">{emlakci.email}</td>
                          <td className="py-3 px-2">{emlakci.phone || "-"}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              emlakci.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                            }`}>
                              {emlakci.role === "admin" ? "Admin" : "Emlakçı"}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <div className="flex justify-end space-x-2">
                              <Button onClick={() => handleEditUser(emlakci)} variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button onClick={() => handleDeleteUser(emlakci.id)} variant="outline" size="icon" className="text-red-500">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-8 px-2 text-center text-muted-foreground" colSpan={5}>
                          Henüz emlakçı bulunmamaktadır
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="listings">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Emlak İlanları</CardTitle>
                <CardDescription>Tüm emlak ilanlarını yönetin</CardDescription>
              </div>
              <Button 
                onClick={() => {
                  setSelectedListing({
                    id: 0,
                    title: "",
                    description: "",
                    price: 0,
                    listingType: "sale",
                    rentPeriod: null,
                    propertyTypeId: 1,
                    cityId: 1,
                    district: "",
                    address: "",
                    squareMeters: 0,
                    roomCount: 1,
                    bathroomCount: 1,
                    parkingCount: 0,
                    imageUrls: [""],
                    userId: user?.id || 1,
                    isFeatured: false,
                    postedAt: new Date(),
                    latitude: null,
                    longitude: null
                  });
                  setShowListingDialog(true);
                }}
                className="bg-[#3498DB] text-white hover:bg-[#5DADE2]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni İlan Ekle
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">İlan Başlığı</th>
                      <th className="text-left py-3 px-2">Fiyat</th>
                      <th className="text-left py-3 px-2">Tür</th>
                      <th className="text-left py-3 px-2">Konum</th>
                      <th className="text-left py-3 px-2">Tarih</th>
                      <th className="text-right py-3 px-2">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isListingsLoading ? (
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2" colSpan={6}>
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-border" />
                          </div>
                        </td>
                      </tr>
                    ) : listingsData && listingsData.length > 0 ? (
                      listingsData.map((listing) => {
                        // Şehir adını bul
                        const city = citiesData?.cities?.find(c => c.id === listing.cityId);
                        
                        return (
                          <tr key={listing.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-2">
                              <div className="font-medium truncate max-w-[200px]">
                                {listing.title}
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(listing.price)}
                            </td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                listing.listingType === "sale" ? "bg-orange-100 text-orange-700" : 
                                listing.listingType === "rent" ? "bg-violet-100 text-violet-700" : 
                                "bg-blue-100 text-blue-700"
                              }`}>
                                {listing.listingType === "sale" ? "Satılık" : 
                                 listing.listingType === "rent" ? "Kiralık" :
                                 listing.listingType === "daily" ? "Günlük Kiralık" :
                                 listing.listingType}
                              </span>
                            </td>
                            <td className="py-3 px-2 truncate max-w-[150px]">
                              {city?.name || "Belirtilmemiş"}
                            </td>
                            <td className="py-3 px-2 text-muted-foreground">
                              {new Date(listing.postedAt).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="py-3 px-2 text-right">
                              <div className="flex justify-end space-x-2">
                                <Button onClick={() => handleEditListing(listing)} variant="outline" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button onClick={() => handleDeleteListing(listing.id)} variant="outline" size="icon" className="text-red-500">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-8 px-2 text-center text-muted-foreground" colSpan={6}>
                          Henüz ilan bulunmamaktadır
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Tabs defaultValue="contact">
            <TabsList className="mb-6">
              <TabsTrigger value="contact">
                <Phone className="h-4 w-4 mr-2" />
                İletişim Bilgileri
              </TabsTrigger>
              <TabsTrigger value="workinghours">
                <Clock className="h-4 w-4 mr-2" />
                Çalışma Saatleri
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>İletişim Bilgileri</CardTitle>
                  <CardDescription>Firma iletişim bilgileri ve sosyal medya adreslerini düzenleyin</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactInfoSettings />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="workinghours">
              <Card>
                <CardHeader>
                  <CardTitle>Çalışma Saatleri</CardTitle>
                  <CardDescription>Firmanızın haftalık çalışma saatlerini ayarlayın</CardDescription>
                </CardHeader>
                <CardContent>
                  <WorkingHoursSettings />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
      
      {/* Emlakçı Silme Dialog */}
      <AlertDialog open={showDeleteUserDialog} onOpenChange={setShowDeleteUserDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emlakçıyı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu emlakçıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteUser}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleteUserMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4" />
              )}
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* İlan Silme Dialog */}
      <AlertDialog open={showDeleteListingDialog} onOpenChange={setShowDeleteListingDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>İlanı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteListing}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleteListingMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4" />
              )}
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Emlakçı Düzenleme Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{selectedUser?.id ? "Emlakçı Düzenle" : "Yeni Emlakçı Ekle"}</DialogTitle>
            <DialogDescription>
              Emlakçı bilgilerini düzenleyin veya yeni emlakçı ekleyin.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Adı Soyadı</Label>
              <Input
                id="fullName"
                value={selectedUser?.fullName || ""}
                onChange={(e) => setSelectedUser(prev => prev ? {...prev, fullName: e.target.value} : null)}
                placeholder="Emlakçı adı ve soyadı"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <Input
                id="username"
                value={selectedUser?.username || ""}
                onChange={(e) => setSelectedUser(prev => prev ? {...prev, username: e.target.value} : null)}
                placeholder="Giriş için kullanıcı adı"
                readOnly={selectedUser?.id ? true : false}
              />
              {selectedUser?.id && (
                <p className="text-xs text-muted-foreground">Kullanıcı adı değiştirilemez</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={selectedUser?.email || ""}
                onChange={(e) => setSelectedUser(prev => prev ? {...prev, email: e.target.value} : null)}
                placeholder="E-posta adresi"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={selectedUser?.phone || ""}
                onChange={(e) => setSelectedUser(prev => prev ? {...prev, phone: e.target.value} : null)}
                placeholder="Telefon numarası"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="avatarUrl">Profil Fotoğrafı</Label>
              <div className="grid gap-2">
                <div className="flex items-center gap-4">
                  <Input
                    id="avatarUrl"
                    value={selectedUser?.avatarUrl || ""}
                    onChange={(e) => setSelectedUser(prev => prev ? {...prev, avatarUrl: e.target.value} : null)}
                    placeholder="Profil fotoğrafı URL'si"
                  />
                  <span className="text-xs text-muted-foreground">veya</span>
                  <div>
                    <Label htmlFor="avatarFile" className="cursor-pointer inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                      Dosya Seç
                    </Label>
                    <input 
                      type="file" 
                      id="avatarFile" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Dosya URL'si oluştur
                          const fileUrl = URL.createObjectURL(file);
                          setSelectedUser(prev => prev ? {...prev, avatarUrl: fileUrl, avatarFile: file} : null);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              {selectedUser?.avatarUrl && (
                <div className="mt-2 p-2 border rounded-md">
                  <div className="text-xs text-muted-foreground mb-2">Profil fotoğrafı:</div>
                  <div className="flex justify-center">
                    <img 
                      src={selectedUser.avatarUrl} 
                      alt={selectedUser.fullName || "Profil"} 
                      className="h-24 w-24 object-cover rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                onChange={(e) => setSelectedUser(prev => prev ? {...prev, password: e.target.value} : null)}
                placeholder={selectedUser?.id ? "Değiştirmek için yeni şifre girin" : "Yeni emlakçı şifresi"}
              />
              {selectedUser?.id && (
                <p className="text-xs text-muted-foreground">Sadece şifreyi değiştirmek isterseniz doldurun</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserDialog(false)}>İptal</Button>
            <Button 
              type="button"
              onClick={handleSaveUser}
              className="bg-[#3498DB] text-white hover:bg-[#5DADE2]"
              disabled={createOrUpdateUserMutation.isPending}
            >
              {createOrUpdateUserMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Kaydet
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* İlan Düzenleme Dialog */}
      <Dialog open={showListingDialog} onOpenChange={setShowListingDialog}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedListing?.id ? "İlan Düzenle" : "Yeni İlan Ekle"}</DialogTitle>
            <DialogDescription>
              İlan detaylarını düzenleyin veya yeni ilan ekleyin.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">İlan Başlığı</Label>
              <Input
                id="title"
                value={selectedListing?.title || ""}
                onChange={(e) => setSelectedListing(prev => prev ? {...prev, title: e.target.value} : null)}
                placeholder="İlan başlığı"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={selectedListing?.description || ""}
                onChange={(e) => setSelectedListing(prev => prev ? {...prev, description: e.target.value} : null)}
                placeholder="İlan açıklaması"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Fiyat (₺)</Label>
                <Input
                  id="price"
                  type="number"
                  value={selectedListing?.price || ""}
                  onChange={(e) => setSelectedListing(prev => prev ? {...prev, price: Number(e.target.value)} : null)}
                  placeholder="İlan fiyatı"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="listingType">İlan Türü</Label>
                <select
                  id="listingType"
                  value={selectedListing?.listingType || "sale"}
                  onChange={(e) => setSelectedListing(prev => prev ? {...prev, listingType: e.target.value} : null)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="sale">Satılık</option>
                  <option value="rent">Kiralık</option>
                  <option value="daily">Günlük Kiralık</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="squareMeters">Metrekare</Label>
                <Input
                  id="squareMeters"
                  type="number"
                  value={selectedListing?.squareMeters || ""}
                  onChange={(e) => setSelectedListing(prev => prev ? {...prev, squareMeters: Number(e.target.value)} : null)}
                  placeholder="Metrekare"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="roomCount">Oda Sayısı</Label>
                <Input
                  id="roomCount"
                  type="number"
                  value={selectedListing?.roomCount || ""}
                  onChange={(e) => setSelectedListing(prev => prev ? {...prev, roomCount: Number(e.target.value)} : null)}
                  placeholder="Oda sayısı"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bathroomCount">Banyo Sayısı</Label>
                <Input
                  id="bathroomCount"
                  type="number"
                  value={selectedListing?.bathroomCount || ""}
                  onChange={(e) => setSelectedListing(prev => prev ? {...prev, bathroomCount: Number(e.target.value)} : null)}
                  placeholder="Banyo sayısı"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="parkingCount">Otopark Yeri</Label>
                <Input
                  id="parkingCount"
                  type="number"
                  value={selectedListing?.parkingCount || ""}
                  onChange={(e) => setSelectedListing(prev => prev ? {...prev, parkingCount: Number(e.target.value)} : null)}
                  placeholder="Otopark yeri sayısı"
                />
              </div>
              
              {selectedListing?.listingType === "rent" || selectedListing?.listingType === "daily" ? (
                <div className="grid gap-2">
                  <Label htmlFor="rentPeriod">Kiralama Periyodu</Label>
                  <select
                    id="rentPeriod"
                    value={selectedListing?.rentPeriod || "monthly"}
                    onChange={(e) => setSelectedListing(prev => prev ? {...prev, rentPeriod: e.target.value} : null)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="daily">Günlük</option>
                    <option value="weekly">Haftalık</option>
                    <option value="monthly">Aylık</option>
                    <option value="yearly">Yıllık</option>
                  </select>
                </div>
              ) : null}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="district">İlçe/Semt</Label>
                <Input
                  id="district"
                  value={selectedListing?.district || ""}
                  onChange={(e) => setSelectedListing(prev => prev ? {...prev, district: e.target.value} : null)}
                  placeholder="İlçe veya semt adı"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="userId">Emlakçı</Label>
                <select
                  id="userId"
                  value={selectedListing?.userId || ""}
                  onChange={(e) => setSelectedListing(prev => prev ? {...prev, userId: Number(e.target.value)} : null)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Emlakçı Seçin</option>
                  {usersData?.users?.filter(user => user.username !== "admin").map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="latitude">Enlem (Opsiyonel)</Label>
                <Input
                  id="latitude"
                  type="text"
                  value={selectedListing?.latitude || ""}
                  onChange={(e) => setSelectedListing(prev => prev ? {...prev, latitude: Number(e.target.value) || null} : null)}
                  placeholder="Harita konumu için enlem"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="longitude">Boylam (Opsiyonel)</Label>
                <Input
                  id="longitude"
                  type="text"
                  value={selectedListing?.longitude || ""}
                  onChange={(e) => setSelectedListing(prev => prev ? {...prev, longitude: Number(e.target.value) || null} : null)}
                  placeholder="Harita konumu için boylam"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="address">Adres</Label>
              <Textarea
                id="address"
                value={selectedListing?.address || ""}
                onChange={(e) => setSelectedListing(prev => prev ? {...prev, address: e.target.value} : null)}
                placeholder="İlan adresi"
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="imageUrls">İlan Görselleri</Label>
              <div className="grid gap-2">
                <div className="flex flex-col gap-2">
                  <div>
                    <Label htmlFor="imageFiles" className="cursor-pointer inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                      <Upload className="mr-2 h-4 w-4" /> Görselleri Seç
                    </Label>
                    <input 
                      type="file" 
                      id="imageFiles" 
                      className="hidden" 
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          // Dosya URL'leri oluştur
                          const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
                          setSelectedListing(prev => prev ? {
                            ...prev, 
                            imageUrls: [...(prev.imageUrls || []), ...fileUrls],
                            imageFiles: [...(prev.imageFiles || []), ...Array.from(files)]
                          } : null);
                        }
                      }}
                    />
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1">Birden fazla görsel seçebilirsiniz. Her seferinde yeni görseller ekleyebilirsiniz.</p>
                  
                  {selectedListing?.imageUrls && selectedListing.imageUrls.length > 0 ? (
                    <div className="mt-2 p-2 border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">Yüklenen Görseller ({selectedListing.imageUrls.length})</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-destructive hover:text-destructive/90"
                          onClick={() => setSelectedListing(prev => prev ? {...prev, imageUrls: [], imageFiles: []} : null)}
                        >
                          <Trash className="h-4 w-4 mr-1" /> Tümünü Temizle
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {selectedListing.imageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={url} 
                              alt={`Görsel ${index + 1}`} 
                              className="h-24 w-full object-cover rounded-md"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-white"
                                onClick={() => {
                                  const newUrls = [...selectedListing.imageUrls];
                                  newUrls.splice(index, 1);
                                  
                                  const newFiles = [...(selectedListing.imageFiles || [])];
                                  if (newFiles.length > index) {
                                    newFiles.splice(index, 1);
                                  }
                                  
                                  setSelectedListing(prev => prev ? {
                                    ...prev, 
                                    imageUrls: newUrls,
                                    imageFiles: newFiles
                                  } : null);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-4 border border-dashed rounded-md">
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="mx-auto h-8 w-8 mb-2" />
                        <p>Henüz görsel eklenmemiş</p>
                        <p className="text-xs">En az bir görsel eklemeniz önerilir</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cityId">Şehir</Label>
                <select
                  id="cityId"
                  value={selectedListing?.cityId || ""}
                  onChange={(e) => setSelectedListing(prev => prev ? {...prev, cityId: Number(e.target.value)} : null)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Şehir Seçin</option>
                  {citiesData?.cities?.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="propertyTypeId">Emlak Tipi</Label>
                <select
                  id="propertyTypeId"
                  value={selectedListing?.propertyTypeId || ""}
                  onChange={(e) => setSelectedListing(prev => prev ? {...prev, propertyTypeId: Number(e.target.value)} : null)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Emlak Tipi Seçin</option>
                  {propertyTypesData?.propertyTypes?.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="isFeatured"
                checked={selectedListing?.isFeatured || false}
                onCheckedChange={(checked) => setSelectedListing(prev => prev ? {...prev, isFeatured: checked} : null)}
              />
              <Label htmlFor="isFeatured">Öne Çıkan İlan</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowListingDialog(false)}>İptal</Button>
            <Button 
              type="button"
              onClick={handleSaveListing}
              className="bg-[#3498DB] text-white hover:bg-[#5DADE2]"
              disabled={createOrUpdateListingMutation.isPending}
            >
              {createOrUpdateListingMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Kaydet
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ContactInfoSettings bileşeni
function ContactInfoSettings() {
  // İletişim bilgilerini çek
  const { data, isLoading, error } = useQuery<{ success: boolean; contactInfo: ContactInfo }>({
    queryKey: ["/api/site-settings/contact-info"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Form state
  const [formData, setFormData] = useState<ContactInfo>({
    address: "",
    email: "",
    phone: "",
    whatsapp: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: ""
  });
  
  // İletişim bilgilerini güncelleme mutasyonu
  const updateContactMutation = useMutation({
    mutationFn: async (contactInfo: ContactInfo) => {
      const res = await apiRequest("POST", "/api/site-settings/contact-info", contactInfo);
      return await res.json();
    },
    onSuccess: () => {
      // Tüm site verilerini yenileme
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings/contact-info"] });
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings/working-hours"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/featured-listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/property-types"] });
      
      toast({
        title: "İletişim bilgileri güncellendi",
        description: "İletişim bilgileri başarıyla kaydedildi. Tüm site verileri yenilendi.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: "İletişim bilgileri güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });
  
  // Veriler yüklendiğinde formu doldur
  useEffect(() => {
    if (data?.contactInfo) {
      setFormData(data.contactInfo);
    }
  }, [data]);
  
  // Form alanı değişikliği
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Form gönderimi
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactMutation.mutate(formData);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="address">Adres</Label>
            <Textarea 
              id="address" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              rows={3}
              placeholder="Firma adresini girin" 
            />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <div className="flex">
                <Mail className="w-4 h-4 mr-2 mt-2.5 text-muted-foreground" />
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="E-posta adresini girin" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <div className="flex">
                <Phone className="w-4 h-4 mr-2 mt-2.5 text-muted-foreground" />
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="Telefon numarasını girin" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (Opsiyonel)</Label>
              <div className="flex">
                <Phone className="w-4 h-4 mr-2 mt-2.5 text-muted-foreground" />
                <Input 
                  id="whatsapp" 
                  name="whatsapp" 
                  value={formData.whatsapp || ""} 
                  onChange={handleChange} 
                  placeholder="WhatsApp numarasını girin" 
                />
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <h3 className="text-lg font-semibold mb-4">Sosyal Medya Hesapları</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook URL (Opsiyonel)</Label>
            <div className="flex">
              <Facebook className="w-4 h-4 mr-2 mt-2.5 text-muted-foreground" />
              <Input 
                id="facebook" 
                name="facebook" 
                value={formData.facebook || ""} 
                onChange={handleChange} 
                placeholder="Facebook sayfası URL'si" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter URL (Opsiyonel)</Label>
            <div className="flex">
              <Twitter className="w-4 h-4 mr-2 mt-2.5 text-muted-foreground" />
              <Input 
                id="twitter" 
                name="twitter" 
                value={formData.twitter || ""} 
                onChange={handleChange} 
                placeholder="Twitter hesabı URL'si" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram URL (Opsiyonel)</Label>
            <div className="flex">
              <Instagram className="w-4 h-4 mr-2 mt-2.5 text-muted-foreground" />
              <Input 
                id="instagram" 
                name="instagram" 
                value={formData.instagram || ""} 
                onChange={handleChange} 
                placeholder="Instagram hesabı URL'si" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn URL (Opsiyonel)</Label>
            <div className="flex">
              <Linkedin className="w-4 h-4 mr-2 mt-2.5 text-muted-foreground" />
              <Input 
                id="linkedin" 
                name="linkedin" 
                value={formData.linkedin || ""} 
                onChange={handleChange} 
                placeholder="LinkedIn sayfası URL'si" 
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="bg-[#3498DB] text-white hover:bg-[#5DADE2]"
          disabled={updateContactMutation.isPending}
        >
          {updateContactMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Değişiklikleri Kaydet
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// WorkingHoursSettings bileşeni
function WorkingHoursSettings() {
  // Çalışma saatleri verilerini çek
  const { data, isLoading, error } = useQuery<{ success: boolean; workingHours: WorkingHours }>({
    queryKey: ["/api/site-settings/working-hours"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Form state
  const [formData, setFormData] = useState<WorkingHours>({
    monday: { open: "09:00", close: "18:00" },
    tuesday: { open: "09:00", close: "18:00" },
    wednesday: { open: "09:00", close: "18:00" },
    thursday: { open: "09:00", close: "18:00" },
    friday: { open: "09:00", close: "18:00" },
    saturday: { open: "10:00", close: "14:00", isOpen: true },
    sunday: { open: "10:00", close: "14:00", isOpen: false }
  });
  
  // Çalışma saatlerini güncelleme mutasyonu
  const updateWorkingHoursMutation = useMutation({
    mutationFn: async (workingHours: WorkingHours) => {
      const res = await apiRequest("POST", "/api/site-settings/working-hours", workingHours);
      return await res.json();
    },
    onSuccess: () => {
      // Tüm site verilerini yenileme
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings/contact-info"] });
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings/working-hours"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/featured-listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/property-types"] });
      
      toast({
        title: "Çalışma saatleri güncellendi",
        description: "Çalışma saatleri başarıyla kaydedildi. Tüm site verileri yenilendi.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: "Çalışma saatleri güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });
  
  // Veriler yüklendiğinde formu doldur
  useEffect(() => {
    if (data?.workingHours) {
      setFormData(data.workingHours);
    }
  }, [data]);
  
  // Saat değişikliği
  const handleTimeChange = (
    day: keyof WorkingHours, 
    field: 'open' | 'close', 
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };
  
  // Açık/Kapalı durumu değişikliği (Cumartesi/Pazar için)
  const handleIsOpenChange = (day: 'saturday' | 'sunday', isOpen: boolean) => {
    setFormData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen
      }
    }));
  };
  
  // Form gönderimi
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkingHoursMutation.mutate(formData);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Hafta içi günler */}
        {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const).map((day) => {
          const dayNames = {
            monday: 'Pazartesi',
            tuesday: 'Salı',
            wednesday: 'Çarşamba',
            thursday: 'Perşembe',
            friday: 'Cuma'
          };
          
          return (
            <div key={day} className="grid grid-cols-3 items-center gap-4">
              <div className="font-medium">{dayNames[day]}</div>
              <div className="flex items-center space-x-2">
                <Input
                  type="time"
                  value={formData[day].open}
                  onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                  className="w-full"
                />
                <span>-</span>
                <Input
                  type="time"
                  value={formData[day].close}
                  onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex items-center text-green-600">
                <Check className="h-5 w-5 mr-1" />
                <span>Açık</span>
              </div>
            </div>
          );
        })}
        
        {/* Hafta sonu */}
        {(['saturday', 'sunday'] as const).map((day) => {
          const dayNames = {
            saturday: 'Cumartesi',
            sunday: 'Pazar'
          };
          
          return (
            <div key={day} className="grid grid-cols-3 items-center gap-4">
              <div className="font-medium">{dayNames[day]}</div>
              <div className="flex items-center space-x-2">
                <Input
                  type="time"
                  value={formData[day].open}
                  onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                  className="w-full"
                  disabled={!formData[day].isOpen}
                />
                <span>-</span>
                <Input
                  type="time"
                  value={formData[day].close}
                  onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                  className="w-full"
                  disabled={!formData[day].isOpen}
                />
              </div>
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  <Switch
                    checked={formData[day].isOpen}
                    onCheckedChange={(checked) => handleIsOpenChange(day, checked)}
                  />
                </div>
                <div className="text-sm">
                  {formData[day].isOpen ? (
                    <span className="text-green-600">Açık</span>
                  ) : (
                    <span className="text-red-600">Kapalı</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="bg-[#3498DB] text-white hover:bg-[#5DADE2]"
          disabled={updateWorkingHoursMutation.isPending}
        >
          {updateWorkingHoursMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Değişiklikleri Kaydet
            </>
          )}
        </Button>
      </div>
    </form>
  );
}