import { useState, useEffect } from "react";
import { useAuth } from "../hooks/use-auth";
import { Redirect } from "wouter";
import { 
  Loader2, Settings, User, Home, ListFilter, Plus, 
  Phone, Mail, MapPin, Clock, Facebook, Twitter, 
  Instagram, Linkedin, Check, AlertCircle, Save, RefreshCw
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
import { Listing, User as UserType, ContactInfo, WorkingHours } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

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
          <AdminStatsCards />
          
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
              <Button className="bg-[#3498DB] text-white hover:bg-[#5DADE2]">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Danışman Ekle
              </Button>
            </CardHeader>
            <CardContent>
              <UsersTable />
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
              <Button className="bg-[#3498DB] text-white hover:bg-[#5DADE2]">
                <Plus className="h-4 w-4 mr-2" />
                Yeni İlan Ekle
              </Button>
            </CardHeader>
            <CardContent>
              <ListingsTable />
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
    </div>
  );
}

// İstatistik kartları bileşeni
function AdminStatsCards() {
  // İstatistik verilerini çek
  const { data: statsData, isLoading, error } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                  <div className="h-7 w-16 animate-pulse rounded bg-muted"></div>
                </div>
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !statsData) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center text-red-500">
          <p>İstatistik verileri yüklenirken bir hata oluştu.</p>
        </CardContent>
      </Card>
    );
  }

  const { stats } = statsData;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Toplam İlanlar"
        value={stats.totalListings.toString()}
        icon={<ListFilter className="h-8 w-8 text-blue-500" />}
      />
      <DashboardCard
        title="Toplam Emlakçılar"
        value={stats.totalUsers.toString()}
        icon={<User className="h-8 w-8 text-green-500" />}
      />
      <DashboardCard
        title="Satılık İlanlar"
        value={stats.sellListings.toString()}
        icon={<Home className="h-8 w-8 text-orange-500" />}
      />
      <DashboardCard
        title="Kiralık İlanlar"
        value={stats.rentListings.toString()}
        icon={<Home className="h-8 w-8 text-violet-500" />}
      />
    </div>
  );
}

// Kullanıcılar tablosu
function UsersTable() {
  // Kullanıcı verilerini çek
  const { data: userData, isLoading, error } = useQuery<{ success: boolean; users: Omit<UserType, "password">[] }>({
    queryKey: ["/api/users"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">Kullanıcılar yüklenirken bir hata oluştu.</p>
      </div>
    );
  }

  if (userData.users.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Henüz kayıtlı emlakçı bulunmamaktadır.</p>
      </div>
    );
  }

  return (
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
          {userData.users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl || ""} alt={user.fullName} />
                    <AvatarFallback className="bg-[#3498DB] text-white">
                      {user.fullName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user.fullName}</span>
                </div>
              </td>
              <td className="py-3 px-2">{user.email}</td>
              <td className="py-3 px-2">{user.phone || "-"}</td>
              <td className="py-3 px-2 capitalize">{user.role}</td>
              <td className="py-3 px-2 text-right">
                <Button variant="ghost" size="sm">Düzenle</Button>
                {user.role !== "admin" && (
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">Sil</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// İlanlar tablosu
function ListingsTable() {
  // İlan verilerini çek
  const { data: listings, isLoading, error } = useQuery<Listing[]>({
    queryKey: ["/api/listings"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (error || !listings) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">İlanlar yüklenirken bir hata oluştu.</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Henüz kayıtlı ilan bulunmamaktadır.</p>
      </div>
    );
  }

  return (
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
          {listings.map((listing) => (
            <tr key={listing.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-2">
                <div className="flex items-center gap-2">
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.title}
                    className="h-10 w-10 object-cover rounded"
                  />
                  <span className="line-clamp-1">{listing.title}</span>
                </div>
              </td>
              <td className="py-3 px-2">
                {listing.price.toLocaleString("tr-TR")} ₺
                {listing.listingType === "rent" && (
                  <span className="text-xs text-muted-foreground">/ay</span>
                )}
              </td>
              <td className="py-3 px-2 capitalize">
                {listing.listingType === "sell" ? "Satılık" : "Kiralık"}
              </td>
              <td className="py-3 px-2">{listing.district}</td>
              <td className="py-3 px-2">
                {new Date(listing.postedAt).toLocaleDateString("tr-TR")}
              </td>
              <td className="py-3 px-2 text-right">
                <Button variant="ghost" size="sm">Düzenle</Button>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">Sil</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings/contact-info"] });
      toast({
        title: "İletişim bilgileri güncellendi",
        description: "İletişim bilgileri başarıyla kaydedildi.",
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
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings/working-hours"] });
      toast({
        title: "Çalışma saatleri güncellendi",
        description: "Çalışma saatleri başarıyla kaydedildi.",
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
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}